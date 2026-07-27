import { NextRequest } from "next/server";
import path from "path";
import fs from "fs";

const WORKER_PATH = path.resolve(
  process.cwd(),
  "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"
);

async function extractWithPdfjs(buffer: Buffer): Promise<string> {
  const { getDocument, GlobalWorkerOptions } = await import(
    "pdfjs-dist/legacy/build/pdf.mjs"
  );

  if (fs.existsSync(WORKER_PATH)) {
    GlobalWorkerOptions.workerSrc = WORKER_PATH;
  }

  const loadingTask = getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text +=
      content.items.map((item) => ("str" in item ? item.str : "")).join(" ") +
      "\n\n";
    page.cleanup();
  }

  await pdf.destroy();
  return text.trim();
}

function extractFallback(pdfBuffer: Buffer): string {
  const content = pdfBuffer.toString("latin1");
  const textParts: string[] = [];
  let i = 0;

  while (i < content.length) {
    const bt = content.indexOf("BT", i);
    if (bt === -1) break;
    const et = content.indexOf("ET", bt);
    if (et === -1) break;

    const block = content.substring(bt, et + 2);
    const parenMatches = block.match(/\(([^)]*)\)/g);
    if (parenMatches) {
      for (const match of parenMatches) {
        const inner = match.slice(1, -1);
        const decoded = inner
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\([0-7]{3})/g, (_, oct: string) =>
            String.fromCharCode(parseInt(oct, 8))
          )
          .replace(/\\(.)/g, "$1");
        if (decoded.trim()) {
          textParts.push(decoded);
        }
      }
    }
    i = et + 2;
  }

  return textParts.join(" ");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "File is required" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    try {
      text = await extractWithPdfjs(buffer);
    } catch {
      text = extractFallback(buffer);
    }

    if (!text.trim()) {
      return Response.json(
        {
          error:
            "Could not extract any text from this PDF. Try converting it to a .txt file and uploading that instead.",
        },
        { status: 400 }
      );
    }

    return Response.json({ text });
  } catch (error) {
    console.error("PDF extraction error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to extract text from PDF",
      },
      { status: 500 }
    );
  }
}

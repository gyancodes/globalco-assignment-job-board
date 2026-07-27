import { NextRequest } from "next/server";

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

    // Require inside handler so any import errors are caught by try/catch
    // and always return JSON (not an HTML crash page).
    // pdf-parse v2 uses a class-based API with { data, verbosity } options.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PDFParse } = require("pdf-parse");
    const parser = new PDFParse({ data: buffer, verbosity: 0 });
    const result = await parser.getText();
    const text = (
      result?.text ??
      result?.pages?.map((p: { text: string }) => p.text).join("\n") ??
      ""
    ).trim();

    if (!text) {
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


import { NextRequest, NextResponse } from "next/server";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided." }, { status: 400 });
    }

    console.log(`[PDF Engine] Processing: ${file.name} (${file.size} bytes)`);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      throw new Error("Uploaded file is empty.");
    }

    let pdfModule: any;
    try {
      pdfModule = require("pdf-parse");
    } catch (e: any) {
      console.warn("[PDF Engine] Standard require failed, trying sub-paths...");
      try {
        pdfModule = require("pdf-parse/lib/pdf-parse.js");
      } catch (e2) {
        pdfModule = require("pdf-parse/index.js");
      }
    }

    // Comprehensive search for the parsing function (including v2.x patterns)
    let parseFn: any = null;
    
    if (typeof pdfModule === 'function') {
      parseFn = pdfModule;
    } else if (pdfModule) {
      // Check for common export keys in different versions
      parseFn = pdfModule.PDFParse || 
                pdfModule.default || 
                pdfModule.pdf || 
                pdfModule.parse;
    }

    if (!parseFn || typeof parseFn !== 'function') {
      console.error("[PDF Engine] Module Structure:", Object.keys(pdfModule || {}));
      console.error("[PDF Engine] Module Type:", typeof pdfModule);
      throw new Error("Could not find a valid parsing function in the PDF module.");
    }

    console.log("[PDF Engine] Executing parse function...");
    
    let result: any;
    try {
      // Some versions might require a new instance, others are direct calls
      result = await parseFn(buffer);
    } catch (parseErr: any) {
      console.warn("[PDF Engine] Direct call failed, trying constructor...", parseErr.message);
      try {
        const parser = new parseFn();
        result = await parser.parse(buffer);
      } catch (consErr: any) {
        throw new Error(`Parse failed: ${parseErr.message}`);
      }
    }

    const text = result?.text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Extraction returned no text. The PDF might be image-based or encrypted." },
        { status: 422 }
      );
    }

    console.log(`[PDF Engine] Success! Extracted ${text.length} chars.`);

    return NextResponse.json({ 
      text, 
      pageCount: result.numpages || result.numPages 
    });
  } catch (err: any) {
    console.error("[PDF Engine] Fatal error:", err);
    return NextResponse.json(
      { error: `Extraction failed: ${err.message || "Internal Server Error"}` },
      { status: 500 }
    );
  }
}

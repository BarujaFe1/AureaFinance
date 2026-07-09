import { NextResponse } from "next/server";
import { inventoryWorkbook } from "@/features/import/services/inventory";
import { MAX_IMPORT_FILE_BYTES } from "@/lib/constants";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
  }

  if (file.size > MAX_IMPORT_FILE_BYTES) {
    return NextResponse.json(
      { error: `Arquivo excede o limite de ${Math.round(MAX_IMPORT_FILE_BYTES / (1024 * 1024))} MB.` },
      { status: 413 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));
  const inventory = inventoryWorkbook(buffer);

  return NextResponse.json(inventory);
}

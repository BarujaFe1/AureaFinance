import { NextResponse } from "next/server";
import { inventoryWorkbook } from "@/features/import/services/inventory";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));
  const inventory = inventoryWorkbook(buffer);

  return NextResponse.json(inventory);
}

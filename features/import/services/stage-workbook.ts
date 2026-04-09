import { inventoryWorkbook } from "@/features/import/services/inventory";
import { ingestWorkbook } from "@/services/import.service";

export async function stageWorkbookImport(params: {
  buffer: Buffer;
  fileName: string;
  sourceLabel?: string;
}) {
  const arrayBuffer = params.buffer.buffer.slice(
    params.buffer.byteOffset,
    params.buffer.byteOffset + params.buffer.byteLength
  ) as ArrayBuffer;

  const batchId = await ingestWorkbook(params.fileName, arrayBuffer);
  const inventory = inventoryWorkbook(params.buffer);

  return {
    batchId,
    inventory,
    sourceLabel: params.sourceLabel ?? null
  };
}

import { and, eq, isNull } from "drizzle-orm";
import { db, tableExists } from "@/db/client";
import { entityArchives } from "@/db/schema";
import { nowTs } from "@/lib/dates";
import { uid, toJson } from "@/lib/utils";

export type ArchivableEntityType =
  | "account"
  | "category"
  | "tag"
  | "reserve"
  | "stock"
  | "crypto"
  | "credit_card"
  | "recurring_rule";

function ensureArchiveTable() {
  if (!tableExists("entity_archives")) return [] as Array<typeof entityArchives.$inferSelect>;
  return db.select().from(entityArchives).all();
}

export function listArchivedEntityIds(entityType: ArchivableEntityType) {
  return ensureArchiveTable()
    .filter((row) => row.entityType === entityType && row.restoredAt == null)
    .map((row) => row.entityId);
}

export function isEntityArchived(entityType: ArchivableEntityType, entityId: string) {
  return ensureArchiveTable().some((row) => row.entityType === entityType && row.entityId === entityId && row.restoredAt == null);
}

export function archiveEntity(entityType: ArchivableEntityType, entityId: string, reason = "", metadata: unknown = {}) {
  if (!tableExists("entity_archives")) return;
  const existing = db.select().from(entityArchives).where(and(eq(entityArchives.entityType, entityType), eq(entityArchives.entityId, entityId))).get();
  const now = nowTs();
  if (existing) {
    db.update(entityArchives)
      .set({ reason, metadataJson: toJson(metadata), archivedAt: now, restoredAt: null, updatedAt: now })
      .where(eq(entityArchives.id, existing.id))
      .run();
    return existing.id;
  }
  const id = uid("arc");
  db.insert(entityArchives).values({
    id,
    entityType,
    entityId,
    reason,
    metadataJson: toJson(metadata),
    archivedAt: now,
    restoredAt: null,
    createdAt: now,
    updatedAt: now
  }).run();
  return id;
}

export function restoreEntity(entityType: ArchivableEntityType, entityId: string) {
  if (!tableExists("entity_archives")) return;
  const existing = db.select().from(entityArchives).where(and(eq(entityArchives.entityType, entityType), eq(entityArchives.entityId, entityId), isNull(entityArchives.restoredAt))).get();
  if (!existing) return;
  const now = nowTs();
  db.update(entityArchives)
    .set({ restoredAt: now, updatedAt: now })
    .where(eq(entityArchives.id, existing.id))
    .run();
}

import { db } from "@/db/client";
import { netWorthSummaries } from "@/db/schema";
import { getCurrentNetWorthSummary } from "@/services/net-worth.service";
import { desc } from "drizzle-orm";

export function getNetWorthPageData() {
  const summary = getCurrentNetWorthSummary();
  const history = db
    .select()
    .from(netWorthSummaries)
    .orderBy(desc(netWorthSummaries.month), desc(netWorthSummaries.updatedAt))
    .all();

  return {
    summary,
    history
  };
}

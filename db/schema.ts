import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  type: text("type").notNull(),
  institution: text("institution").default(""),
  openingBalanceCents: integer("opening_balance_cents").notNull().default(0),
  color: text("color").default("#5b7cfa"),
  notes: text("notes").default(""),
  includeInNetWorth: integer("include_in_net_worth", { mode: "boolean" }).notNull().default(true),
  isArchived: integer("is_archived", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  slugUnique: uniqueIndex("accounts_slug_unique").on(table.slug),
  typeIdx: index("accounts_type_idx").on(table.type)
}));

export const accountBalanceSnapshots = sqliteTable("account_balance_snapshots", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  snapshotDate: text("snapshot_date").notNull(),
  balanceCents: integer("balance_cents").notNull(),
  source: text("source").notNull().default("manual"),
  createdAt: integer("created_at").notNull()
}, (table: any) => ({
  accountDateUnique: uniqueIndex("account_balance_snapshots_account_date_unique").on(table.accountId, table.snapshotDate)
}));

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  kind: text("kind").notNull().default("expense"),
  color: text("color").default("#7c83ff"),
  icon: text("icon").default("circle"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  slugUnique: uniqueIndex("categories_slug_unique").on(table.slug)
}));

export const subcategories = sqliteTable("subcategories", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  color: text("color").default("#8f96ff"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  categoryIdx: index("subcategories_category_idx").on(table.categoryId),
  slugUnique: uniqueIndex("subcategories_slug_unique").on(table.categoryId, table.slug)
}));

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  color: text("color").default("#9498a4"),
  createdAt: integer("created_at").notNull()
}, (table: any) => ({
  slugUnique: uniqueIndex("tags_slug_unique").on(table.slug)
}));

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  accountId: text("account_id").references(() => accounts.id, { onDelete: "set null" }),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  subcategoryId: text("subcategory_id").references(() => subcategories.id, { onDelete: "set null" }),
  transferId: text("transfer_id"),
  recurringOccurrenceId: text("recurring_occurrence_id"),
  sourceImportRowId: text("source_import_row_id"),
  direction: text("direction").notNull(),
  status: text("status").notNull().default("posted"),
  description: text("description").notNull(),
  counterparty: text("counterparty").default(""),
  amountCents: integer("amount_cents").notNull(),
  occurredOn: text("occurred_on").notNull(),
  dueOn: text("due_on"),
  competenceMonth: text("competence_month").notNull(),
  notes: text("notes").default(""),
  isProjected: integer("is_projected", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  accountIdx: index("transactions_account_idx").on(table.accountId),
  dateIdx: index("transactions_occurred_on_idx").on(table.occurredOn),
  monthIdx: index("transactions_competence_month_idx").on(table.competenceMonth)
}));

export const transactionTags = sqliteTable("transaction_tags", {
  transactionId: text("transaction_id").notNull().references(() => transactions.id, { onDelete: "cascade" }),
  tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" })
}, (table: any) => ({
  unique: uniqueIndex("transaction_tags_unique").on(table.transactionId, table.tagId)
}));

export const transfers = sqliteTable("transfers", {
  id: text("id").primaryKey(),
  fromAccountId: text("from_account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  toAccountId: text("to_account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  amountCents: integer("amount_cents").notNull(),
  occurredOn: text("occurred_on").notNull(),
  notes: text("notes").default(""),
  outTransactionId: text("out_transaction_id"),
  inTransactionId: text("in_transaction_id"),
  createdAt: integer("created_at").notNull()
});

export const recurringRules = sqliteTable("recurring_rules", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  direction: text("direction").notNull(),
  frequency: text("frequency").notNull(),
  amountCents: integer("amount_cents").notNull(),
  startsOn: text("starts_on").notNull(),
  endsOn: text("ends_on"),
  nextRunOn: text("next_run_on").notNull(),
  autoPost: integer("auto_post", { mode: "boolean" }).notNull().default(false),
  notes: text("notes").default(""),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const recurringOccurrences = sqliteTable("recurring_occurrences", {
  id: text("id").primaryKey(),
  ruleId: text("rule_id").notNull().references(() => recurringRules.id, { onDelete: "cascade" }),
  dueOn: text("due_on").notNull(),
  amountCents: integer("amount_cents").notNull(),
  direction: text("direction").notNull(),
  status: text("status").notNull().default("scheduled"),
  transactionId: text("transaction_id").references(() => transactions.id, { onDelete: "set null" }),
  notes: text("notes").default(""),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  ruleDueUnique: uniqueIndex("recurring_occurrences_rule_due_unique").on(table.ruleId, table.dueOn)
}));

export const creditCards = sqliteTable("credit_cards", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  brand: text("brand").default(""),
  network: text("network").default(""),
  settlementAccountId: text("settlement_account_id").notNull().references(() => accounts.id, { onDelete: "restrict" }),
  limitTotalCents: integer("limit_total_cents").notNull(),
  closeDay: integer("close_day").notNull(),
  dueDay: integer("due_day").notNull(),
  color: text("color").default("#111827"),
  isArchived: integer("is_archived", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  slugUnique: uniqueIndex("credit_cards_slug_unique").on(table.slug)
}));

export const creditCardBills = sqliteTable("credit_card_bills", {
  id: text("id").primaryKey(),
  creditCardId: text("credit_card_id").notNull().references(() => creditCards.id, { onDelete: "cascade" }),
  billMonth: text("bill_month").notNull(),
  closesOn: text("closes_on").notNull(),
  dueOn: text("due_on").notNull(),
  totalAmountCents: integer("total_amount_cents").notNull().default(0),
  paidAmountCents: integer("paid_amount_cents").notNull().default(0),
  status: text("status").notNull().default("open"),
  settlementTransactionId: text("settlement_transaction_id").references(() => transactions.id, { onDelete: "set null" }),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  uniqueMonth: uniqueIndex("credit_card_bills_card_month_unique").on(table.creditCardId, table.billMonth),
  dueIdx: index("credit_card_bills_due_on_idx").on(table.dueOn)
}));

export const cardPurchases = sqliteTable("card_purchases", {
  id: text("id").primaryKey(),
  creditCardId: text("credit_card_id").notNull().references(() => creditCards.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  subcategoryId: text("subcategory_id").references(() => subcategories.id, { onDelete: "set null" }),
  firstBillId: text("first_bill_id").references(() => creditCardBills.id, { onDelete: "set null" }),
  description: text("description").notNull(),
  merchant: text("merchant").default(""),
  purchaseDate: text("purchase_date").notNull(),
  totalAmountCents: integer("total_amount_cents").notNull(),
  installmentCount: integer("installment_count").notNull().default(1),
  notes: text("notes").default(""),
  purchaseType: text("purchase_type").notNull().default("parcelado"),
  responsible: text("responsible").default(""),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const cardInstallments = sqliteTable("card_installments", {
  id: text("id").primaryKey(),
  purchaseId: text("purchase_id").notNull().references(() => cardPurchases.id, { onDelete: "cascade" }),
  billId: text("bill_id").notNull().references(() => creditCardBills.id, { onDelete: "cascade" }),
  installmentNumber: integer("installment_number").notNull(),
  totalInstallments: integer("total_installments").notNull(),
  amountCents: integer("amount_cents").notNull(),
  status: text("status").notNull().default("billed"),
  dueOn: text("due_on").notNull(),
  createdAt: integer("created_at").notNull()
}, (table: any) => ({
  billIdx: index("card_installments_bill_idx").on(table.billId),
  uniqueInstallment: uniqueIndex("card_installments_purchase_number_unique").on(table.purchaseId, table.installmentNumber)
}));

export const billEntries = sqliteTable("bill_entries", {
  id: text("id").primaryKey(),
  billId: text("bill_id").notNull().references(() => creditCardBills.id, { onDelete: "cascade" }),
  entryType: text("entry_type").notNull(),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  purchaseId: text("purchase_id").references(() => cardPurchases.id, { onDelete: "set null" }),
  installmentId: text("installment_id").references(() => cardInstallments.id, { onDelete: "set null" }),
  createdAt: integer("created_at").notNull()
});

export const reminders = sqliteTable("reminders", {
  id: text("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  title: text("title").notNull(),
  remindOn: text("remind_on").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at").notNull()
});

export const importBatches = sqliteTable("import_batches", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  status: text("status").notNull().default("uploaded"),
  workbookSummaryJson: text("workbook_summary_json").notNull().default("{}"),
  dryRunReportJson: text("dry_run_report_json"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const importRawRows = sqliteTable("import_raw_rows", {
  id: text("id").primaryKey(),
  batchId: text("batch_id").notNull().references(() => importBatches.id, { onDelete: "cascade" }),
  sheetName: text("sheet_name").notNull(),
  rowNumber: integer("row_number").notNull(),
  rowHash: text("row_hash").notNull(),
  payloadJson: text("payload_json").notNull(),
  validationStatus: text("validation_status").notNull().default("pending"),
  createdAt: integer("created_at").notNull()
});

export const importMappings = sqliteTable("import_mappings", {
  id: text("id").primaryKey(),
  batchId: text("batch_id").notNull().references(() => importBatches.id, { onDelete: "cascade" }),
  sheetName: text("sheet_name").notNull(),
  targetEntity: text("target_entity").notNull(),
  columnMapJson: text("column_map_json").notNull(),
  optionsJson: text("options_json").notNull().default("{}"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  uniqueSheet: uniqueIndex("import_mappings_batch_sheet_unique").on(table.batchId, table.sheetName)
}));

export const importIssues = sqliteTable("import_issues", {
  id: text("id").primaryKey(),
  batchId: text("batch_id").notNull().references(() => importBatches.id, { onDelete: "cascade" }),
  rawRowId: text("raw_row_id").references(() => importRawRows.id, { onDelete: "cascade" }),
  sheetName: text("sheet_name").notNull(),
  severity: text("severity").notNull(),
  issueCode: text("issue_code").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at").notNull()
});

export const monthlyClosings = sqliteTable("monthly_closings", {
  id: text("id").primaryKey(),
  month: text("month").notNull(),
  openingBalanceCents: integer("opening_balance_cents").notNull(),
  incomesCents: integer("incomes_cents").notNull(),
  expensesCents: integer("expenses_cents").notNull(),
  transfersNetCents: integer("transfers_net_cents").notNull(),
  projectedBillPaymentsCents: integer("projected_bill_payments_cents").notNull(),
  closingBalanceCents: integer("closing_balance_cents").notNull(),
  projectedFreeCashCents: integer("projected_free_cash_cents").notNull(),
  notes: text("notes").default(""),
  snapshotJson: text("snapshot_json").notNull().default("{}"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  monthUnique: uniqueIndex("monthly_closings_month_unique").on(table.month)
}));

export const netWorthSummaries = sqliteTable("net_worth_summaries", {
  id: text("id").primaryKey(),
  month: text("month").notNull(),
  reservesCents: integer("reserves_cents").notNull().default(0),
  investmentsCents: integer("investments_cents").notNull().default(0),
  debtsCents: integer("debts_cents").notNull().default(0),
  notes: text("notes").default(""),
  source: text("source").notNull().default("manual"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  monthUnique: uniqueIndex("net_worth_summaries_month_unique").on(table.month)
}));



/** Reservas e investimentos manuais importados da planilha. */
export const reserves = sqliteTable("reserves", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  investedCents: integer("invested_cents").notNull().default(0),
  previousValueCents: integer("previous_value_cents").notNull().default(0),
  currentValueCents: integer("current_value_cents").notNull().default(0),
  totalProfitCents: integer("total_profit_cents").notNull().default(0),
  yieldTotalPercent: real("yield_total_percent"),
  monthlyProfitCents: integer("monthly_profit_cents").notNull().default(0),
  yieldMonthlyPercent: real("yield_monthly_percent"),
  accountId: text("account_id").references(() => accounts.id, { onDelete: "set null" }),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  nameUnique: uniqueIndex("reserves_name_unique").on(table.name)
}));

/** Posições em ações importadas da planilha. */
export const stockPositions = sqliteTable("stock_positions", {
  id: text("id").primaryKey(),
  ticker: text("ticker").notNull(),
  fullName: text("full_name").notNull(),
  quantity: integer("quantity").notNull().default(0),
  investedCents: integer("invested_cents").notNull().default(0),
  previousCents: integer("previous_cents").notNull().default(0),
  currentCents: integer("current_cents").notNull().default(0),
  resultTotalCents: integer("result_total_cents").notNull().default(0),
  rentabilityTotalPercent: real("rentability_total_percent"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  tickerUnique: uniqueIndex("stock_positions_ticker_unique").on(table.ticker)
}));

/** Posições em criptomoedas importadas da planilha. */
export const cryptoPositions = sqliteTable("crypto_positions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  quantity: real("quantity").notNull().default(0),
  investedCents: integer("invested_cents").notNull().default(0),
  previousCents: integer("previous_cents").notNull().default(0),
  currentCents: integer("current_cents").notNull().default(0),
  totalProfitCents: integer("total_profit_cents").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  nameUnique: uniqueIndex("crypto_positions_name_unique").on(table.name)
}));

/** Histórico de compras e vendas de ativos financeiros. */
export const assetTrades = sqliteTable("asset_trades", {
  id: text("id").primaryKey(),
  action: text("action").notNull(),
  assetName: text("asset_name").notNull(),
  quantity: real("quantity").notNull(),
  tradeDate: text("trade_date").notNull(),
  totalInitialCents: integer("total_initial_cents").notNull().default(0),
  pricePerUnitInitialCents: integer("price_per_unit_initial_cents").notNull().default(0),
  totalCurrentCents: integer("total_current_cents").notNull().default(0),
  pricePerUnitCurrentCents: integer("price_per_unit_current_cents").notNull().default(0),
  yieldPercent: real("yield_percent"),
  descriptionText: text("description_text").default(""),
  isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at").notNull()
}, (table: any) => ({
  tradeDateIdx: index("asset_trades_trade_date_idx").on(table.tradeDate)
}));

/** Série histórica diária do patrimônio total importada da planilha. */
export const netWorthSnapshots = sqliteTable("net_worth_snapshots", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  accountBalanceCents: integer("account_balance_cents").notNull().default(0),
  investment1Cents: integer("investment_1_cents").notNull().default(0),
  investment2Cents: integer("investment_2_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
  variationType: text("variation_type").default(""),
  createdAt: integer("created_at").notNull()
}, (table: any) => ({
  dateUnique: uniqueIndex("net_worth_snapshots_date_unique").on(table.date)
}));

export const assetValueSnapshots = sqliteTable("asset_value_snapshots", {
  id: text("id").primaryKey(),
  assetType: text("asset_type").notNull(),
  assetId: text("asset_id"),
  assetLabel: text("asset_label").notNull(),
  snapshotDate: text("snapshot_date").notNull(),
  quantity: real("quantity"),
  valueCents: integer("value_cents").notNull().default(0),
  notes: text("notes").default(""),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  assetDayUnique: uniqueIndex("asset_value_snapshots_type_asset_date_unique").on(table.assetType, table.assetId, table.snapshotDate),
  dayIdx: index("asset_value_snapshots_snapshot_date_idx").on(table.snapshotDate)
}));

export const entityArchives = sqliteTable("entity_archives", {
  id: text("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  reason: text("reason").default(""),
  metadataJson: text("metadata_json").notNull().default("{}"),
  archivedAt: integer("archived_at").notNull(),
  restoredAt: integer("restored_at"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table: any) => ({
  entityUnique: uniqueIndex("entity_archives_entity_unique").on(table.entityType, table.entityId),
  entityTypeIdx: index("entity_archives_type_idx").on(table.entityType)
}));

export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  baseCurrency: text("base_currency").notNull().default("BRL"),
  locale: text("locale").notNull().default("pt-BR"),
  projectionMonths: integer("projection_months").notNull().default(6),
  themePreference: text("theme_preference").notNull().default("system"),
  userDisplayName: text("user_display_name").notNull().default("Você"),
  isOnboarded: integer("is_onboarded", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

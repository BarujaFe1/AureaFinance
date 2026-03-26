import { z } from "zod";

export const accountCreateSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["checking", "savings", "cash", "investment", "reserve", "credit_card_settlement"]),
  institution: z.string().optional().default(""),
  openingBalance: z.string().optional().default("0"),
  color: z.string().optional().default("#5b7cfa"),
  includeInNetWorth: z.boolean().optional().default(true),
  notes: z.string().optional().default("")
});
export type AccountCreateInput = z.infer<typeof accountCreateSchema>;

export const transactionCreateSchema = z.object({
  accountId: z.string().min(1),
  description: z.string().min(2),
  amount: z.string().min(1),
  direction: z.enum(["income", "expense", "transfer_in", "transfer_out", "bill_payment", "adjustment"]),
  status: z.enum(["posted", "scheduled", "void"]),
  occurredOn: z.string().min(10),
  dueOn: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  subcategoryId: z.string().optional().nullable(),
  notes: z.string().optional().default("")
});
export type TransactionCreateInput = z.infer<typeof transactionCreateSchema>;

export const creditCardCreateSchema = z.object({
  name: z.string().min(2),
  brand: z.string().optional().default(""),
  network: z.string().optional().default(""),
  limitAmount: z.string().min(1),
  closeDay: z.coerce.number().min(1).max(31),
  dueDay: z.coerce.number().min(1).max(31),
  settlementAccountId: z.string().min(1)
});
export type CreditCardCreateInput = z.infer<typeof creditCardCreateSchema>;

export const cardPurchaseCreateSchema = z.object({
  creditCardId: z.string().min(1),
  description: z.string().min(2),
  purchaseDate: z.string().min(10),
  amount: z.string().min(1),
  installmentCount: z.coerce.number().min(1).max(48),
  categoryId: z.string().optional().nullable(),
  notes: z.string().optional().default("")
});
export type CardPurchaseCreateInput = z.infer<typeof cardPurchaseCreateSchema>;

export const recurringRuleCreateSchema = z.object({
  title: z.string().min(2),
  accountId: z.string().min(1),
  direction: z.enum(["income", "expense", "transfer_in", "transfer_out", "bill_payment", "adjustment"]),
  amount: z.string().min(1),
  startsOn: z.string().min(10),
  nextRunOn: z.string().min(10),
  frequency: z.enum(["weekly", "monthly", "yearly"]),
  categoryId: z.string().optional().nullable(),
  notes: z.string().optional().default("")
});
export type RecurringRuleCreateInput = z.infer<typeof recurringRuleCreateSchema>;

export const settingsUpdateSchema = z.object({
  baseCurrency: z.string().min(3).default("BRL"),
  locale: z.string().min(2).default("pt-BR"),
  projectionMonths: z.coerce.number().int().min(1).max(36).default(6),
  themePreference: z.enum(["light", "dark", "system"]).default("system"),
  userDisplayName: z.string().optional().default("VocÃª")
});
export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;

export const onboardingPayloadSchema = z.object({
  source: z.enum(["manual", "money"]).default("manual"),
  userDisplayName: z.string().min(1).default("VocÃª"),
  baseCurrency: z.string().min(3).default("BRL"),
  locale: z.string().min(2).default("pt-BR"),
  projectionMonths: z.coerce.number().int().min(1).max(36).default(6),
  themePreference: z.enum(["light", "dark", "system"]).default("system")
});
export type OnboardingPayload = z.infer<typeof onboardingPayloadSchema>;

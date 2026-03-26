"use server";

import { revalidatePath } from "next/cache";
import { accountCreateSchema, type AccountCreateInput } from "@/lib/validation";
import { createAccount } from "@/services/accounts.service";

export async function createAccountAction(input: AccountCreateInput) {
  createAccount(accountCreateSchema.parse(input));
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
}

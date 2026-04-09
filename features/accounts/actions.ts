"use server";

import { revalidatePath } from "next/cache";
import { accountBalanceSnapshotSchema, accountCreateSchema, type AccountCreateInput } from "@/lib/validation";
import { archiveAccount, createAccount, deleteAccountSnapshot, restoreAccount, updateAccount, upsertAccountBalanceSnapshot } from "@/services/accounts.service";

function revalidateAccountRoutes() {
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  revalidatePath("/future");
  revalidatePath("/net-worth");
  revalidatePath("/daily");
  revalidatePath("/settings");
}

export async function createAccountAction(input: AccountCreateInput) {
  createAccount(accountCreateSchema.parse(input));
  revalidateAccountRoutes();
}

export async function saveAccountBalanceSnapshotAction(formData: FormData) {
  upsertAccountBalanceSnapshot(accountBalanceSnapshotSchema.parse({
    accountId: formData.get("accountId"),
    snapshotDate: formData.get("snapshotDate"),
    balance: formData.get("balance"),
    source: formData.get("source") || undefined
  }));
  revalidateAccountRoutes();
}

export async function updateAccountAction(formData: FormData) {
  updateAccount({
    accountId: String(formData.get("accountId") ?? ""),
    name: String(formData.get("name") ?? ""),
    institution: String(formData.get("institution") ?? ""),
    type: String(formData.get("type") ?? "checking"),
    openingBalance: String(formData.get("openingBalance") ?? "0"),
    color: String(formData.get("color") ?? "#5b7cfa"),
    notes: String(formData.get("notes") ?? ""),
    includeInNetWorth: formData.get("includeInNetWorth") === "on"
  });
  revalidateAccountRoutes();
}

export async function archiveAccountAction(formData: FormData) {
  archiveAccount(String(formData.get("accountId") ?? ""), String(formData.get("reason") ?? ""));
  revalidateAccountRoutes();
}

export async function restoreAccountAction(formData: FormData) {
  restoreAccount(String(formData.get("accountId") ?? ""));
  revalidateAccountRoutes();
}

export async function deleteAccountSnapshotAction(formData: FormData) {
  deleteAccountSnapshot(String(formData.get("snapshotId") ?? ""));
  revalidateAccountRoutes();
}

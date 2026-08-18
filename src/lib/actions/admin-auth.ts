"use server";

import { getStoreSettings } from "@/lib/settings";
import { createAdminSession, destroyAdminSession, hashPassword } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/lib/constants";

export async function loginAdmin(_prev: { error?: string } | null, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const settings = await getStoreSettings();

  if (email !== ADMIN_EMAIL.toLowerCase() || hashPassword(password) !== settings.adminPasswordHash) {
    return { error: "Incorrect email or password." };
  }

  await createAdminSession();
  return { error: undefined, success: true };
}

export async function logoutAdmin() {
  await destroyAdminSession();
}

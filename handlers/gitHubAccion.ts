"use server";

import { signIn } from "@/auth";

export async function handleGitHubSignIn() {
  await signIn("github", { redirectTo: "/perfil" });
}
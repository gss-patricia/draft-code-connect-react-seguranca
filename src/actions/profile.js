"use server";

import { createClient } from "../utils/supabase/server";
import { database } from "../lib/database";
import { sanitizeBio } from "../utils/sanitizer";
import { revalidatePath } from "next/cache";

/**
 * ✅ PROTEGIDO CONTRA XSS
 * 
 * Esta action sanitiza HTML antes de salvar no banco.
 * 
 * Camada 1 de Defesa: Sanitização na origem (ao salvar)
 * - Remove tags perigosas (<script>, event handlers)
 * - Mantém apenas tags permitidas (p, strong, em, etc)
 * - Protege o banco de dados contra conteúdo malicioso
 */
export async function updateUserBio(formData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Não autenticado" };
    }

    // Buscar usuário do banco
    const username = user.email.split("@")[0];
    const dbUser = await database.getUserByUsername(username);

    // ✅ CAMADA 1: Sanitizar ANTES de salvar no banco
    const rawBio = formData.get("bio");
    const cleanBio = sanitizeBio(rawBio);

    // Atualizar bio com conteúdo sanitizado
    // Nota: Se cleanBio for "", o banco pode salvar como null (comportamento esperado)
    await database.updateUserBio(dbUser.id, cleanBio);

    revalidatePath("/profile");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar bio:", error);
    return { success: false, error: "Erro ao atualizar bio" };
  }
}


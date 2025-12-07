"use server";

import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";
import db from "../../supabase/db";
import { logEventError } from "../eventLogger";
import database from "../lib/database";

export async function deletePost(postId) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return { success: false, error: "Não autenticado" };
    }

    // 🔍 Extrair username do email para buscar na tabela User
    const username = authUser.email.split("@")[0];
    const dbUser = await database.getUserByUsername(username);

    if (!dbUser) {
      logEventError({
        step: "AUTHORIZATION",
        operation: "USER_NOT_FOUND",
        userId: authUser.id,
        error: "User not found",
        metadata: { username },
      });
      return { success: false, error: "Usuário não encontrado" };
    }

    // 🔍 Buscar o post para verificar ownership
    const post = await database.getPostById(postId);

    if (!post) {
      logEventError({
        step: "AUTHORIZATION",
        operation: "POST_NOT_FOUND",
        userId: authUser.id,
        error: "Post not found",
        metadata: { postId },
      });
      return { success: false, error: "Post não encontrado" };
    }

    // 🔒 HIERARQUIA DE PERMISSÕES:
    // 1. Admin (RBAC) → pode deletar qualquer post
    // 2. Owner (ABAC) → pode deletar próprio post
    // 3. Outros → negado

    const isAdmin = dbUser.role === "admin";
    const isOwner = post.authorId === dbUser.id;

    if (!isAdmin && !isOwner) {
      // 🔒 LOG DE SEGURANÇA: Tentativa de acesso negada
      logEventError({
        step: "AUTHORIZATION",
        operation: "DELETE_POST_DENIED",
        userId: authUser.id,
        error: "Insufficient permissions",
        metadata: {
          postId,
          postAuthorId: post.authorId,
          username: dbUser.username,
          userId: dbUser.id,
          userRole: dbUser.role,
          isAdmin: false,
          isOwner: false,
          userEmail: authUser.email,
        },
      });
      return {
        success: false,
        error: "Você não tem permissão para deletar este post",
      };
    }

    const { error } = await db.from("Post").delete().eq("id", postId);

    if (error) {
      logEventError({
        step: "DATABASE",
        operation: "DELETE_POST_FAILED",
        userId: authUser.id,
        error: error.message,
        metadata: { postId },
      });
      return { success: false, error: "Erro ao deletar post" };
    }

    // 🔄 Revalidar múltiplos paths para limpar cache
    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/posts/${postId}`);

    return { success: true };
  } catch (error) {
    logEventError({
      step: "UNEXPECTED_ERROR",
      operation: "DELETE_POST_EXCEPTION",
      userId: authUser?.id || "unknown",
      error: error.message,
      metadata: { postId },
    });
    return { success: false, error: "Erro interno do servidor" };
  }
}

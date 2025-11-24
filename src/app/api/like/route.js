import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";
import { database } from "../../../lib/database";
import { validateCSRF } from "../../../lib/csrf";

/**
 * 🛡️ API ROUTE PROTEGIDA CONTRA CSRF
 *
 * Esta rota VALIDA:
 * ✅ Token CSRF (cookie vs header)
 * ✅ Autenticação do usuário
 *
 * IMPORTANTE: Para demonstração educacional, você pode comentar
 * a validação CSRF para mostrar a vulnerabilidade.
 */

// ⚠️ CORS Headers - APENAS PARA DEMONSTRAÇÃO EDUCACIONAL!
// Permite que o ataque CSRF funcione de localhost:5500
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5500",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-csrf-token",
  "Access-Control-Allow-Credentials": "true", // ⚠️ Permite envio de cookies!
};

// Handle preflight (OPTIONS) requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request) {
  try {
    console.log("🔒 [CSRF PROTECTED] Like request recebido");

    // 🛡️ PASSO 1: Validar CSRF ANTES de tudo
    const csrfValid = await validateCSRF(request);

    if (!csrfValid) {
      console.log("❌ CSRF inválido - Ataque BLOQUEADO!");
      return NextResponse.json(
        { error: "CSRF token inválido ou ausente" },
        { status: 403, headers: corsHeaders }
      );
    }

    console.log("✅ CSRF válido - continuando...");

    // 🔐 PASSO 2: Verificar autenticação
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.log("❌ Usuário não autenticado");
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Pegar postId do body
    const body = await request.json();
    const postId = body.postId || body.post?.id;

    if (!postId) {
      return NextResponse.json(
        { error: "postId obrigatório" },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log(
      `👍 Incrementando like no post ${postId} pelo usuário ${user.email}`
    );

    // ✅ PROTEGIDO: CSRF foi validado antes
    await database.incrementPostLikes(postId);

    console.log(`✅ Like incrementado com sucesso e PROTEGIDO! 🛡️`);

    return NextResponse.json(
      {
        success: true,
        message: "Like registrado com proteção CSRF",
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erro ao processar like:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500, headers: corsHeaders }
    );
  }
}



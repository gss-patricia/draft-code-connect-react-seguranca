import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { database } from '../../../lib/database';

/**
 * ⚠️ API ROUTE PROPOSITALMENTE VULNERÁVEL A CSRF
 * 
 * Esta rota NÃO valida:
 * - Token CSRF
 * - Header Origin
 * - Header Referer
 * 
 * Isso permite que qualquer site malicioso dispare likes.
 * 
 * IMPORTANTE: Esta vulnerabilidade é INTENCIONAL para fins educacionais.
 * Em produção, SEMPRE valide origem e use tokens CSRF!
 */
export async function POST(request) {
  try {
    // ⚠️ VULNERÁVEL: Aceita request de qualquer origem
    console.log('⚠️ [CSRF VULNERABLE] Like request recebido');
    
    // ✅ Verificar autenticação (mas não origem!)
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.log('❌ Usuário não autenticado');
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Pegar postId do body
    const body = await request.json();
    const postId = body.postId || body.post?.id;

    if (!postId) {
      return NextResponse.json({ error: 'postId obrigatório' }, { status: 400 });
    }

    console.log(`👍 Incrementando like no post ${postId} pelo usuário ${user.email}`);

    // ⚠️ VULNERÁVEL: Não valida origem do request
    // Incrementar like
    await database.incrementPostLikes(postId);

    console.log(`✅ Like incrementado com sucesso no post ${postId}`);

    // ⚠️ CORS permissivo (permite qualquer origem)
    // Pegar origem do request
    const origin = request.headers.get('origin') || 'null';
    
    return NextResponse.json(
      { success: true, message: 'Like registrado' },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin,  // ⚠️ VULNERÁVEL! Aceita qualquer origem
          'Access-Control-Allow-Credentials': 'true',  // ⚠️ VULNERÁVEL!
        }
      }
    );
  } catch (error) {
    console.error('Erro ao processar like:', error);
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    );
  }
}

// ⚠️ VULNERÁVEL: CORS permissivo
export async function OPTIONS(request) {
  // Pegar origem do request
  const origin = request.headers.get('origin') || 'null';
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,  // ⚠️ Aceita qualquer origem
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    }
  });
}


"use client";

import { useState, useCallback } from "react";
import { useCSRFToken } from "./useCSRFToken";

/**
 * Hook para gerenciar likes com proteção CSRF
 *
 * @param {number} postId - ID do post
 * @param {number} initialLikes - Número inicial de likes
 * @returns {object} { likes, isLiking, handleLike, error }
 */
export function useLike(postId, initialLikes) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState(null);
  const { token, loading: tokenLoading } = useCSRFToken();

  const handleLike = useCallback(async () => {
    // Validações
    if (!token) {
      console.warn("⚠️ Token CSRF não disponível");
      setError("Token de segurança não disponível");
      return;
    }

    if (isLiking) {
      console.warn("⚠️ Like já está sendo processado");
      return;
    }

    setIsLiking(true);
    setError(null);

    try {
      console.log("🔒 Enviando like com CSRF token...");

      const response = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": token, // ✅ Proteção CSRF
        },
        credentials: "include",
        body: JSON.stringify({ postId }),
      });

      const data = await response.json();

      // Tratamento de diferentes status
      if (response.ok) {
        console.log("✅ Like registrado com sucesso!");
        setLikes((prev) => prev + 1);
      } else if (response.status === 403) {
        console.error("❌ CSRF inválido - Ataque bloqueado!");
        setError("Erro de segurança: Token CSRF inválido");
      } else if (response.status === 401) {
        console.error("❌ Usuário não autenticado");
        setError("Você precisa estar logado para dar like");
      } else {
        console.error("❌ Erro ao dar like:", data.error);
        setError(data.error || "Erro ao processar like");
      }
    } catch (err) {
      console.error("❌ Erro na requisição:", err);
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLiking(false);
    }
  }, [token, postId, isLiking]);

  return {
    likes,
    isLiking,
    handleLike,
    error,
    isDisabled: tokenLoading || isLiking || !token,
  };
}

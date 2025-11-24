"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Spinner } from "../../components/Spinner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { createClient } from "../../utils/supabase/client";

/**
 * ✅ PÁGINA SEGURA COM SUPABASE AUTH NATIVO
 *
 * Migrado no Módulo 2 - Vídeo 2.6 para usar updateUser()
 *
 * SEGURANÇA:
 * ✅ Token no hash (#) da URL → não aparece em logs/histórico
 * ✅ Supabase pega o token automaticamente do hash
 * ✅ Validação automática de expiração (1h)
 * ✅ Uso único (one-time use) integrado
 * ✅ Nenhuma validação manual necessária
 *
 * COMO FUNCIONA:
 * 1. Supabase detecta token no hash (#access_token=...)
 * 2. Valida assinatura JWT automaticamente
 * 3. Valida expiração automaticamente
 * 4. updateUser() só funciona se token válido
 * 5. Token é invalidado após uso
 */
export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setErrorMessage("Todos os campos são obrigatórios");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // ✅ Supabase pega o token do hash (#) automaticamente
      // Não precisamos pegar da URL manualmente!
      // Não precisamos validar expiração!
      // Não precisamos verificar one-time use!
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        // Erros comuns:
        // - Token expirado (após 1h)
        // - Token já usado (one-time use)
        // - Token inválido/adulterado
        setErrorMessage("Token inválido, expirado ou já usado");
      } else {
        setSuccessMessage("✅ Senha alterada com sucesso!");

        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
      setErrorMessage("Erro ao processar solicitação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.resetContainer}>
      <div className={styles.resetCard}>
        <div className={styles.resetContent}>
          <h1 className={styles.heading}>Redefinir Senha</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <Input
                label="Nova Senha"
                type="password"
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <Input
                label="Confirmar Senha"
                type="password"
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!password || !confirmPassword || isLoading}
            >
              {isLoading ? <Spinner /> : "Redefinir Senha"}
            </Button>
          </form>

          {errorMessage && <ErrorMessage message={errorMessage} />}

          {successMessage && (
            <div className={styles.successMessage}>
              <p>{successMessage}</p>
              <p>
                <small>Redirecionando para login...</small>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

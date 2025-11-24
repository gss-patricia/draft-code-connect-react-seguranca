"use client";

import { useState } from "react";
import styles from "./forgotpassword.module.css";
import { Input } from "../Input";
import { Button } from "../Button";
import { Link } from "../Link";
import { Spinner } from "../Spinner";
import { ErrorMessage } from "../ErrorMessage";
import { createClient } from "../../utils/supabase/client";

/**
 * ✅ COMPONENTE SEGURO COM SUPABASE AUTH NATIVO
 *
 * Migrado no Módulo 2 - Vídeo 2.5 para usar resetPasswordForEmail()
 *
 * SEGURANÇA:
 * ✅ Token JWT seguro
 * ✅ Expiração automática (1h)
 * ✅ Uso único integrado (one-time use)
 * ✅ Token no hash da URL (#) → não aparece em logs/histórico
 * ✅ Validação automática dentro do Supabase
 * ✅ Nenhum código manual de geração/validação de token
 */
export const ForgotPassword = () => {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Email é obrigatório");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // ✅ USAR SUPABASE AUTH NATIVO
      // O Supabase envia o email com token seguro no hash (#)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage(
          "✅ Email enviado! Verifique sua caixa de entrada e spam."
        );
      }
    } catch (error) {
      console.error("Erro ao solicitar reset:", error);
      setErrorMessage("Erro ao enviar email de recuperação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.forgotContainer}>
      <div className={styles.forgotCard}>
        <div className={styles.forgotContent}>
          <h1 className={styles.heading}>Esqueci minha senha</h1>

          <p className={styles.subtitle}>
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!email ? "Campo obrigatório" : null}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!email || isLoading}
            >
              {isLoading ? <Spinner /> : "Enviar Email"}
            </Button>
          </form>

          {errorMessage && <ErrorMessage message={errorMessage} />}
          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}

          <div className={styles.backToLogin}>
            <Link href="/login" variant="light">
              ← Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

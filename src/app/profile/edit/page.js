"use client";

import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useProtectedRoute } from "../../../hooks/useProtectedRoute";
import { updateUserBio } from "../../../actions/profile";
import styles from "./page.module.css";
import { Spinner } from "../../../components/Spinner";

export default function EditProfilePage() {
  const { user, loading: authLoading } = useProtectedRoute();
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("bio", bio);

    const result = await updateUserBio(formData);

    if (result.success) {
      setMessage("✅ Bio atualizada com sucesso!");
    } else {
      setMessage(`❌ ${result.error}`);
    }

    setLoading(false);
  };

  if (authLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar Perfil</h1>

      <div className={styles.warning}>
        <strong>⚠️ AVISO:</strong> Esta página está vulnerável a XSS para fins
        educacionais. Durante o curso, vamos adicionar sanitização!
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Escreva sua bio... (aceita HTML para demonstração de XSS)"
            rows={8}
            className={styles.textarea}
          />
          <small className={styles.hint}>
            💡 Teste XSS: Tente inserir{" "}
            <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code>
          </small>
        </div>

        {message && <div className={styles.message}>{message}</div>}

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Salvando..." : "Salvar Bio"}
        </button>
      </form>
    </div>
  );
}


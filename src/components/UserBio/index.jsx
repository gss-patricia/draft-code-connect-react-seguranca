"use client";

import { sanitizeBio } from "../../utils/sanitizer";
import styles from "./userbio.module.css";

/**
 * ✅ COMPONENTE PROTEGIDO CONTRA XSS (Camada 2 de Defesa)
 *
 * Este componente sanitiza HTML ao renderizar, protegendo contra:
 * - Dados que vieram de APIs externas (não sanitizadas)
 * - Dados legados do banco (anteriores à implementação de sanitização)
 * - Qualquer fonte não confiável
 *
 * Proteções implementadas:
 * - isomorphic-dompurify: funciona no servidor e cliente (sem hydration mismatch)
 * - Remove scripts e event handlers maliciosos
 * - Lista de tags permitidas (p, strong, em, br, a, ul, ol, li)
 * - Validação de atributos (apenas href, target, rel para links)
 *
 * Nota: A bio já é sanitizada ao salvar (Camada 1), mas sanitizamos novamente
 * aqui como defesa em profundidade e para ensinar como proteger dados externos.
 */
export function UserBio({ bio }) {
  if (!bio) {
    return null;
  }

  // ✅ CAMADA 2: Sanitizar ao renderizar (protege contra dados externos)
  const cleanBio = sanitizeBio(bio);

  return (
    <div className={styles.bioContainer}>
      <h3 className={styles.bioTitle}>Bio</h3>
      {/* ✅ SEGURO: HTML sanitizado pelo isomorphic-dompurify */}
      <div
        className={styles.bioContent}
        dangerouslySetInnerHTML={{ __html: cleanBio }}
      />
    </div>
  );
}

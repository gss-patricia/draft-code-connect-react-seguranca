import { Prompt } from "next/font/google";
import { LayoutProvider } from "../components/LayoutProvider";
import { headers } from "next/headers";
import "./globals.css";

export const metadata = {
  title: "Code Connect",
  description: "Uma rede social para devs!",
};

const prompt = Prompt({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/**
 * 🔒 CSP com Nonce
 *
 * O nonce é gerado no middleware e passado via header 'x-nonce'.
 * Aqui lemos esse header e podemos usar em scripts inline (se necessário).
 *
 * Nota: Neste projeto, não temos scripts inline no layout, então o nonce
 * está preparado mas não é usado. Se adicionar scripts inline no futuro,
 * basta usar: <script nonce={nonce}>...</script>
 */
export default async function RootLayout({ children }) {
  // Ler headers do request (async no Next.js 15+)
  const headersList = await headers();

  // Pegar o nonce que o middleware gerou
  const nonce = headersList.get("x-nonce") || "";

  return (
    <html lang="pt-br" className={prompt.className}>
      <body>
        <LayoutProvider>{children}</LayoutProvider>

        {/* 
          Se precisar de um script inline no futuro, use assim:
          <script nonce={nonce} dangerouslySetInnerHTML={{ __html: `
            console.log('Script com nonce!');
          `}} />
        */}
      </body>
    </html>
  );
}

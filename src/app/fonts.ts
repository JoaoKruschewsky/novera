import { Hanken_Grotesk, Newsreader } from "next/font/google";

// Fontes auto-hospedadas pelo next/font (sem requisição ao Google em tempo de execução),
// subconjunto latin, display swap (research R-04).
export const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
});

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
});

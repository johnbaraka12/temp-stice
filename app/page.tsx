import type { Metadata } from "next";
import PublicSite from "./components/PublicSite";

export const metadata: Metadata = {
  title: "COSTECH@40 Summit | From Legacy to Future",
  description: "Join Tanzania's national science, technology and innovation summit, 17–18 November 2026 at Mlimani City Conference Centre, Dar es Salaam.",
};

export default function Home() {
  return <PublicSite />;
}

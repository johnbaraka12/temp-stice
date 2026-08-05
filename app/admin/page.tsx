import type { Metadata } from "next";
import AdminPortal from "./portal";

export const metadata: Metadata = {
  title: "Summit Administration",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPortal />;
}

import { redirect } from "next/navigation";

export default function Home() {
  // Sementara langsung ke /login. Nanti diatur oleh middleware jika sudah login.
  redirect("/login");
}

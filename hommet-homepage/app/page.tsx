import { redirect } from "next/navigation";

// The site's pages live under /home2 (olive and cream). The bare domain opens /home2.
export default function Page() {
  redirect("/home2");
}

import { redirect } from "next/navigation";

// The site has two palettes, each at its own route: /home1 and /home2. The bare domain opens /home1.
export default function Page() {
  redirect("/home1");
}

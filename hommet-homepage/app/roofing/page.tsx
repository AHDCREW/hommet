import { redirect } from "next/navigation";

// Old address from before the two palettes: forwards to /home2.
export default function Page() {
  redirect("/home2/roofing");
}

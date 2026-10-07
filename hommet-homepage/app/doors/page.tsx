import { redirect } from "next/navigation";

// Old address from before the two palettes: forwards to the /home1 version.
export default function Page() {
  redirect("/home1/doors");
}

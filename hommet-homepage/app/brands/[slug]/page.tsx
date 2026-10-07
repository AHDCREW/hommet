import { redirect } from "next/navigation";

type Params = Promise<{ slug: string }>;

// Old address from before the two palettes: forwards to the /home1 version.
export default async function Page({ params }: { params: Params }) {
  redirect(`/home1/brands/${(await params).slug}`);
}

import { redirect } from "next/navigation";

type Params = Promise<{ slug: string }>;

// Old address from before the two palettes: forwards to /home2.
export default async function Page({ params }: { params: Params }) {
  redirect(`/home2/brands/${(await params).slug}`);
}

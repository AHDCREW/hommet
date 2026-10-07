import { BrandPage, brandMetadata, brandStaticParams } from "@/components/brand-page";

type Params = Promise<{ slug: string }>;

export const generateStaticParams = brandStaticParams;

export async function generateMetadata({ params }: { params: Params }) {
  return brandMetadata((await params).slug);
}

export default async function Page({ params }: { params: Params }) {
  return <BrandPage slug={(await params).slug} theme="home2"/>;
}

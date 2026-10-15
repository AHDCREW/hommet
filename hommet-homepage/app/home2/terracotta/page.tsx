import { CategoryPage, categoryMetadata } from "@/components/category-page";

export const metadata = categoryMetadata("terracotta");

export default function Page() {
  return <CategoryPage id="terracotta" theme="home2"/>;
}

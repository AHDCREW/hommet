import { CategoryPage, categoryMetadata } from "@/components/category-page";

export const metadata = categoryMetadata("pumps");

export default function Page() {
  return <CategoryPage id="pumps" theme="home2"/>;
}

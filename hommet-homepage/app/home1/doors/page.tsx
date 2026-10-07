import { CategoryPage, categoryMetadata } from "@/components/category-page";

export const metadata = categoryMetadata("doors");

export default function Page() {
  return <CategoryPage id="doors" theme="home1"/>;
}

import { HeroSection } from "@/components/home/HeroSection";
import { ValueSection } from "@/components/home/ValueSection";
import { CatalogSection } from "@/components/home/CatalogSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BlogSection } from "@/components/home/BlogSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ValueSection />
      <CatalogSection />
      <ServicesSection />
      <BlogSection />
    </>
  );
}

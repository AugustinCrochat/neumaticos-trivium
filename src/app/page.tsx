import { HeroSection } from "@/components/home/HeroSection";
import { ValueSection } from "@/components/home/ValueSection";
import { ArrepentimientoBanner } from "@/components/home/ArrepentimientoBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ArrepentimientoBanner />
      <ValueSection />
    </>
  );
}

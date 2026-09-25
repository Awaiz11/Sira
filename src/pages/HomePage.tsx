import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Experience } from "@/components/Experience";
import { SignatureDrinks } from "@/components/SignatureDrinks";
import { SoundAtmosphere } from "@/components/SoundAtmosphere";

export function HomePage({ onReserve, ready }: { onReserve: () => void; ready: boolean }) {
  const navigate = useNavigate();

  return (
    <main>
      <Hero ready={ready} onReserve={onReserve} navigate={navigate} />
      <Experience />
      <SignatureDrinks />
      <SoundAtmosphere />
    </main>
  );
}

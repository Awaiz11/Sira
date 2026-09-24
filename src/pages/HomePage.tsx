import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Experience } from "@/components/Experience";

export function HomePage({ onReserve, ready }: { onReserve: () => void; ready: boolean }) {
  const navigate = useNavigate();

  return (
    <main>
      <Hero ready={ready} onReserve={onReserve} navigate={navigate} />
      <Experience />
    </main>
  );
}

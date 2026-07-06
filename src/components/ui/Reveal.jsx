import { useReveal } from "@/lib/useReveal";

export default function Reveal({ children, delay = 0, style = {} }) {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 1s ease ${delay}s, transform 1s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

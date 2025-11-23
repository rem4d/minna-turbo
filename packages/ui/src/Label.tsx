import { twMerge } from "tailwind-merge";

export default function Label({ className }: { className?: string }) {
  return (
    <div className={twMerge("text-2xl border border-dashed", className)}>
      Label2
    </div>
  );
}

import { cn } from "@/lib/utils";

type MagicBallProps = {
  extraClasses?: string;
  icon?: React.ReactNode;
  title?: string;
  delay?: number;
};

function MagicBall({ extraClasses, icon, title, delay }: MagicBallProps) {
  return (
    <div
      className={cn("absolute", extraClasses)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      <div
        title={title ?? ""}
        className={cn(
          "flex h-15 w-15 items-center justify-center rounded-full bg-accent p-3 transition-transform ease-in-out hover:scale-110 md:h-20 md:w-20 md:p-5",
          "shadow-[0_0_20px_5px_rgba(37,99,235,0.8)]"
        )}
      >
        {icon}
      </div>
    </div>
  );
}

export default MagicBall;

import { cn } from "@/lib/utils";

/**
 * A subtle divider that also adds vertical (y-axis) spacing between elements.
 * Renders a thin, low-opacity line that fades out at both ends.
 *
 * @param size - Amount of margin on the top and bottom, in rem. Defaults to 1.
 * @param className - Optional extra classes (e.g. to constrain width).
 *
 * @example
 * <Spacer size={4} /> // faint line with 4rem of vertical margin
 */
export default function Spacer({
  size = 1,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      style={{ marginBlock: `${size}rem` }}
      className={cn(
        "mx-auto h-0.5 w-full bg-gradient-to-r from-transparent from-15% via-foreground/25 via-50% to-transparent to-85% blur-[1px]",
        className
      )}
    />
  );
}

import Link from "next/link";

export function Logo({
  size = "md",
  href = "/",
  light = false,
}: {
  size?: "sm" | "md" | "lg";
  href?: string | null;
  light?: boolean;
}) {
  const text =
    size === "lg"
      ? "text-2xl sm:text-3xl"
      : size === "sm"
        ? "text-base sm:text-lg"
        : "text-lg sm:text-xl";
  const mark =
    size === "lg" ? "h-9 w-9 text-sm sm:h-10 sm:w-10" : size === "sm" ? "h-7 w-7 text-[10px]" : "h-8 w-8 text-xs";

  const content = (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`${mark} flex shrink-0 items-center justify-center rounded-lg bg-accent font-bold tracking-tight text-white`}
      >
        bd
      </span>
      <span
        className={`${text} font-semibold tracking-tight ${
          light ? "text-white" : "text-fg"
        }`}
      >
        boso<span className="text-accent">dance</span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 hover:opacity-90" aria-label="Bosodance">
        {content}
      </Link>
    );
  }
  return content;
}

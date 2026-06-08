interface StarIconProps {
  filled?: boolean;
  variant?: "brand" | "muted" | "white";
  className?: string;
  size?: number;
}

export default function StarIcon({
  filled = false,
  variant = "brand",
  className = "",
  size = 18,
}: StarIconProps) {
  const gradientId = "quickpage-star-gradient";

  const stroke =
    variant === "white" ? "#ffffff" : variant === "muted" || !filled ? "#d1d5db" : "none";
  const fill = filled
    ? variant === "white"
      ? "#ffffff"
      : `url(#${gradientId})`
    : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {filled && variant === "brand" && (
        <defs>
          <linearGradient id={gradientId} x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff4d6d" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2.5l2.87 5.82 6.42.93-4.64 4.53 1.1 6.4L12 17.77l-5.75 3.01 1.1-6.4-4.64-4.53 6.42-.93L12 2.5z"
        fill={fill}
        stroke={filled && variant !== "white" ? "none" : stroke}
        strokeWidth={filled ? 0 : 1.75}
        strokeLinejoin="round"
      />
    </svg>
  );
}

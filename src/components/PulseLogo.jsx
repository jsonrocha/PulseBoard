import { useId } from "react";

export default function PulseLogo({ className, size = 32 }) {
  const id = useId().replace(/:/g, "");
  const bgId = `bgGradient-${id}`;
  const glowId = `whiteGlow-${id}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="512" height="512" fill={`url(#${bgId})`} rx="96" />
      <path
        d="M 70 256 L 160 256 L 195 180 L 230 332 L 265 200 L 300 312 L 335 256 L 442 256"
        stroke="#FFFFFF"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
      />
      <circle cx="70" cy="256" r="6" fill="#FFFFFF" filter={`url(#${glowId})`} />
      <circle cx="442" cy="256" r="6" fill="#FFFFFF" filter={`url(#${glowId})`} />
    </svg>
  );
}
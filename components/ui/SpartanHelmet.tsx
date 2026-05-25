interface SpartanHelmetProps {
  size?: number
  color?: string
  className?: string
}

export function SpartanHelmet({ size = 48, color = '#C8A96E', className }: SpartanHelmetProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Plume base */}
      <rect x="44" y="2" width="12" height="6" rx="2" fill={color} opacity="0.7" />
      {/* Plume crest */}
      <path
        d="M38 8 Q50 2 62 8 L58 18 Q50 14 42 18 Z"
        fill={color}
        opacity="0.85"
      />
      {/* Crest ridge */}
      <path
        d="M42 16 Q50 12 58 16 L56 22 Q50 18 44 22 Z"
        fill={color}
      />

      {/* Dome of helmet */}
      <path
        d="M20 54 Q20 22 50 18 Q80 22 80 54 L80 62 Q80 68 74 72 L26 72 Q20 68 20 62 Z"
        fill={color}
        opacity="0.9"
      />

      {/* Cheek guards */}
      <path
        d="M20 60 L20 80 Q20 88 28 90 L36 90 L36 72 L26 72 Q20 68 20 60 Z"
        fill={color}
        opacity="0.8"
      />
      <path
        d="M80 60 L80 80 Q80 88 72 90 L64 90 L64 72 L74 72 Q80 68 80 60 Z"
        fill={color}
        opacity="0.8"
      />

      {/* Nasal guard */}
      <rect x="46" y="50" width="8" height="32" rx="3" fill={color} />

      {/* Eye openings — dark cutouts */}
      <path
        d="M24 52 Q24 44 34 44 L44 44 L44 62 Q34 62 24 58 Z"
        fill="var(--bg, #0A0A0A)"
        opacity="0.85"
      />
      <path
        d="M76 52 Q76 44 66 44 L56 44 L56 62 Q66 62 76 58 Z"
        fill="var(--bg, #0A0A0A)"
        opacity="0.85"
      />

      {/* Neck guard / cheek bottom trim */}
      <path
        d="M28 90 Q50 96 72 90 L68 100 Q50 106 32 100 Z"
        fill={color}
        opacity="0.7"
      />

      {/* Highlight sheen */}
      <path
        d="M32 26 Q38 20 50 20 Q56 20 60 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.25"
        fill="none"
      />
    </svg>
  )
}

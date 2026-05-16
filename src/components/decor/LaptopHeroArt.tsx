/** Open laptop — 3/4 view, readable silhouette */

export function LaptopHeroArt({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Shadow under base */}
      <ellipse cx="400" cy="488" rx="280" ry="18" fill="currentColor" fillOpacity="0.06" />

      {/* Keyboard deck (base) */}
      <path
        d="M120 320 L680 320 L720 460 L80 460 Z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.2"
        strokeLinejoin="round"
      />
      {/* Base front edge thickness */}
      <path
        d="M80 460 L720 460 L700 478 L100 478 Z"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.16"
      />

      {/* Keyboard keys */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 11 }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={168 + col * 38}
            y={336 + row * 20}
            width={30}
            height={12}
            rx={2}
            fill="currentColor"
            fillOpacity={0.07}
            stroke="currentColor"
            strokeWidth="0.75"
            strokeOpacity={0.11}
          />
        )),
      )}

      {/* Trackpad */}
      <rect
        x="318"
        y="418"
        width="164"
        height="34"
        rx="5"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.18"
      />

      {/* Hinge */}
      <path
        d="M130 318 H670"
        stroke="currentColor"
        strokeWidth="4"
        strokeOpacity="0.22"
        strokeLinecap="round"
      />

      {/* Screen outer frame (lid) */}
      <path
        d="M140 48 H660 V318 H140 Z"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.22"
        strokeLinejoin="round"
      />
      {/* Screen bezel */}
      <rect
        x="158"
        y="66"
        width="484"
        height="236"
        rx="6"
        fill="white"
        fillOpacity="0.55"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.2"
      />
      {/* Display content */}
      <rect x="178" y="86" width="200" height="12" rx="3" fill="currentColor" fillOpacity="0.12" />
      <rect x="178" y="110" width="320" height="8" rx="2" fill="currentColor" fillOpacity="0.08" />
      <rect x="178" y="128" width="280" height="8" rx="2" fill="currentColor" fillOpacity="0.08" />
      <rect x="178" y="156" width="140" height="100" rx="6" fill="#2563EB" fillOpacity="0.12" />
      <rect x="334" y="156" width="288" height="100" rx="6" fill="currentColor" fillOpacity="0.06" />
      <rect x="178" y="268" width="444" height="8" rx="2" fill="currentColor" fillOpacity="0.07" />

      {/* Webcam */}
      <circle cx="400" cy="58" r="3" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

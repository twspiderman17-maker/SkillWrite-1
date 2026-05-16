/** Inline SVG decorations — no external assets */

export function NotebookWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="28" y="16" width="144" height="200" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <line x1="52" y1="16" x2="52" y2="216" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      {[48, 72, 96, 120, 144, 168].map((y) => (
        <line key={y} x1="64" y1={y} x2="160" y2={y} stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      ))}
      <path
        d="M72 56h72M72 80h56M72 104h64"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <circle cx="40" cy="40" r="6" fill="currentColor" opacity="0.2" />
      <circle cx="40" cy="64" r="6" fill="currentColor" opacity="0.15" />
      <circle cx="40" cy="88" r="6" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

export function DocumentWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="40"
        y="20"
        width="200"
        height="280"
        rx="12"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.2"
        transform="rotate(6 140 160)"
      />
      <text
        x="72"
        y="100"
        fill="currentColor"
        fontSize="14"
        fontWeight="600"
        opacity="0.15"
        transform="rotate(6 140 160)"
      >
        Safe AI Workflow
      </text>
      <text
        x="72"
        y="128"
        fill="currentColor"
        fontSize="11"
        opacity="0.12"
        transform="rotate(6 140 160)"
      >
        Context · Task · Limits
      </text>
      <line
        x1="72"
        y1="150"
        x2="200"
        y2="150"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.1"
        transform="rotate(6 140 160)"
      />
      <line
        x1="72"
        y1="170"
        x2="180"
        y2="170"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.1"
        transform="rotate(6 140 160)"
      />
      <line
        x1="72"
        y1="190"
        x2="190"
        y2="190"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.1"
        transform="rotate(6 140 160)"
      />
    </svg>
  );
}

export function WorkflowDiagram({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="20" y="70" width="72" height="48" rx="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <text x="36" y="100" fill="currentColor" fontSize="11" fontWeight="600" opacity="0.3">
        Prompt
      </text>
      <path d="M92 94h36" stroke="currentColor" strokeWidth="2" opacity="0.2" markerEnd="url(#arrow)" />
      <rect x="128" y="70" width="72" height="48" rx="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <text x="138" y="100" fill="currentColor" fontSize="11" fontWeight="600" opacity="0.3">
        AI draft
      </text>
      <path d="M200 94h36" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <rect x="236" y="70" width="72" height="48" rx="10" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <text x="248" y="100" fill="currentColor" fontSize="11" fontWeight="600" opacity="0.35">
        Review
      </text>
      <circle cx="160" cy="40" r="24" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <circle cx="160" cy="160" r="32" stroke="currentColor" strokeWidth="1.5" opacity="0.1" strokeDasharray="4 6" />
    </svg>
  );
}

export function IndustryIcon({ industry }: { industry: string }) {
  const common = "h-10 w-10 text-blue-600";
  switch (industry) {
    case "insurance-fnol":
      return (
        <svg className={common} viewBox="0 0 40 40" fill="none" aria-hidden>
          <rect x="8" y="6" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M14 16h12M14 22h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 6v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "construction-estimating":
      return (
        <svg className={common} viewBox="0 0 40 40" fill="none" aria-hidden>
          <path d="M8 32h24M12 32V18l8-8 8 8v14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M16 24h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "clinical-operations":
      return (
        <svg className={common} viewBox="0 0 40 40" fill="none" aria-hidden>
          <rect x="10" y="8" width="20" height="26" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M20 16v8M16 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "accounting-practices":
      return (
        <svg className={common} viewBox="0 0 40 40" fill="none" aria-hidden>
          <rect x="8" y="10" width="24" height="22" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M12 18h16M12 24h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="28" cy="26" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 40 40" fill="none" aria-hidden>
          <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}

'use client';

export function GWCrest({
  size = 76,
  spin = false,
  label = 'GERMAN  WERKS  ·  EST.  TWENTY-FOURTEEN  ·  VANCOUVER  ·  STUTTGART  ·  ',
}: {
  size?: number;
  spin?: boolean;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={spin ? 'animate-[gwSpin_22s_linear_infinite] origin-center' : ''}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <path
          id="gw-crest-ring"
          d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
        />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.65" />
      <text
        fontFamily="var(--font-mono)"
        fontSize="10"
        letterSpacing="3"
        fill="currentColor"
        opacity="0.85"
      >
        <textPath href="#gw-crest-ring" startOffset="0">
          {label.repeat(2)}
        </textPath>
      </text>
      <g transform="translate(100 108)" textAnchor="middle" fill="currentColor">
        <text
          fontFamily="var(--font-serif)"
          fontStyle="italic"
          fontWeight="700"
          fontSize="68"
          letterSpacing="-4"
          y="0"
        >
          GW
        </text>
        <line x1="-30" y1="14" x2="30" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
        <text fontFamily="var(--font-mono)" fontSize="6.5" letterSpacing="2.4" y="26" opacity="0.85">
          MANUFAKTUR · 014
        </text>
      </g>
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1="100"
          y1="6"
          x2="100"
          y2="12"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity={i % 3 === 0 ? 0.9 : 0.35}
          transform={`rotate(${i * 30} 100 100)`}
        />
      ))}
    </svg>
  );
}

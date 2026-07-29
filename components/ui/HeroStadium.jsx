export default function HeroStadium() {
  return (
    <svg
      viewBox="0 0 1600 700"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#0a1226" />
          <stop offset="50%" stopColor="#0d1530" />
          <stop offset="100%" stopColor="#060a12" />
        </linearGradient>
        <radialGradient id="towerGlowL" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#d4f8ff" stopOpacity="1" />
          <stop offset="25%" stopColor="#5eeaff" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#00d4ff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pitch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#2c6b3c" />
          <stop offset="100%" stopColor="#143a20" />
        </linearGradient>
        <radialGradient id="pitchStripFade" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#d8b97c" stopOpacity="0.6" />
          <stop offset="70%"  stopColor="#caa86a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#caa86a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="stand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#161f30" />
          <stop offset="100%" stopColor="#0d121c" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="1600" height="700" fill="url(#sky)" />

      {/* Twinkling stars */}
      {[...Array(36)].map((_, i) => {
        const x = (i * 137) % 1600
        const y = (i * 41) % 230
        const r = 0.6 + (i % 3) * 0.4
        return (
          <circle key={i} cx={x} cy={y} r={r} fill="#cfe7ff" opacity="0.5">
            <animate attributeName="opacity" values="0.1;0.8;0.1" dur={`${3 + (i % 5)}s`} begin={`${i * 0.2}s`} repeatCount="indefinite" />
          </circle>
        )
      })}

      {/* Distant stand silhouette */}
      <rect x="0" y="280" width="1600" height="110" fill="url(#stand)" />
      <rect x="0" y="272" width="1600" height="10" fill="#1d2942" />
      {[...Array(48)].map((_, i) => (
        <rect key={i} x={20 + i * 33} y="305" width="14" height="9" rx="1.5"
          fill={i % 7 === 0 ? '#ffb800' : '#28395c'} opacity={i % 7 === 0 ? 0.85 : 0.5}>
          {i % 7 === 0 && (
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.4s" begin={`${i * 0.1}s`} repeatCount="indefinite" />
          )}
        </rect>
      ))}

      {/* Floodlight towers */}
      {[
        { x: 150, glow: 130 },
        { x: 1450, glow: 130 },
      ].map((t, i) => (
        <g key={i}>
          <rect x={t.x - 6} y="70" width="12" height="220" fill="#1d2942" />
          <ellipse cx={t.x} cy="62" rx={t.glow} ry={t.glow * 0.8} fill="url(#towerGlowL)">
            <animate attributeName="rx" values={`${t.glow * 0.88};${t.glow};${t.glow * 0.88}`} dur="3.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;1;0.7" dur="3.4s" repeatCount="indefinite" />
          </ellipse>
          <rect x={t.x - 46} y="42" width="92" height="34" rx="4" fill="#0d121c" stroke="#28395c" />
          {[...Array(6)].map((_, j) => (
            <circle key={j} cx={t.x - 38 + j * 15} cy="59" r="5" fill="#eaffff" />
          ))}
        </g>
      ))}

      {/* Pitch ground */}
      <ellipse cx="800" cy="660" rx="1500" ry="230" fill="url(#pitch)" />
      <ellipse cx="800" cy="660" rx="1500" ry="230" fill="none" stroke="#5eeaff" strokeOpacity="0.15" strokeWidth="2" />

      {/* Pitch strip (soft-edged, blends into grass) */}
      <ellipse cx="800" cy="600" rx="100" ry="180" fill="url(#pitchStripFade)" />

      {/* Subtle floodlight beam shimmer over pitch */}
      <ellipse cx="800" cy="600" rx="650" ry="110" fill="#00d4ff" opacity="0.06">
        <animate attributeName="opacity" values="0.04;0.11;0.04" dur="5s" repeatCount="indefinite" />
      </ellipse>
    </svg>
  )
}

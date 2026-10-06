export function Miniroom() {
  return (
    <svg viewBox="0 0 180 120" className="miniroom" role="img" aria-label="迷你房间">
      <rect width="180" height="120" fill="#fff7c2" />
      <rect y="86" width="180" height="34" fill="#f3c6d8" />
      <rect x="12" y="16" width="52" height="40" fill="#1b2748" stroke="#f4d27a" strokeWidth="3" />
      <path d="M38 16 v40 M12 36 h52" stroke="#f4d27a" strokeWidth="2" />
      <rect x="104" y="58" width="58" height="28" fill="#c9845a" />
      <rect x="112" y="48" width="22" height="16" fill="#fff" stroke="#e7b8c8" />
      <circle cx="86" cy="96" r="10" fill="#ff9ec8" />
      <text x="90" y="18" fontSize="9" fill="#9b1d5a">
        mini room
      </text>
    </svg>
  );
}

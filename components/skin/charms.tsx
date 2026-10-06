const STARS = [
  { left: "6%", top: "7%", size: 16, delay: "0s" },
  { left: "18%", top: "22%", size: 10, delay: "0.4s" },
  { left: "31%", top: "8%", size: 12, delay: "0.8s" },
  { left: "47%", top: "16%", size: 8, delay: "0.2s" },
  { left: "63%", top: "6%", size: 14, delay: "1s" },
  { left: "78%", top: "18%", size: 11, delay: "0.6s" },
  { left: "90%", top: "9%", size: 16, delay: "1.2s" },
  { left: "12%", top: "48%", size: 9, delay: "0.3s" },
  { left: "84%", top: "42%", size: 13, delay: "0.9s" },
  { left: "4%", top: "72%", size: 12, delay: "0.5s" },
  { left: "22%", top: "80%", size: 8, delay: "1.1s" },
  { left: "70%", top: "74%", size: 15, delay: "0.1s" },
  { left: "93%", top: "66%", size: 10, delay: "0.7s" },
  { left: "40%", top: "88%", size: 11, delay: "1.3s" },
  { left: "55%", top: "36%", size: 7, delay: "0.15s" },
];

const GLINTS = [
  { left: "14%", top: "14%" },
  { left: "27%", top: "34%" },
  { left: "52%", top: "12%" },
  { left: "73%", top: "28%" },
  { left: "88%", top: "52%" },
  { left: "8%", top: "58%" },
  { left: "36%", top: "64%" },
  { left: "61%", top: "84%" },
];

export function SkyField() {
  return (
    <div className="sky-field" aria-hidden="true">
      {STARS.map((star) => (
        <span
          key={`${star.left}-${star.top}`}
          className="sky-star"
          style={{
            left: star.left,
            top: star.top,
            fontSize: star.size,
            animationDelay: star.delay,
          }}
        >
          ★
        </span>
      ))}
      {GLINTS.map((glint) => (
        <span key={`${glint.left}-${glint.top}`} className="sky-glint" style={glint} />
      ))}
    </div>
  );
}

export function YellowDancer() {
  return (
    <svg className="charm charm-dance" viewBox="0 0 64 72" aria-hidden="true">
      <circle cx="32" cy="16" r="10" fill="#ffe14a" stroke="#f2b400" />
      <circle cx="28" cy="15" r="1.4" fill="#333" />
      <circle cx="36" cy="15" r="1.4" fill="#333" />
      <path d="M29 19 q3 3 6 0" fill="none" stroke="#ff6ea8" strokeWidth="1.2" />
      <rect x="24" y="27" width="16" height="18" rx="6" fill="#fff36a" stroke="#f2b400" />
      <path d="M24 34 l-10 8 M40 34 l10 6" stroke="#f2b400" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 45 l-6 16 M34 45 l8 14" stroke="#f2b400" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function BannerCharms() {
  return (
    <div className="banner-charms" aria-hidden="true">
      <svg className="charm charm-bob" viewBox="0 0 86 86">
        <ellipse cx="43" cy="50" rx="28" ry="24" fill="#fff6d8" stroke="#f3d7a2" strokeWidth="2" />
        <ellipse cx="28" cy="28" rx="8" ry="10" fill="#fff6d8" stroke="#f3d7a2" />
        <ellipse cx="58" cy="28" rx="8" ry="10" fill="#fff6d8" stroke="#f3d7a2" />
        <circle cx="33" cy="50" r="3" fill="#5a3a32" />
        <circle cx="53" cy="50" r="3" fill="#5a3a32" />
        <ellipse cx="27" cy="56" rx="5" ry="3" fill="#ffb6d4" />
        <ellipse cx="59" cy="56" rx="5" ry="3" fill="#ffb6d4" />
        <path d="M38 60 q5 5 10 0" fill="none" stroke="#ff6ea8" strokeWidth="1.6" />
      </svg>
      <svg className="charm charm-bob charm-delay" viewBox="0 0 78 78">
        <path
          d="M39 68 C18 50 8 36 18 24 C26 14 36 20 39 28 C42 20 52 14 60 24 C70 36 60 50 39 68Z"
          fill="#ff7eb3"
          stroke="#ff4f93"
        />
        <circle cx="32" cy="36" r="2.2" fill="#fff" />
        <circle cx="46" cy="36" r="2.2" fill="#fff" />
        <path d="M36 42 q3 3 6 0" fill="none" stroke="#fff" strokeWidth="1.4" />
      </svg>
      <svg className="charm charm-bob charm-delay-2" viewBox="0 0 84 84">
        <circle cx="42" cy="46" r="24" fill="#fff36a" stroke="#f0c200" strokeWidth="2" />
        <circle cx="33" cy="44" r="3" fill="#333" />
        <circle cx="51" cy="44" r="3" fill="#333" />
        <rect x="28" y="40" width="12" height="8" rx="2" fill="none" stroke="#333" />
        <rect x="44" y="40" width="12" height="8" rx="2" fill="none" stroke="#333" />
        <path d="M37 56 q5 4 10 0" fill="none" stroke="#ff6ea8" strokeWidth="1.6" />
        <path d="M42 18 l3 8 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#fff" />
      </svg>
    </div>
  );
}

export function SideCharms() {
  return (
    <div className="side-charms" aria-hidden="true">
      <svg className="charm charm-bob" viewBox="0 0 70 70">
        <circle cx="35" cy="38" r="20" fill="#ffe14a" stroke="#f2b400" />
        <circle cx="28" cy="36" r="2" fill="#333" />
        <circle cx="42" cy="36" r="2" fill="#333" />
        <path d="M30 46 q5 4 10 0" fill="none" stroke="#ff6ea8" strokeWidth="1.5" />
        <path d="M18 22 l6 8 M52 22 l-6 8" stroke="#f2b400" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <svg className="charm charm-bob charm-delay" viewBox="0 0 70 74">
        <ellipse cx="35" cy="42" rx="20" ry="18" fill="#d9d9e6" stroke="#b9b9cc" />
        <path d="M18 30 l-6-10 M52 30 l6-10" stroke="#b9b9cc" strokeWidth="3" />
        <circle cx="28" cy="40" r="2" fill="#333" />
        <circle cx="42" cy="40" r="2" fill="#333" />
        <rect x="24" y="36" width="10" height="7" fill="none" stroke="#333" />
        <rect x="36" y="36" width="10" height="7" fill="none" stroke="#333" />
        <path d="M31 50 q4 3 8 0" fill="none" stroke="#ff6ea8" strokeWidth="1.4" />
      </svg>
    </div>
  );
}

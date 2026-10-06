export function HitCounter({
  today,
  total,
}: {
  today: number;
  total: number;
}) {
  const pad = (n: number, width: number) =>
    Math.max(0, n).toString().padStart(width, "0").split("");

  return (
    <div className="space-y-2 text-center">
      <div className="text-[11px] font-bold">TODAY</div>
      <div className="counter-board">
        {pad(today, 4).map((d, i) => (
          <span className="counter-digit" key={`t-${i}`}>
            {d}
          </span>
        ))}
      </div>
      <div className="text-[11px] font-bold">TOTAL</div>
      <div className="counter-board">
        {pad(total, 8).map((d, i) => (
          <span className="counter-digit" key={`a-${i}`}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

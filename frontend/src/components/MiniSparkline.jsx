// Small self-contained sparkline so cards don't need a heavy charting lib.
// Detail view uses recharts; cards use this lightweight inline SVG.

export function MiniSparkline({ data, className = "" }) {
  const w = 100;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1 || 1)) * w;
      const y = h - ((value - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`mini-sparkline ${className}`} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

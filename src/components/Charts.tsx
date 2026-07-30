"use client";

/** Lightweight chart primitives for admin analytics (no chart lib) */

type BarItem = { label: string; value: number; color?: string };

export function BarChart({
  data,
  height = 140,
  showValues = true,
  color = "var(--accent)",
}: {
  data: BarItem[];
  height?: number;
  showValues?: boolean;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      className="flex w-full items-end gap-1 sm:gap-2"
      style={{ height }}
      role="img"
      aria-label="Wykres słupkowy"
    >
      {data.map((d) => {
        const h = Math.max(6, (d.value / max) * 100);
        return (
          <div
            key={d.label}
            className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
          >
            {showValues && (
              <span className="max-w-full truncate text-[9px] font-medium tabular-nums text-fg-muted sm:text-[10px]">
                {d.value >= 1000
                  ? `${(d.value / 1000).toFixed(1)}k`
                  : d.value}
              </span>
            )}
            <div
              className="w-full max-w-[36px] rounded-t-md sm:max-w-[44px]"
              style={{
                height: `${h}%`,
                background: d.color ?? color,
                minHeight: 6,
              }}
            />
            <span className="max-w-full truncate text-[9px] font-medium text-fg-muted sm:text-[10px]">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function HorizontalBars({
  data,
  unit = "",
}: {
  data: BarItem[];
  unit?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between gap-2 text-sm">
            <span className="min-w-0 truncate font-medium text-fg">
              {d.label}
            </span>
            <span className="shrink-0 tabular-nums text-fg-muted">
              {d.value}
              {unit}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#f0f2f5]">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.color ?? "var(--accent)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Simple stacked share as horizontal segments */
export function ShareBar({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full">
        {data.map((d) => (
          <div
            key={d.label}
            style={{
              width: `${(d.value / total) * 100}%`,
              background: d.color,
            }}
            title={`${d.label}: ${d.value}%`}
          />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 sm:grid-cols-3">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-1.5 text-xs text-fg-secondary">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: d.color }}
            />
            <span className="truncate">{d.label}</span>
            <span className="ml-auto font-semibold tabular-nums text-fg">
              {d.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FunnelChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = data[0]?.value || 1;
  return (
    <div className="space-y-2">
      {data.map((d, i) => {
        const w = Math.max(48, (d.value / max) * 100);
        const prev = i > 0 ? data[i - 1].value : d.value;
        const drop = prev ? Math.round((1 - d.value / prev) * 100) : 0;
        return (
          <div key={d.label} className="flex flex-col items-stretch sm:items-center">
            <div
              className="mx-auto flex min-h-10 w-full max-w-full items-center justify-between gap-2 rounded-xl bg-accent/90 px-3 py-2 text-xs font-semibold text-white sm:h-10 sm:w-auto sm:text-sm"
              style={{ width: `${w}%`, minWidth: "min(100%, 12rem)" }}
            >
              <span className="min-w-0 truncate">{d.label}</span>
              <span className="shrink-0 tabular-nums">
                {d.value.toLocaleString("pl-PL")}
              </span>
            </div>
            {i > 0 && (
              <span className="py-0.5 text-center text-[10px] text-fg-muted">
                −{drop}% vs krok wyżej
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DeltaBadge({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span
      className={`badge ${
        up ? "bg-success-soft text-success" : "bg-accent-soft text-accent"
      }`}
    >
      {up ? "↑" : "↓"} {Math.abs(value)}%
    </span>
  );
}

export function MiniSparkline({
  values,
  color = "var(--accent)",
}: {
  values: number[];
  color?: string;
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const w = 100;
  const h = 28;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-7 w-full max-w-[120px]"
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

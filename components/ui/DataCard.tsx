interface Props {
  title: string;
  value: number | string;
  delta?: number;
}

export default function DataCard({ title, value, delta }: Props) {
  const trend =
    delta === undefined ? null : delta >= 0 ? (
      <span className="text-emerald-600">▲ {delta}%</span>
    ) : (
      <span className="text-red-600">▼ {Math.abs(delta)}%</span>
    );

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-3xl font-semibold">{value}</p>
      {trend && <p className="text-xs">{trend}</p>}
    </div>
  );
}

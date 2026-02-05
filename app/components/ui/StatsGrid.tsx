type Stat = {
  label: string;
  value: string;
};

type StatsGridProps = {
  stats: Stat[];
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="stats">
      {stats.map((stat) => (
        <div className="stat" key={stat.label}>
          <span>{stat.value}</span>
          <small>{stat.label}</small>
        </div>
      ))}
    </div>
  );
}

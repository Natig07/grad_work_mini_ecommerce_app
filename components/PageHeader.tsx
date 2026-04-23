interface PageHeaderProps {
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
}

export function PageHeader({ title, description, badge, badgeColor }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-3 text-gray-300">{icon}</div>}
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      )}
    </div>
  );
}

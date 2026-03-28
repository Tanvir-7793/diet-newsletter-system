import Link from "next/link";

interface NewsletterCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "sent" | "draft" | "scheduled";
  openRate?: number;
  clickRate?: number;
}

export function NewsletterCard({
  id,
  title,
  description,
  date,
  status,
  openRate,
  clickRate,
}: NewsletterCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>{date}</span>
        {openRate && clickRate && (
          <div className="flex space-x-4">
            <span>Open: {openRate}%</span>
            <span>Click: {clickRate}%</span>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Link
          href={`/editor/${id}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3"
        >
          Edit
        </Link>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
          Preview
        </button>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
          Analytics
        </button>
      </div>
    </div>
  );
}

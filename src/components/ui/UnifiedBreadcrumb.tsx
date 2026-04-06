"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { breadcrumbMappings } from "@/data/breadcrumbMappings";

interface BreadcrumbItem {
  title: string;
  url?: string | null;
}

interface UnifiedBreadcrumbProps {
  customItems?: BreadcrumbItem[];
}

export default function UnifiedBreadcrumb({
  customItems,
}: UnifiedBreadcrumbProps) {
  const pathname = usePathname();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    // Use custom items if provided
    if (customItems) {
      return customItems;
    }

    // Get breadcrumbs from mapping
    const mappedBreadcrumbs = breadcrumbMappings[pathname];
    if (mappedBreadcrumbs) {
      return mappedBreadcrumbs;
    }

    // Fallback to default
    return [{ url: "/dashboard", title: "Dashboard" }];
  };

  const items = getBreadcrumbs();

  return (
    <nav className="flex items-center text-sm text-gray-600 py-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.url ? (
            <Link
              href={item.url}
              className="hover:text-primary transition-colors duration-200">
              {item.title}
            </Link>
          ) : (
            <span className="text-primary font-medium">{item.title}</span>
          )}
          {index < items.length - 1 && <span className="text-gray-400">/</span>}
          &nbsp;
        </div>
      ))}
    </nav>
  );
}

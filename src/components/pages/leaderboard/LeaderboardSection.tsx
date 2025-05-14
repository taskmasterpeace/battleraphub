// components/LeaderboardSection.tsx
import { FilteredData } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface LeaderboardSectionProps<T> {
  data: T[];
  sortKey: keyof T;
  sortDirection?: "asc" | "desc";
  valueLabel: string;
  valueKey: keyof T;
  useIndex?: boolean;
}

export default function LeaderboardSection<T extends FilteredData>({
  data,
  sortKey,
  sortDirection = "desc",
  valueLabel,
  valueKey,
}: LeaderboardSectionProps<T>) {
  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return (
    <div className="space-y-2">
      {sortedData.map((entry, index) => (
        <div
          key={index}
          className="justify-between p-3 rounded-lg bg-background border border-border"
        >
          <div className="flex justify-between items-center gap-3 overflow-x-auto w-full max-w-[500px] sm:max-w-full">
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-semibold">
                {index + 1}
              </div>
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={entry?.avatar || "/placeholder.svg"}
                  alt={entry?.name || "User Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <Link href={`/profile/${entry.user_id}`} className="font-medium hover:underline">
                  {entry?.name || "N/A"}
                </Link>
                <p className="text-sm text-muted-foreground">
                  @{entry?.name?.toLowerCase().split(" ").join("")}
                </p>
              </div>
            </div>
            <div className="w-full text-end">
              <div className="font-semibold">{String(entry[valueKey] || "0")}</div>
              <div className="text-sm text-muted-foreground">{valueLabel}</div>
            </div>
          </div>
        </div>
      ))}{" "}
    </div>
  );
}

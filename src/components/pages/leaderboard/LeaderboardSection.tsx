// components/LeaderboardSection.tsx
import { LeaderboardEntry } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface LeaderboardSectionProps {
  data: LeaderboardEntry[];
  sortKey: keyof LeaderboardEntry;
  sortDirection?: "asc" | "desc";
  valueLabel: string;
  valueKey: keyof LeaderboardEntry;
  useIndex?: boolean;
}

export default function LeaderboardSection({
  data,
  sortKey,
  sortDirection = "desc",
  valueLabel,
  valueKey,
  useIndex = true,
}: LeaderboardSectionProps) {
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
          key={entry.userId}
          className="flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-gray-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-sm font-semibold">
              {useIndex ? index + 1 : entry.rank}
            </div>
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={entry.profileImage || "/placeholder.svg"}
                alt={entry.displayName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <Link href={`/profile/${entry.username}`} className="font-medium hover:underline">
                {entry.displayName}
              </Link>
              <p className="text-sm text-gray-400">@{entry.username}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{entry[valueKey]}</div>
            <div className="text-sm text-gray-400">{valueLabel}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

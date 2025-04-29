import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer } from "@/components/ui/chart";
import { ReactElement } from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  height?: string;
  loading?: boolean;
  className?: string;
  children: ReactElement;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  height = "400px",
  loading = false,
  className = "",
  children,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p>Loading data...</p>
          </div>
        ) : (
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              {children}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

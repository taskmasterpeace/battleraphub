import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

interface RatingCardProps {
  title: string;
  description: string;
  data: {
    name: string;
    "My Rating": number;
  }[];
  barColor: string;
}
export function RatingCard({ title, description, data, barColor }: RatingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" className="text-[10px] font-bold text-wrap" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="My Rating" fill={barColor} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  TooltipProps,
} from "recharts";

interface RatingCardProps {
  title: string;
  description: string;
  data: {
    name: string;
    [key: string]: string;
  }[];
  barColor: string;
  keys: string[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<string, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-muted text-foreground p-2 rounded-md">{`${label} : ${payload[0].value}`}</div>
    );
  }

  return null;
};

export function RatingCard({ title, description, data, barColor, keys }: RatingCardProps) {
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
              <XAxis
                dataKey="name"
                className="text-[10px] font-bold "
                angle={90}
                textAnchor="start"
                height={65}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip content={keys.length === 1 ? <CustomTooltip /> : undefined} />
              {keys?.map((key, index) => <Bar dataKey={key} fill={barColor} key={index} />)}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

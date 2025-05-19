"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "@/components/ui/chart";
import Link from "next/link";
import { BattlerAttribute, Attribute } from "@/types";
import { rolesWeightData } from "@/lib/static/static-data";
import { topBattlerByRatingAction } from "@/app/actions";
import { Loader, CircleUser } from "lucide-react";
import Image from "next/image";
import { CATEGORY_TYPES } from "@/config";

interface RoleBasedAnalyticsProps {
  attributeData: Attribute[];
}

const categories = Object.values(CATEGORY_TYPES);

export default function RoleBasedAnalytics({ attributeData }: RoleBasedAnalyticsProps) {
  const [selectedRole, setSelectedRole] = useState<number>(4);
  const [selectedCategory, setSelectedCategory] = useState<string>("writing");
  const [selectedAttribute, setSelectedAttribute] = useState<number | string>("All");
  const [topBattlers, setTopBattlers] = useState<BattlerAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopBattlers = async () => {
      setIsLoading(true);
      try {
        const data = await topBattlerByRatingAction(
          selectedRole,
          selectedCategory,
          selectedAttribute,
        );
        console.log("");
        setTopBattlers(data || []);
      } catch (error) {
        console.error("Error fetching top battlers:", error);
        setTopBattlers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopBattlers();
  }, [selectedRole, selectedCategory, selectedAttribute]);

  const getRoleColor = (role: number): string => {
    const roleWeight = rolesWeightData.find((rw) => rw.role_id === role);
    return roleWeight?.color || "gray";
  };

  const getRoleDisplayName = (role: number) => {
    const roleWeight = rolesWeightData.find((rw) => rw.role_id === role);
    return roleWeight?.key || role;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Role-Based Analytics</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select
            value={String(selectedRole)}
            onValueChange={(value) => {
              setSelectedRole(Number(value));
            }}
          >
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="sm:w-[180px]">
              {rolesWeightData.map((role) => (
                <SelectItem key={role.formKey} value={String(role?.role_id)}>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${role.backgroundColor} mr-2`}></div>
                    {role.key}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(selectedAttribute)}
            onValueChange={(value) => setSelectedAttribute(value)}
          >
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="Select attribute" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Attributes</SelectItem>
              {attributeData.map((attribute) => (
                <SelectItem key={attribute.id} value={String(attribute.id)}>
                  {attribute.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-md sm:text-2xl">
            Top Battlers by {getRoleDisplayName(selectedRole)} Ratings
            {selectedCategory && ` - ${selectedCategory}`}
            {selectedAttribute !== "All"
              ? ` (${attributeData.find((attr) => String(attr.id) === selectedAttribute)?.name})`
              : " (All)"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader className="mr-2 h-10 w-10 animate-spin" />
            </div>
          ) : topBattlers.length === 0 ? (
            <div className="h-96 flex items-center justify-center">
              <p>No data available for the selected criteria.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topBattlers}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" domain={[0, 10]} stroke="#9CA3AF" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={150}
                      stroke="#9CA3AF"
                      className="text-sm"
                    />
                    <Tooltip
                      content={({ payload, label }) => (
                        <div className="bg-muted text-foreground rounded-md p-3">
                          <p className="text-sm">{`${label} : ${typeof payload?.[0]?.value === "number" ? payload[0].value.toFixed(2) : payload?.[0]?.value}`}</p>
                        </div>
                      )}
                    />
                    <Bar
                      dataKey="average_score"
                      fill={`${getRoleColor(selectedRole)}`}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topBattlers.slice(0, 6).map((battler, index) => (
                  <Link
                    key={`${battler.battler_id}-${index}`}
                    href={`/battlers/${battler.battler_id}`}
                    className="block"
                  >
                    <Card className="hover:border-primary transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative rounded-full overflow-hidden w-12 h-12">
                            {battler?.avatar ? (
                              <Image
                                src={battler?.avatar || "/defaultAvatar.jpeg"}
                                alt={battler?.name || "Battler Image"}
                                width={48}
                                height={48}
                                className="w-12 h-12 object-cover"
                              />
                            ) : (
                              <CircleUser className="w-12 h-12" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{battler?.name}</h3>
                            <p className="text-sm text-muted-foreground">{battler?.location}</p>
                          </div>
                          <div
                            className={`px-3 py-2 rounded-full bg-${getRoleColor(selectedRole)}-900/30 text-${getRoleColor(selectedRole)}-400 font-bold`}
                          >
                            {(battler.average_score ?? 0).toFixed(2)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}{" "}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

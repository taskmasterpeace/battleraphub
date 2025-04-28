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
import Image from "next/image";
import Link from "next/link";
import { BattlerAttribute, RoleWeight, RoleKey } from "@/types";
import { attributes, categories } from "@/__mocks__/analytics";
import { getMockRoleWeights, getMockTopBattlersByRole } from "@/__mocks__/analytics";

interface RoleBasedAnalyticsProps {
  defaultRole?: RoleKey;
  defaultCategory?: string;
  defaultAttribute?: string;
}

export default function RoleBasedAnalytics({
  defaultRole = "fan",
  defaultCategory,
  defaultAttribute,
}: RoleBasedAnalyticsProps) {
  const [selectedRole, setSelectedRole] = useState<RoleKey>(defaultRole);
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory || "Writing");
  const [selectedAttribute, setSelectedAttribute] = useState<string>(defaultAttribute || "");
  const [topBattlers, setTopBattlers] = useState<BattlerAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleWeights, setRoleWeights] = useState<RoleWeight[]>([]);

  useEffect(() => {
    const fetchRoleWeights = async () => {
      try {
        const weights = getMockRoleWeights();
        setRoleWeights(weights);
      } catch (error) {
        console.error("Error fetching role weights:", error);
        setRoleWeights([]);
      }
    };

    fetchRoleWeights();
  }, []);

  useEffect(() => {
    const fetchTopBattlers = async () => {
      setIsLoading(true);
      try {
        // Use client-side mock data instead of server-side fetch
        const data = getMockTopBattlersByRole(
          selectedRole,
          selectedCategory,
          selectedAttribute,
          10,
        );
        setTopBattlers(data);
      } catch (error) {
        console.error("Error fetching top battlers:", error);
        setTopBattlers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopBattlers();
  }, [selectedRole, selectedCategory, selectedAttribute]);

  const getRoleColor = (role: RoleKey): string => {
    const roleWeight = roleWeights.find((rw) => rw.role === role);
    return roleWeight?.color || "gray";
  };

  const getRoleDisplayName = (role: RoleKey): string => {
    const roleWeight = roleWeights.find((rw) => rw.role === role);
    return roleWeight?.displayName || role;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Role-Based Analytics</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as RoleKey)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roleWeights.map((role) => (
                <SelectItem key={role.role} value={role.role}>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full bg-${role.color}-500 mr-2`}></div>
                    {role.displayName}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
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
            value={selectedAttribute}
            onValueChange={setSelectedAttribute}
            disabled={!selectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All attributes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All attributes</SelectItem>
              {selectedCategory &&
                attributes[selectedCategory as keyof typeof attributes].map((attribute) => (
                  <SelectItem key={attribute} value={attribute}>
                    {attribute}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Top Battlers by {getRoleDisplayName(selectedRole)} Ratings
            {selectedCategory && ` - ${selectedCategory}`}
            {selectedAttribute && ` (${selectedAttribute})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <p>Loading data...</p>
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
                      dataKey="battlerName"
                      type="category"
                      width={150}
                      stroke="#9CA3AF"
                      tick={{ fill: "#E5E7EB" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#E5E7EB",
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}`, "Rating"]}
                    />
                    <Bar dataKey="rating" fill={`#374151`} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topBattlers.slice(0, 6).map((battler, index) => (
                  <Link
                    key={`${battler.battlerId}-${index}`}
                    href={`/battlers/${battler.battlerId}`}
                    className="block"
                  >
                    <Card className="hover:border-purple-500 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Image
                              src={battler.battlerImage || "/placeholder.svg"}
                              alt={battler.battlerName || "Battler Image"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{battler.battlerName}</h3>
                            <p className="text-sm text-gray-400">{battler.battlerLocation}</p>
                          </div>
                          <div
                            className={`px-3 py-2 rounded-full bg-${getRoleColor(selectedRole)}-900/30 text-${getRoleColor(selectedRole)}-400 font-bold`}
                          >
                            {(battler.rating ?? 0).toFixed(1)}
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

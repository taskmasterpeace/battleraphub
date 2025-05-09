import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE, ROLES_NAME } from "@/config";
import { useLeaderboard } from "@/contexts/leaderboard.context";
import { Star, Users, Award, TrendingUp } from "lucide-react";

export default function UserStatsOverview() {
  const {
    communityStats: stats,
    ratingDistribution,
    activeRolesByRatings,
    communityLoading,
    activeRolesByRatingLoading,
    ratingDistributionLoading,
  } = useLeaderboard();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Stats</CardTitle>
      </CardHeader>
      <CardContent>
        {communityLoading ? (
          Array.from({ length: 1 }).map((_, i) => (
            <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-muted p-4 h-24 rounded-lg border border-border"></div>
              ))}
            </div>
          ))
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-2xl font-bold">{stats?.total_users?.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success">+{stats?.new_users_this_week}</span> this week
              </p>
            </div>

            <div className="bg-background p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Ratings</h3>
                <Star className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-2xl font-bold">{stats?.total_ratings?.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success">+{stats?.new_users_this_week}</span> this week
              </p>
            </div>

            <div className="bg-background p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Avg. Rating</h3>
                <Award className="w-5 h-5 text-success" />
              </div>
              <p className="text-2xl font-bold">{stats?.avg_rating?.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-1">across all battlers</p>
            </div>

            <div className="bg-background p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-2xl font-bold">
                {stats?.active_users_last_30_days?.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">in the last 30 days</p>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background p-4 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">Most Active User Roles</h3>
            <div className="space-y-3">
              {activeRolesByRatingLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-24 h-4 bg-muted rounded animate-pulse"></div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-muted animate-pulse"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                      <div className="w-12 h-4 bg-muted rounded animate-pulse"></div>
                    </div>
                  ))
                : activeRolesByRatings?.map((role) => (
                    <div key={role.role_id} className="flex items-center gap-2">
                      <div className="w-24 text-sm">{ROLES_NAME[role.role_id]}</div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            role.role_id === ROLE.MEDIA
                              ? "bg-primary"
                              : role.role_id === ROLE.BATTLE
                                ? "bg-success"
                                : role.role_id === ROLE.LEAGUE_OWNER_INVESTOR
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                          }`}
                          style={{ width: `${role.percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-right text-sm">{role.percentage}%</div>
                    </div>
                  ))}
            </div>
          </div>

          <div className="bg-background p-4 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Rating Distribution</h3>
            <div className="space-y-3">
              {ratingDistributionLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-muted animate-pulse"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                      <div className="w-12 h-4 bg-muted rounded animate-pulse"></div>
                    </div>
                  ))
                : ratingDistribution?.map((range) => (
                    <div key={range.bucket} className="flex items-center gap-2">
                      <div className="w-20 text-sm">{range.bucket}</div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500"
                          style={{ width: `${range.percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-right text-sm">{range.percentage}%</div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

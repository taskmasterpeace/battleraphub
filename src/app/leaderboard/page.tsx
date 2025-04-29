import LeaderBoard from "@/components/pages/leaderboard";
import { LeaderboardProvider } from "@/contexts/leaderboard.context";

const LeaderBoardPage = () => {
  return (
    <LeaderboardProvider>
      <LeaderBoard />
    </LeaderboardProvider>
  );
};

export default LeaderBoardPage;

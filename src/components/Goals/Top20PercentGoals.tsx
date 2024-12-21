import { useQuery } from "@tanstack/react-query";
import Goal from "../../models/Goal";
import { PathItem } from "../../models/PathItem";
import GoalService from "../../services/goals.service";
import TwentyPercentItems from "../TwentyPercentItems";

const Top20PercentGoals: React.FC<{ problemId: number }> = ({ problemId }) => {
  const { data: twentyPercentGoals } = useQuery<Goal[]>({
    queryKey: ["goals", problemId.toString(), "twentypercent"],
    queryFn: () => GoalService.getTwentyPercentGoals(problemId),
  });

  return (
    twentyPercentGoals && (
      <TwentyPercentItems
        items={twentyPercentGoals.map(
          (goal) => new PathItem(goal.text, `/goal/${goal.id}`)
        )}
      />
    )
  );
};

export default Top20PercentGoals;

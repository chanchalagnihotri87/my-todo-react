import { useQuery } from "@tanstack/react-query";
import Goal from "../../models/Goal";
import GoalService from "../../services/goals.service";
import GoalListItem from "./GoalListItem";

const GoalList: React.FC<{
  problemId: number;
  onEdit: (goal: Goal) => void;
}> = ({ problemId, onEdit }) => {
  const { data: goals } = useQuery({
    queryKey: ["goals", problemId.toString()],
    queryFn: () => GoalService.getGoals(problemId),
  });
  return (
    <ul className="list-group">
      {goals?.map((goal, index) => (
        <GoalListItem key={goal.id} goal={goal} index={index} onEdit={onEdit} />
      ))}
    </ul>
  );
};

export default GoalList;

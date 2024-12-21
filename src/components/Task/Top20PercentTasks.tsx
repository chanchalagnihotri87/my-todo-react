import { useQuery } from "@tanstack/react-query";
import { PathItem } from "../../models/PathItem";
import Task from "../../models/Task";
import TaskService from "../../services/task.service";
import TwentyPercentItems from "../TwentyPercentItems";

const Top20PercentTasks: React.FC<{ objectiveId: number }> = ({
  objectiveId,
}) => {
  const { data: twentyPercentTasks } = useQuery<Task[]>({
    queryKey: ["tasks", objectiveId.toString(), "twentypercent"],
    queryFn: () => TaskService.getTwentyPercentTasks(objectiveId),
  });

  return (
    twentyPercentTasks && (
      <TwentyPercentItems
        items={twentyPercentTasks.map(
          (task) => new PathItem(task.text, `/task/${task.id}`)
        )}
      />
    )
  );
};

export default Top20PercentTasks;

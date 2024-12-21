import { PathItem } from "../../models/PathItem";
import Task from "../../models/Task";
import { useAppSelector } from "../../store";
import TwentyPercentItems from "../TwentyPercentItems";

const Top20PercentTasks: React.FC<{ objectiveId: number }> = ({
  objectiveId,
}) => {
  const twentyPercentTasks = useAppSelector((state) =>
    state.task.tasks
      .filter((task) => task.objectiveId === objectiveId && task.twentyPercent)
      .sort((a: Task, b: Task) => a.index - b.index)
  );

  return (
    <TwentyPercentItems
      items={twentyPercentTasks.map(
        (task) => new PathItem(task.text, `/task/${task.id}`)
      )}
    />
  );
};

export default Top20PercentTasks;

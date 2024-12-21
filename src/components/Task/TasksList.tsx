import { useQuery } from "@tanstack/react-query";
import Task from "../../models/Task";
import TaskService from "../../services/task.service";
import TaskListItem from "./TaskListItem";

const TasksList: React.FC<{
  objectiveId: number;
  onEdit: (task: Task) => void;
}> = ({ objectiveId, onEdit }) => {
  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["tasks", objectiveId.toString()],
    queryFn: () => TaskService.getTasks(objectiveId),
  });

  return (
    tasks && (
      <ul className="list-group">
        {tasks.map((task, index) => (
          <TaskListItem
            key={task.id}
            task={task}
            index={index}
            onEdit={onEdit}
          />
        ))}
      </ul>
    )
  );
};

export default TasksList;

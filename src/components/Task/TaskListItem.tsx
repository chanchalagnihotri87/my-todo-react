import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { useDrag, useDrop } from "react-dnd";
import { Link } from "react-router-dom";
import Task from "../../models/Task";
import TaskService from "../../services/task.service";
import { useAppDispatch } from "../../store";
import { queryClient } from "../../utils/http";

const ItemTypes = {
  TASK: "task",
};

const TaskListItem: React.FC<{
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
}> = ({ task, index, onEdit }) => {
  const dispatch = useAppDispatch();

  //#region MarkAsTwentyPercent
  const markAsTwentyPercent = (id: number) => {
    markAs20PercentAction(id);
  };

  const { mutate: markAs20PercentAction } = useMutation<boolean, Error, number>(
    {
      mutationFn: (id) => TaskService.markAsTwentyPercent(id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tasks", task.objectiveId.toString()],
        });
      },
    }
  );
  //#endregion

  //#region MarkAsNormal
  const markAsNormal = (id: number) => {
    markAsNormalAction(id);
  };

  const { mutate: markAsNormalAction } = useMutation<boolean, Error, number>({
    mutationFn: (id) => TaskService.markAsNormal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", task.objectiveId.toString()],
      });
    },
  });

  //#endregion

  //#region ToggleCompleted

  const toggleCompleted = (task: Task) => {
    toggleCompletedAction(task);
  };

  const { mutate: toggleCompletedAction } = useMutation<boolean, Error, Task>({
    mutationFn: (task) => TaskService.toggleCompleted(task),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", task.objectiveId.toString()],
      });
    },
  });

  //#endregion

  //#region HandleDelete

  const handleDelete = (id: number) => {
    const confirmed = confirm("Are you sure to delete?");
    if (confirmed) {
      deleteTaskAction(id);
    }
  };

  const { mutate: deleteTaskAction } = useMutation<boolean, Error, number>({
    mutationFn: (id) => TaskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", task.objectiveId.toString()],
      });
    },
  });
  //#endregion

  const handleEdit = (task: Task) => {
    onEdit(task);
  };

  //#region MoveTask

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: {
      type: ItemTypes.TASK,
      index,
      id: task.id,
      objectiveId: task.objectiveId,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover: (item) => {
      // console.log(item);
      // console.log("Hover Index:" + index);
    },
    drop: (item: {
      type: string;
      index: number;
      id: number;
      objectiveId: number;
    }) => {
      // console.log(item);
      // console.log("Drop Index:" + index);

      moveTaskAction({
        id: item.id,
        index: index,
        objectiveId: item.objectiveId,
      });
    },
  });

  const { mutate: moveTaskAction } = useMutation<
    boolean,
    Error,
    { id: number; index: number; objectiveId: number }
  >({
    mutationFn: (data) =>
      TaskService.moveTask(data.id, data.index, data.objectiveId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", task.objectiveId.toString()],
      });
    },
  });
  //#endregion

  return (
    <li
      className="list-group-item"
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="row">
        <div className="col-1">
          <input
            className="form-check-input me-2"
            type="checkbox"
            value=""
            id="firstCheckbox"
            checked={task.completed}
            onChange={() => toggleCompleted(task)}
          />
        </div>
        <div className="col-8">
          <Link to={`/task/${task.id}`}>{task.text}</Link>
        </div>

        <div className="col-1">
          {task.twentyPercent && (
            <span className="badge text-bg-dark rounded-pill">Top 20%</span>
          )}
        </div>

        <div className="col-2 text-end">
          {task.twentyPercent ? (
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              type="button"
              onClick={() => markAsNormal(task.id)}>
              80%
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              type="button"
              onClick={() => markAsTwentyPercent(task.id)}>
              20%
            </button>
          )}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary me-1"
            onClick={() => handleEdit(task)}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => handleDelete(task.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskListItem;

import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { useDrag, useDrop } from "react-dnd";
import { Link } from "react-router-dom";
import Goal from "../../models/Goal";
import GoalService from "../../services/goals.service";
import { useAppDispatch } from "../../store";
import { queryClient } from "../../utils/http";

const ItemTypes = {
  PROBLEM: "problem",
};

const GoalListItem: React.FC<{
  goal: Goal;
  index: number;
  onEdit: (goal: Goal) => void;
}> = ({ goal, index, onEdit }) => {
  const dispatch = useAppDispatch();

  //#region MarkAsTwentyPercen
  const markAsTwentyPercent = (id: number) => {
    markAsTwentyPercentAction(id);
  };

  const { mutate: markAsTwentyPercentAction } = useMutation<
    boolean,
    Error,
    number
  >({
    mutationFn: (id) => GoalService.markAsTwentyPercent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals", goal.problemId.toString()],
      });
    },
  });
  //#endregion

  //#region MarkAsNormal
  const markAsNormal = (id: number) => {
    markAsNormalAction(id);
  };

  const { mutate: markAsNormalAction } = useMutation<boolean, Error, number>({
    mutationFn: (id) => GoalService.markAsNormal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals", goal.problemId.toString()],
      });
    },
  });
  //#endregion

  //#region ToggleCompleted
  const toggleCompleted = (goal: Goal) => {
    toggleCompletedAction(goal);
  };

  const { mutate: toggleCompletedAction } = useMutation<boolean, Error, Goal>({
    mutationFn: (goal) => GoalService.toggleCompleted(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals", goal.problemId.toString()],
      });
    },
  });
  //#endregion

  //#region HandleDelete
  const handleDelete = (id: number) => {
    const confirmed = confirm("Are you sure to delete?");
    if (confirmed) {
      handleDeleteAction(id);
    }
  };

  const { mutate: handleDeleteAction } = useMutation<boolean, Error, number>({
    mutationFn: (id) => GoalService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals", goal.problemId.toString()],
      });
    },
  });
  //#endregion

  const handleEdit = (goal: Goal) => {
    onEdit(goal);
  };

  //#region MoveGoal
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PROBLEM,
    item: {
      type: ItemTypes.PROBLEM,
      index,
      id: goal.id,
      problemId: goal.problemId,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.PROBLEM,
    hover: (item) => {
      // console.log(item);
      // console.log("Hover Index:" + index);
    },
    drop: (item: {
      type: string;
      index: number;
      id: number;
      problemId: number;
    }) => {
      // console.log(item);
      // console.log("Drop Index:" + index);

      moveGoalAction({
        id: item.id,
        index: index,
        problemId: item.problemId,
      });
    },
  });

  const { mutate: moveGoalAction } = useMutation<
    boolean,
    Error,
    { id: number; index: number; problemId: number }
  >({
    mutationFn: (data) =>
      GoalService.moveGoal(data.id, data.index, data.problemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals", goal.problemId.toString()],
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
            checked={goal.completed}
            onChange={() => toggleCompleted(goal)}
          />
        </div>
        <div className="col-8">
          <Link to={`/goal/${goal.id}`}>{goal.text}</Link>
        </div>

        <div className="col-1">
          {goal.twentyPercent && (
            <span className="badge text-bg-dark rounded-pill">Top 20%</span>
          )}
        </div>

        <div className="col-2 text-end">
          {goal.twentyPercent ? (
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              type="button"
              onClick={() => markAsNormal(goal.id)}>
              80%
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              type="button"
              onClick={() => markAsTwentyPercent(goal.id)}>
              20%
            </button>
          )}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary me-1"
            onClick={() => handleEdit(goal)}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => handleDelete(goal.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default GoalListItem;

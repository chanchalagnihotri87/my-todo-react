import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { useDrag, useDrop } from "react-dnd";
import { Link } from "react-router-dom";
import Objective from "../../models/Objective";
import ObjectiveService from "../../services/objective.service";
import { useAppDispatch } from "../../store";
import { queryClient } from "../../utils/http";

const ItemTypes = {
  OBJECTIVE: "objective",
};

const ObjectiveListItem: React.FC<{
  objective: Objective;
  index: number;
  onEdit: (objective: Objective) => void;
}> = ({ objective, index, onEdit }) => {
  const dispatch = useAppDispatch();

  //#region MarkAsTwentyPercent
  const markAsTwentyPercent = (id: number) => {
    markAs20PercentAction(id);
  };

  const { mutate: markAs20PercentAction } = useMutation<boolean, Error, number>(
    {
      mutationFn: (id) => ObjectiveService.markAsTwentyPercent(id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["objectives", objective.goalId.toString()],
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
    mutationFn: (id) => ObjectiveService.markAsNormal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["objectives", objective.goalId.toString()],
      });
    },
  });
  //#endregion

  //#region ToggleCompleted
  const toggleCompleted = (objective: Objective) => {
    toggleCompletedAction(objective);
  };

  const { mutate: toggleCompletedAction } = useMutation<
    boolean,
    Error,
    Objective
  >({
    mutationFn: (objective) => ObjectiveService.toggleCompleted(objective),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["objectives", objective.goalId.toString()],
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
    mutationFn: (id) => ObjectiveService.deleteObjective(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["objectives", objective.goalId.toString()],
      });
    },
  });
  //#endregion

  const handleEdit = (objective: Objective) => {
    onEdit(objective);
  };

  //#region MoveObjective
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.OBJECTIVE,
    item: {
      type: ItemTypes.OBJECTIVE,
      index,
      id: objective.id,
      goalId: objective.goalId,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.OBJECTIVE,
    hover: (item) => {
      // console.log(item);
      // console.log("Hover Index:" + index);
    },
    drop: (item: {
      type: string;
      index: number;
      id: number;
      goalId: number;
    }) => {
      // console.log(item);
      // console.log("Drop Index:" + index);
      moveObjectiveAction({
        id: item.id,
        index: index,
        goalId: item.goalId,
      });
    },
  });

  const { mutate: moveObjectiveAction } = useMutation<
    boolean,
    Error,
    { id: number; index: number; goalId: number }
  >({
    mutationFn: (data) =>
      ObjectiveService.moveObjective(data.id, data.index, data.goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["objectives", objective.goalId.toString()],
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
            checked={objective.completed}
            onChange={() => toggleCompleted(objective)}
          />
        </div>
        <div className="col-8">
          <Link to={`/objective/${objective.id}`}>{objective.text}</Link>
        </div>

        <div className="col-1">
          {objective.twentyPercent && (
            <span className="badge text-bg-dark rounded-pill">Top 20%</span>
          )}
        </div>

        <div className="col-2 text-end">
          {objective.twentyPercent ? (
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              type="button"
              onClick={() => markAsNormal(objective.id)}>
              80%
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              type="button"
              onClick={() => markAsTwentyPercent(objective.id)}>
              20%
            </button>
          )}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary me-1"
            onClick={() => handleEdit(objective)}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => handleDelete(objective.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default ObjectiveListItem;

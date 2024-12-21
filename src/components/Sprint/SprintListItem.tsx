import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Sprint from "../../models/Sprint";
import SprintService from "../../services/sprint.service";
import { useAppDispatch } from "../../store";
import { sprintActions } from "../../store/Sprint";
import { converTotString } from "../../utils";
import AppHelper from "../../utils/app.helper";
import { queryClient } from "../../utils/http";

const SprintListItem: React.FC<{
  sprint: Sprint;
  onEdit: (sprint: Sprint) => void;
}> = ({ sprint, onEdit }) => {
  const dispatch = useAppDispatch();

  //#region ToggleCompleted
  const toggleCompleted = (sprint: Sprint) => {
    toggleCompletedAction(sprint);
  };

  const { mutate: toggleCompletedAction } = useMutation<boolean, Error, Sprint>(
    {
      mutationFn: (sprint) => SprintService.toggleCompleted(sprint),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["sprints"],
        });
      },
    }
  );
  //#endregion

  //#region HandleDeleted
  const handleDelete = (id: number) => {
    const confirmed = confirm("Are you sure to delete?");
    if (confirmed) {
      deleteSprintAction(id);
    }
  };

  const { mutate: deleteSprintAction } = useMutation<boolean, Error, number>(
    {
      mutationFn: (id) => SprintService.deleteSprint(id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["sprints"],
        });
      },
    }
  );

  //#endregion

  const handleEdit = (sprint: Sprint) => {
    onEdit(sprint);
  };

  return (
    <li className="list-group-item">
      <div className="row">
        <div className="col-1">
          <input
            className="form-check-input me-2"
            type="checkbox"
            value=""
            checked={sprint.completed}
            onChange={() => toggleCompleted(sprint)}
          />
        </div>
        <div className="col-6">
          <Link to={`/sprint/${sprint.id}`}>{sprint.text}</Link>
        </div>

        <div className="col-3">
          {`${converTotString(
            AppHelper.convertToDate(sprint.startDate)
          )} - ${converTotString(AppHelper.convertToDate(sprint.endDate))}`}
        </div>

        <div className="col-2 text-end">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary me-1"
            onClick={() => handleEdit(sprint)}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => handleDelete(sprint.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default SprintListItem;

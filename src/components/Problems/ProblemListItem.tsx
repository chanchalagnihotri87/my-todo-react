import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { useDrag, useDrop } from "react-dnd";
import { Link } from "react-router-dom";
import Problem from "../../models/Problem";
import ProblemService from "../../services/problems.service";
import { queryClient } from "../../utils/http";

const ItemTypes = {
  PROBLEM: "problem",
};

const ProblemListItem: React.FC<{
  problem: Problem;
  index: number;
  onEdit: (problem: Problem) => void;
}> = ({ problem, index, onEdit }) => {
  //#region HandleDelete
  const { mutate: deleteProblem } = useMutation<
    boolean,
    unknown,
    { id: number }
  >({
    mutationFn: async (data) => await ProblemService.deleteProblem(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lifeareas", problem.lifeAreaId.toString()],
      });
    },
  });

  const handleDelete = (id: number) => {
    const confirmed = confirm("Are you sure to delete?");
    if (confirmed) {
      deleteProblem({ id });
    }
  };

  //#endregion

  //#region MarkAsTwentyPercent
  const { mutate: setAsTwentyPercent } = useMutation<
    boolean,
    unknown,
    { id: number }
  >({
    mutationFn: async (data) =>
      await ProblemService.markAsTwentyPercent(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lifeareas", problem.lifeAreaId.toString()],
      });
    },
  });

  const markAsTwentyPercent = (id: number) => {
    setAsTwentyPercent({ id });
  };
  //#endregion

  //#region MarkAsNormal
  const { mutate: setAsNormal } = useMutation<boolean, unknown, { id: number }>(
    {
      mutationFn: async (data) => await ProblemService.markAsNormal(data.id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["lifeareas", problem.lifeAreaId.toString()],
        });
      },
    }
  );

  const markAsNormal = (id: number) => {
    setAsNormal({ id });
  };

  //#endregion

  //#region ToggleCompleted
  const { mutate: toggleComplete } = useMutation<boolean, unknown, Problem>({
    mutationFn: async (problem) =>
      await ProblemService.toggleCompleted(problem),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lifeareas", problem.lifeAreaId.toString()],
      });
    },
  });

  const toggleCompleted = (problem: Problem) => {
    toggleComplete(problem);
  };
  //#endregion

  //#region MoveProblem
  const { mutate: moveProblem } = useMutation<
    boolean,
    unknown,
    { id: number; index: number; lifeAreaId: number }
  >({
    mutationFn: async (data) =>
      await ProblemService.moveProblem(data.id, data.index, data.lifeAreaId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lifeareas", problem.lifeAreaId.toString()],
      });
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PROBLEM,
    item: {
      type: ItemTypes.PROBLEM,
      index,
      id: problem.id,
      lifeAreaId: problem.lifeAreaId,
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
      lifeAreaId: number;
    }) => {
      // console.log(item);
      // console.log("Drop Index:" + index);

      // dispatch(
      //   problemActions.moveProblem({
      //     id: item.id,
      //     index: index,
      //     lifeAreaId: item.lifeAreaId,
      //   })

      // );

      moveProblem({
        id: item.id,
        index: index + 1,
        lifeAreaId: item.lifeAreaId,
      });
    },
  });

  //#endregion

  //#region HandleEdit
  const handleEdit = (problem: Problem) => {
    onEdit(problem);
  };

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
            checked={problem.completed}
            onChange={() => toggleCompleted(problem)}
          />
        </div>
        <div className="col-8">
          <Link to={`/problem/${problem.id}`}>{problem.text}</Link>
        </div>

        <div className="col-1">
          {problem.twentyPercent && (
            <span className="badge text-bg-dark rounded-pill">Top 20%</span>
          )}
        </div>

        <div className="col-2 text-end">
          {problem.twentyPercent ? (
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              type="button"
              onClick={() => markAsNormal(problem.id)}>
              80%
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              type="button"
              onClick={() => markAsTwentyPercent(problem.id)}>
              20%
            </button>
          )}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary me-1"
            onClick={() => handleEdit(problem)}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => handleDelete(problem.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default ProblemListItem;

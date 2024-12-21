import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent } from "react";
import { useDrag, useDrop } from "react-dnd";
import Sprint from "../../models/Sprint";
import TodoItem from "../../models/TodoItem";
import SprintService from "../../services/sprint.service";
import TodoItemService from "../../services/todoitem.service";
import { queryClient } from "../../utils/http";

const ItemTypes = {
  TODO: "todo",
};

const TodoListItem: React.FC<{
  item: TodoItem;
  index: number;
  onEdit: (item: TodoItem) => void;
}> = ({ item, index, onEdit }) => {
  const { data: sprints = [] } = useQuery<Sprint[]>({
    queryKey: ["sprints"],
    queryFn: () => SprintService.getActiveSprints(),
  });

  //#region ToggleCompleted
  const toggleCompleted = (todoItem: TodoItem) => {
    toggleCompletedAction(todoItem);
  };

  const { mutate: toggleCompletedAction } = useMutation<
    boolean,
    Error,
    TodoItem
  >({
    mutationFn: (todoItem) => TodoItemService.toggleCompleted(todoItem),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todoitems", item.taskId.toString()],
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
    mutationFn: (id) => TodoItemService.deleteTodoItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todoitems", item.taskId.toString()],
      });
    },
  });

  //#endregion

  const handleEdit = (item: TodoItem) => {
    onEdit(item);
  };

  //#region HandleAssignSpring
  const handleAssignSprint = (event: ChangeEvent<HTMLSelectElement>) => {
    updateTaskSprintAction({
      id: item.id,
      sprintId: event.currentTarget.value
        ? parseInt(event.currentTarget.value)
        : undefined,
    });
  };

  const { mutate: updateTaskSprintAction } = useMutation<
    boolean,
    Error,
    { id: number; sprintId?: number | undefined }
  >({
    mutationFn: (data) => TodoItemService.updateSprint(data.id, data.sprintId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todoitems", item.taskId.toString()],
      });
    },
  });
  //#endregion

  //#region MoveTodoItem
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TODO,
    item: {
      type: ItemTypes.TODO,
      index,
      id: item.id,
      taskId: item.taskId,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TODO,
    hover: (item) => {
      // console.log(item);
      // console.log("Hover Index:" + index);
    },
    drop: (item: {
      type: string;
      index: number;
      id: number;
      taskId: number;
    }) => {
      // console.log(item);
      // console.log("Drop Index:" + index);

      moveTodoItemAction({
        id: item.id,
        index: index,
        taskId: item.taskId,
      });
    },
  });

  const { mutate: moveTodoItemAction } = useMutation<
    boolean,
    Error,
    { id: number; index: number; taskId: number }
  >({
    mutationFn: (data) =>
      TodoItemService.moveTodoItem(data.id, data.index, data.taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todoitems", item.taskId.toString()],
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
            checked={item.completed}
            onChange={() => toggleCompleted(item)}
          />
        </div>
        <div className="col-8">{item.text}</div>
        <div className="col-2">
          <select
            className="form-select text-muted"
            onChange={handleAssignSprint}>
            <option value="">Sprint</option>
            {sprints.map((sprint) => (
              <option value={sprint.id} selected={item.sprintId === sprint.id}>
                {sprint.text}
              </option>
            ))}
          </select>
        </div>

        <div className="col-1 text-end">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary me-1"
            onClick={() => handleEdit(item)}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => handleDelete(item.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TodoListItem;

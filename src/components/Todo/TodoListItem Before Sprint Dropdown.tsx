import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDrag, useDrop } from "react-dnd";
import TodoItem from "../../models/TodoItem";
import { useAppDispatch, useAppSelector } from "../../store";
import { todoActions } from "../../store/Todo";

const ItemTypes = {
  TODO: "todo",
};

const TodoListItem: React.FC<{
  item: TodoItem;
  index: number;
  onEdit: (item: TodoItem) => void;
}> = ({ item, index, onEdit }) => {
  const dispatch = useAppDispatch();

  const sprints = useAppSelector((state) =>
    state.sprint.sprints.filter((sprint) => sprint.endDate > new Date())
  );

  const markAsTwentyPercent = (id: number) => {
    dispatch(todoActions.markAs20Percent(id));
  };

  const markAsNormal = (id: number) => {
    dispatch(todoActions.markAsNormal(id));
  };

  const toggleCompleted = (id: number) => {
    dispatch(todoActions.toggleCompleted(id));
  };

  const handleDelete = (id: number) => {
    const confirmed = confirm("Are you sure to delete?");
    if (confirmed) {
      dispatch(todoActions.deleteItem(id));
    }
  };

  const handleEdit = (item: TodoItem) => {
    onEdit(item);
  };

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

      dispatch(
        todoActions.moveItem({
          id: item.id,
          index: index,
          taskId: item.taskId,
        })
      );
    },
  });

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
            onChange={() => toggleCompleted(item.id)}
          />
        </div>
        <div className="col-8">{item.text}</div>
        <div className="col-2">
          <select className="form-select text-muted">
            <option value="">Sprint</option>
            {sprints.map((sprint) => (
              <option value={sprint.id}>{sprint.text}</option>
            ))}
          </select>
        </div>

        {/* <div className="col-1">
          {item.twentyPercent && (
            <span className="badge text-bg-dark rounded-pill">Top 20%</span>
          )}
        </div> */}

        <div className="col-1 text-end">
          {/* {item.twentyPercent ? (
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              type="button"
              onClick={() => markAsNormal(item.id)}>
              80%
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              type="button"
              onClick={() => markAsTwentyPercent(item.id)}>
              20%
            </button>
          )} */}
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

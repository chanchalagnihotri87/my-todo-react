import { useQuery } from "@tanstack/react-query";
import TodoItem from "../../models/TodoItem";
import TodoItemService from "../../services/todoitem.service";
import TodoListItem from "./TodoListItem";

const TodoList: React.FC<{
  taskId: number;
  onEdit: (item: TodoItem) => void;
}> = ({ taskId, onEdit }) => {
  const { data: todoItems } = useQuery<TodoItem[]>({
    queryKey: ["todoitems", taskId.toString()],
    queryFn: () => TodoItemService.getTodoItems(taskId),
  });

  return (
    todoItems && (
      <ul className="list-group">
        {todoItems.map((item, index) => (
          <TodoListItem
            key={item.id}
            item={item}
            index={index}
            onEdit={onEdit}
          />
        ))}
      </ul>
    )
  );
};

export default TodoList;

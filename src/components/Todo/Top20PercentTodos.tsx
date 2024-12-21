import { useQuery } from "@tanstack/react-query";
import { PathItem } from "../../models/PathItem";
import TodoItem from "../../models/TodoItem";
import TodoItemService from "../../services/todoitem.service";
import TwentyPercentItems from "../TwentyPercentItems";

const Top20PercentTodos: React.FC<{ taskId: number }> = ({ taskId }) => {
  const { data: twentyPercentTodos } = useQuery<TodoItem[]>({
    queryKey: ["todoitems", taskId.toString(), "twentypercent"],
    queryFn: () => TodoItemService.getTwentyPercentTodoItems(taskId),
  });

  return (
    twentyPercentTodos && (
      <TwentyPercentItems
        items={twentyPercentTodos.map((task) => new PathItem(task.text, ""))}
      />
    )
  );
};

export default Top20PercentTodos;

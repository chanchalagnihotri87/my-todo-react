import TodoItem from "../models/TodoItem";
import {
  DeleteRequest,
  GetRequest,
  PatchRequest,
  PostRequest,
} from "../utils/httprequest";

const TodoItemService = {
  async getTwentyPercentTodoItems(taskId: number) {
    const todoItems = await this.getTodoItems(taskId);

    return todoItems
      .filter((x) => x.twentyPercent && !x.completed)
      .sort((a: TodoItem, b: TodoItem) => a.index - b.index);
  },

  async getTodoItems(taskId: number) {
    const { todoItems }: { todoItems: TodoItem[] } = await GetRequest(
      `/todo-service/todoitems/${taskId}`
    );

    return todoItems.sort((a: TodoItem, b: TodoItem) => a.index - b.index);
  },

  async getTodoItemsBySprintId(sprintId: number) {
    const { todoItems }: { todoItems: TodoItem[] } = await GetRequest(
      `/todo-service/todoitems/sprint/${sprintId}`
    );

    return todoItems.sort((a: TodoItem, b: TodoItem) => a.index - b.index);
  },

  async getTodoItemById(id: number) {
    const { todoItem }: { todoItem: TodoItem } = await GetRequest(
      `/todo-service/todoitems/detail/${id}`
    );

    return todoItem;
  },

  addTodoItem: async (taskId: number, text: string): Promise<number> => {
    const { id }: { id: number } = await PostRequest(
      `/todo-service/todoitems`,
      {
        TodoItem: { taskId, text },
      }
    );

    return id;
  },

  updateSprint: async (id: number, sprintId?: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/todoitems/sprint/${id}`,
      { sprintId }
    );

    return isSuccess;
  },

  updateDate: async (id: number, date: string): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/todoitems/date/${id}`,
      { date }
    );

    return isSuccess;
  },

  updateText: async (id: number, text: string): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/todoitems/text/${id}`,
      { text }
    );

    return isSuccess;
  },
  deleteTodoItem: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await DeleteRequest(
      `/todo-service/todoitems/${id}`
    );

    return isSuccess;
  },
  markAsTwentyPercent: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/todoitems/twentypercent/${id}`,
      { twentyPercent: true }
    );

    return isSuccess;
  },
  markAsNormal: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/todoitems/twentypercent/${id}`,
      { twentyPercent: false }
    );

    return isSuccess;
  },
  toggleCompleted: async (todoItem: TodoItem): Promise<boolean> => {
    debugger;
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/todoitems/complete/${todoItem.id}`,
      { completed: !todoItem.completed }
    );

    return isSuccess;
  },
  moveTodoItem: async (
    id: number,
    index: number,
    taskId: number
  ): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/todoitems/move/${id}`,
      { taskId, index }
    );

    return isSuccess;
  },
};

export default TodoItemService;

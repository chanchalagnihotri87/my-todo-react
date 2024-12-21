import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import TodoItem from "../../models/TodoItem";
import TodoItemService from "../../services/todoitem.service";
import { useAppDispatch } from "../../store";
import { queryClient } from "../../utils/http";
import TodoModal, { TodoModalHandle } from "../TodoModal";
import TodoList from "./TodoList";

const TodoTab: React.FC<{ taskId: number }> = ({ taskId }) => {
  const [todoItemText, setTodoItemText] = useState<string>("");
  const [selectedTodoItemId, setSelectedTodoItemId] = useState<number>();

  const dispatch = useAppDispatch();

  //#region Add Problem

  const addNewItemModalRef = useRef<TodoModalHandle>(null);

  const handleAddTask = () => {
    addNewItemModalRef.current!.open();
    setTodoItemText("");
    setSelectedTodoItemId(undefined);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd);
    console.log(data);

    if (selectedTodoItemId) {
      updateTodoItemTextAction({
        id: selectedTodoItemId,
        text: data["item-text"].toString(),
      });
    } else {
      addTodoItemAction({ taskId, text: data["item-text"].toString() });
    }

    addNewItemModalRef.current?.close();
  };

  const { mutate: addTodoItemAction } = useMutation<
    number,
    Error,
    { taskId: number; text: string }
  >({
    mutationFn: (data) => TodoItemService.addTodoItem(data.taskId, data.text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todoitems", taskId.toString()],
      });
    },
  });

  const { mutate: updateTodoItemTextAction } = useMutation<
    boolean,
    Error,
    { id: number; text: string }
  >({
    mutationFn: (data) => TodoItemService.updateText(data.id, data.text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todoitems", taskId.toString()],
      });
    },
  });
  //#endregion

  //#region Edit Problem

  const handleEdit = (item: TodoItem) => {
    setSelectedTodoItemId(item.id);

    setTodoItemText(item!.text);
    addNewItemModalRef.current?.open();
  };

  //#endregion

  const handleTaskTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoItemText(event.currentTarget.value);
  };

  return (
    <>
      <TodoModal
        title="New Item"
        ref={addNewItemModalRef}
        onSave={handleSubmit}>
        <input
          type="text"
          id="item-text"
          name="item-text"
          className="form-control"
          placeholder="Write your item"
          value={todoItemText}
          onChange={handleTaskTextChange}
          required
        />
      </TodoModal>
      <div className="row mb-2">
        <div className="col text-end">
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={handleAddTask}>
            <FontAwesomeIcon icon={faPlus} /> Add a Item
          </button>
        </div>
      </div>
      <TodoList taskId={taskId} onEdit={handleEdit} />
    </>
  );
};

export default TodoTab;

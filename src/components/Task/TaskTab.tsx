import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import Task from "../../models/Task";
import TaskService from "../../services/task.service";
import { queryClient } from "../../utils/http";
import TodoModal, { TodoModalHandle } from "../TodoModal";
import TasksList from "./TasksList";

const TaskTab: React.FC<{ objectiveId: number }> = ({ objectiveId }) => {
  const [taskText, setTaskText] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<number>();

  //#region Add Problem

  const addNewTaskModalRef = useRef<TodoModalHandle>(null);

  const handleAddTask = () => {
    addNewTaskModalRef.current!.open();
    setTaskText("");
    setSelectedTaskId(undefined);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd);
    console.log(data);

    if (selectedTaskId) {
      updateTaskTextAction({
        id: selectedTaskId,
        text: data["task-text"].toString(),
      });
    } else {
      addTaskAction({ objectiveId, text: data["task-text"].toString() });
    }

    addNewTaskModalRef.current?.close();
  };

  const { mutate: addTaskAction } = useMutation<
    number,
    Error,
    { objectiveId: number; text: string }
  >({
    mutationFn: (data) => TaskService.addTask(data.objectiveId, data.text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", objectiveId.toString()],
      });
    },
  });

  const { mutate: updateTaskTextAction } = useMutation<
    boolean,
    Error,
    { id: number; text: string }
  >({
    mutationFn: (data) => TaskService.updateText(data.id, data.text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", objectiveId.toString()],
      });
    },
  });
  //#endregion

  //#region Edit Problem

  const handleEdit = (task: Task) => {
    setSelectedTaskId(task.id);

    setTaskText(task!.text);
    addNewTaskModalRef.current?.open();
  };

  //#endregion

  const handleTaskTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTaskText(event.currentTarget.value);
  };

  return (
    <>
      <TodoModal
        title="New Task"
        ref={addNewTaskModalRef}
        onSave={handleSubmit}>
        <input
          type="text"
          id="task-text"
          name="task-text"
          className="form-control"
          placeholder="Write your task"
          value={taskText}
          onChange={handleTaskTextChange}
          required
        />
      </TodoModal>
      <div className="row mb-2">
        <div className="col text-end">
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={handleAddTask}>
            <FontAwesomeIcon icon={faPlus} /> Add a Task
          </button>
        </div>
      </div>
      <TasksList objectiveId={objectiveId} onEdit={handleEdit} />
    </>
  );
};

export default TaskTab;

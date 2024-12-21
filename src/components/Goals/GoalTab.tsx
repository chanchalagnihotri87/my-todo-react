import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import Goal from "../../models/Goal";
import GoalService from "../../services/goals.service";
import { useAppDispatch } from "../../store";
import { queryClient } from "../../utils/http";
import TodoModal, { TodoModalHandle } from "../TodoModal";
import GoalList from "./GoalsList";

const GoalTab: React.FC<{ problemId: number }> = ({ problemId }) => {
  const [goalText, setGoalText] = useState<string>("");
  const [selectedGoalId, setSelectedGoalId] = useState<number>();

  const dispatch = useAppDispatch();

  //#region Add Problem

  const addNewGoalModalRef = useRef<TodoModalHandle>(null);

  const handleAddGoal = () => {
    addNewGoalModalRef.current!.open();
    setGoalText("");
    setSelectedGoalId(undefined);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd);
    console.log(data);

    if (selectedGoalId) {
      updateGoalText({
        id: selectedGoalId,
        text: data["goal-text"].toString(),
      });
    } else {
      addGoal({ problemId, text: data["goal-text"].toString() });
    }

    addNewGoalModalRef.current?.close();
  };

  const { mutate: addGoal } = useMutation<
    number,
    Error,
    { problemId: number; text: string }
  >({
    mutationFn: (data) => GoalService.addGoal(data.problemId, data.text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals", problemId.toString()],
      });
    },
  });

  const { mutate: updateGoalText } = useMutation<
    boolean,
    Error,
    { id: number; text: string }
  >({
    mutationFn: (data) => GoalService.updateText(data.id, data.text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals", problemId.toString()],
      });
    },
  });

  //#endregion

  //#region Edit Problem

  const handleEdit = (goal: Goal) => {
    setSelectedGoalId(goal.id);

    setGoalText(goal!.text);
    addNewGoalModalRef.current?.open();
  };

  //#endregion

  const handleGoalTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGoalText(event.currentTarget.value);
  };

  return (
    <>
      <TodoModal
        title="New Goal"
        ref={addNewGoalModalRef}
        onSave={handleSubmit}>
        <input
          type="text"
          id="goal-text"
          name="goal-text"
          className="form-control"
          placeholder="Write your goal"
          value={goalText}
          onChange={handleGoalTextChange}
          required
        />
      </TodoModal>
      <div className="row mb-2">
        <div className="col text-end">
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={handleAddGoal}>
            <FontAwesomeIcon icon={faPlus} /> Add a Goal
          </button>
        </div>
      </div>
      <GoalList problemId={problemId} onEdit={handleEdit} />
    </>
  );
};

export default GoalTab;

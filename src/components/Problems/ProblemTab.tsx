import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import Problem from "../../models/Problem";
import ProblemService from "../../services/problems.service";
import { queryClient } from "../../utils/http.ts";
import TodoModal, { TodoModalHandle } from "../TodoModal";
import ProblemsList from "./ProblemsList";

const ProblemTab: React.FC<{ lifeAreaId: number }> = ({ lifeAreaId }) => {
  const [problemText, setProblemText] = useState<string>("");

  //#region Add Problem

  const { mutate: addProblem } = useMutation<
    number,
    unknown,
    { lifeAreaId: number; text: string }
  >({
    mutationFn: async (data) =>
      await ProblemService.addProblem(data.lifeAreaId, data.text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lifeareas", lifeAreaId.toString()],
      });
    },
  });
  //#endregion

  //#region UpdateProblem
  const { mutate: updateProblem } = useMutation<
    boolean,
    unknown,
    { id: number; text: string }
  >({
    mutationFn: async (data) =>
      await ProblemService.updateText(data.id, data.text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lifeareas", lifeAreaId.toString()],
      });
    },
  });
  //#endregion

  //#region Add Problem Modal

  const addNewProblemModalRef = useRef<TodoModalHandle>(null);

  const handleAddProblem = () => {
    addNewProblemModalRef.current!.open();
    // setProblemText("");
    setSelectedProblemId(undefined);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd);
    console.log(data);

    if (selectedProblemId) {
      updateProblem({
        id: selectedProblemId,
        text: data["problem-text"].toString(),
      });
    } else {
      addProblem({ lifeAreaId, text: data["problem-text"].toString() });
      //dispatch(problemActions.addProblem({ text: data["problem-text"] }));
    }

    addNewProblemModalRef.current?.close();
  };
  //#endregion

  //#region Edit Problem

  const [selectedProblemId, setSelectedProblemId] = useState<number>();

  const handleEdit = (problem: Problem) => {
    setSelectedProblemId(problem.id);

    setProblemText(problem!.text);
    addNewProblemModalRef.current?.open();
  };

  //#endregion

  const handleProblemTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProblemText(event.currentTarget.value);
  };

  return (
    <>
      <TodoModal
        title="New Problem"
        ref={addNewProblemModalRef}
        onSave={handleSubmit}>
        <input
          type="text"
          id="problem-text"
          name="problem-text"
          className="form-control"
          placeholder="Write your problem"
          value={problemText}
          onChange={handleProblemTextChange}
          required
        />
      </TodoModal>
      <div className="row mb-2">
        <div className="col text-end">
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={handleAddProblem}>
            <FontAwesomeIcon icon={faPlus} /> Add a Problem
          </button>
        </div>
      </div>
      <ProblemsList lifeAreaId={lifeAreaId} onEdit={handleEdit} />
    </>
  );
};

export default ProblemTab;

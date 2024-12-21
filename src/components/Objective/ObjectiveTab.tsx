import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import Objective from "../../models/Objective";
import ObjectiveService from "../../services/objective.service";
import { queryClient } from "../../utils/http";
import TodoModal, { TodoModalHandle } from "../TodoModal";
import ObjectivesList from "./ObjectivesList";

const ObjectiveTab: React.FC<{ goalId: number }> = ({ goalId }) => {
  const [objectiveText, setObjectiveText] = useState<string>("");
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<number>();

  //#region Add Problem

  const addNewObjectiveModalRef = useRef<TodoModalHandle>(null);

  const handleAddObjective = () => {
    addNewObjectiveModalRef.current!.open();
    setObjectiveText("");
    setSelectedObjectiveId(undefined);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd);
    console.log(data);

    if (selectedObjectiveId) {
      updateObjectiveTextAction({
        id: selectedObjectiveId,
        text: data["objective-text"].toString(),
      });
    } else {
      addObjectiveAction({ goalId, text: data["objective-text"].toString() });
    }

    addNewObjectiveModalRef.current?.close();
  };

  const { mutate: addObjectiveAction } = useMutation<
    number,
    Error,
    { goalId: number; text: string }
  >({
    mutationFn: (data) => ObjectiveService.addObjective(data.goalId, data.text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["objectives", goalId.toString()],
      });
    },
  });

  const { mutate: updateObjectiveTextAction } = useMutation<
    boolean,
    Error,
    { id: number; text: string }
  >({
    mutationFn: (data) => ObjectiveService.updateText(data.id, data.text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["objectives", goalId.toString()],
      });
    },
  });
  //#endregion

  //#region Edit Problem

  const handleEdit = (objective: Objective) => {
    setSelectedObjectiveId(objective.id);

    setObjectiveText(objective!.text);
    addNewObjectiveModalRef.current?.open();
  };

  //#endregion

  const handleObjectiveTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setObjectiveText(event.currentTarget.value);
  };

  return (
    <>
      <TodoModal
        title="New Objective"
        ref={addNewObjectiveModalRef}
        onSave={handleSubmit}>
        <input
          type="text"
          id="objective-text"
          name="objective-text"
          className="form-control"
          placeholder="Write your objective"
          value={objectiveText}
          onChange={handleObjectiveTextChange}
          required
        />
      </TodoModal>
      <div className="row mb-2">
        <div className="col text-end">
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={handleAddObjective}>
            <FontAwesomeIcon icon={faPlus} /> Add a Objective
          </button>
        </div>
      </div>
      <ObjectivesList goalId={goalId} onEdit={handleEdit} />
    </>
  );
};

export default ObjectiveTab;

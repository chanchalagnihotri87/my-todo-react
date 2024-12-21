import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import Sprint from "../../models/Sprint";
import SprintService from "../../services/sprint.service";
import { useAppDispatch } from "../../store";
import { converToDateElementString } from "../../utils";
import AppHelper from "../../utils/app.helper";
import { queryClient } from "../../utils/http";
import TodoModal, { TodoModalHandle } from "../TodoModal";
import SprintList from "./SprintList";

const SprintTab: React.FC = () => {
  const [sprintText, setSprintText] = useState<string>("");
  const [sprintStartDate, setSprintStartDate] = useState<string>("");
  const [sprintEndDate, setSprintEndDate] = useState<string>("");
  const [selectedSprintId, setSelectedSprintId] = useState<number>();

  const dispatch = useAppDispatch();

  //#region Add Problem

  const addNewSprintModalRef = useRef<TodoModalHandle>(null);

  const handleAddSprint = () => {
    addNewSprintModalRef.current!.open();
    setSprintText("");
    setSprintStartDate("");
    setSprintEndDate("");
    setSelectedSprintId(undefined);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd);
    console.log(data);

    const startDate = new Date(data["sprint-start-date"] + "T00:00");
    const endDate = new Date(data["sprint-end-date"] + "T00:00");

    if (selectedSprintId) {
      updateSprintAction({
        id: selectedSprintId,
        text: data["sprint-text"].toString(),
        startDate: startDate,
        endDate: endDate,
      });
    } else {
      addSprintAction({
        text: data["sprint-text"].toString(),
        startDate: startDate,
        endDate: endDate,
      });
    }

    addNewSprintModalRef.current?.close();
  };

  const { mutate: addSprintAction } = useMutation<
    number,
    Error,
    { text: string; startDate: Date; endDate: Date }
  >({
    mutationFn: (data) =>
      SprintService.addSprint(data.text, data.startDate, data.endDate),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sprints"],
      });
    },
  });

  const { mutate: updateSprintAction } = useMutation<
    boolean,
    Error,
    { id: number; text: string; startDate: Date; endDate: Date }
  >({
    mutationFn: (data) =>
      SprintService.updateSprint(
        data.id,
        data.text,
        data.startDate,
        data.endDate
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sprints"],
      });
    },
  });
  //#endregion

  //#region Edit Problem

  const handleEdit = (sprint: Sprint) => {
    setSelectedSprintId(sprint.id);

    setSprintText(sprint!.text);
    setSprintStartDate(
      converToDateElementString(AppHelper.convertToDate(sprint!.startDate)) ??
        ""
    );
    setSprintEndDate(
      converToDateElementString(AppHelper.convertToDate(sprint!.endDate)) ?? ""
    );
    addNewSprintModalRef.current?.open();
  };

  //#endregion

  const handleTaskTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSprintText(event.currentTarget.value);
  };

  const handleTaskStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSprintStartDate(event.currentTarget.value);
  };

  const handleTaskEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSprintEndDate(event.currentTarget.value);
  };

  return (
    <>
      <TodoModal
        title="New Sprint"
        ref={addNewSprintModalRef}
        onSave={handleSubmit}>
        <div className="row  mb-3">
          <div className="col">
            <label htmlFor="sprint-text">Title</label>
            <input
              type="text"
              id="sprint-text"
              name="sprint-text"
              className="form-control"
              placeholder="Write your sprint title"
              value={sprintText}
              onChange={handleTaskTextChange}
              required
            />
          </div>
        </div>
        <div className="row  mb-3">
          <div className="col">
            <label htmlFor="sprint-start-date">Start Date</label>
            <input
              type="date"
              key="startdate"
              id="sprint-start-date"
              name="sprint-start-date"
              className="form-control"
              value={sprintStartDate}
              onChange={handleTaskStartDateChange}
              required
            />
          </div>
        </div>
        <div className="row  mb-3">
          <div className="col">
            <label htmlFor="sprint-text">End Date</label>
            <input
              type="date"
              key="enddate"
              id="sprint-end-date"
              name="sprint-end-date"
              className="form-control"
              value={sprintEndDate}
              onChange={handleTaskEndDateChange}
              required
            />
          </div>
        </div>
      </TodoModal>
      <div className="row mb-2">
        <div className="col text-end">
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={handleAddSprint}>
            <FontAwesomeIcon icon={faPlus} /> Add a Sprint
          </button>
        </div>
      </div>
      <SprintList onEdit={handleEdit} />
    </>
  );
};

export default SprintTab;

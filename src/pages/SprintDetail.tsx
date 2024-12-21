import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Sprint from "../models/Sprint";
import TodoItem from "../models/TodoItem";
import SprintService from "../services/sprint.service";
import TodoItemService from "../services/todoitem.service";
import { useAppDispatch } from "../store";
import {
  converToNumber,
  converTotString,
  convertToLongDateString,
} from "../utils";
import AppHelper from "../utils/app.helper";
import { queryClient } from "../utils/http";

const SprintDetailPage: React.FC = () => {
  const [showTodaysTasks, setShowTodaysTasks] = useState(true);
  const id = converToNumber(useParams().id);
  const dispatch = useAppDispatch();

  const { data: sprint } = useQuery<Sprint>({
    queryKey: ["sprints"],
    queryFn: () => SprintService.getSprintById(id),
  });

  const { data: todoItems = [] } = useQuery<TodoItem[]>({
    queryKey: ["todoitems", "sprint", id.toString()],
    queryFn: () => TodoItemService.getTodoItemsBySprintId(id),
  });

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const todaysItems = () => {
    return todoItems.filter(
      (item) =>
        !item.completed &&
        item.date &&
        AppHelper.convertToDate(item.date) <= todayDate
    );
  };

  const toggleShowTodaysTasks = () => {
    setShowTodaysTasks((prevToggle) => !prevToggle);
  };

  //#region ToggleCompleted
  const toggleCompleted = (todoItem: TodoItem) => {
    toggleCompletedAction(todoItem);
  };

  const { mutate: toggleCompletedAction } = useMutation<
    boolean,
    Error,
    TodoItem
  >({
    mutationFn: (todoItem) => TodoItemService.toggleCompleted(todoItem),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todoitems", "sprint", id.toString()],
      });
    },
  });

  //#endregion

  //#region HandleDateChange
  const handleDateChange = (id: number, date: string) => {
    taskDateChangeAction({ id, date });
  };

  const { mutate: taskDateChangeAction } = useMutation<
    boolean,
    Error,
    { id: number; date: string }
  >({
    mutationFn: (data) => TodoItemService.updateDate(data.id, data.date),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todoitems", "sprint", id.toString()],
      });
    },
  });
  //#endregion

  const dateRange: Date[] = [];

  if (sprint) {
    const date = new Date(sprint.startDate);
    while (date <= AppHelper.convertToDate(sprint!.endDate)) {
      dateRange.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
  }

  return (
    <div className="container pt-3">
      {/* Breadcrum */}
      <Breadcrumb
        items={[
          { path: "/sprints", text: "Sprints" },
          { path: "", text: "Detail" },
        ]}
      />

      {/* Title */}
      <div className="row">
        <div className="col-9">
          <h4>{sprint?.text}</h4>
        </div>
        <div className="col-3 text-end">
          {sprint && (
            <span>{`${converTotString(
              AppHelper.convertToDate(sprint.startDate)
            )} - ${converTotString(
              AppHelper.convertToDate(sprint.endDate)
            )}`}</span>
          )}
        </div>
      </div>

      {/* <TwentyPercentItems
        items={todaysItems.map((item) => new PathItem(item.text, ""))}
      /> */}

      {todaysItems().length > 0 && (
        <>
          <div className="row mt-4">
            <div className="col-md-12">
              <p className="mb-0">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={toggleShowTodaysTasks}>
                  Today's Tasks
                </button>
              </p>
            </div>
          </div>
          {showTodaysTasks && (
            <>
              <hr className="mt-2" />

              <ul className="list-group mb-2">
                {todaysItems &&
                  todaysItems().map((item) => (
                    <li key={item.id} className="list-group-item">
                      <div className="row">
                        <div className="col-1">
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            value=""
                            id="firstCheckbox"
                            checked={item.completed}
                            onChange={() => toggleCompleted(item)}
                          />
                        </div>
                        <div className="col-9">{item.text}</div>
                      </div>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </>
      )}

      <div className="row mt-3">
        <div className="col-md-12">
          <p className="mb-0">Tasks</p>
        </div>
      </div>

      <hr className="mt-2" />

      <ul className="list-group">
        {todoItems.map((item) => (
          <li key={item.id} className="list-group-item">
            <div className="row">
              <div className="col-1">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  value=""
                  id="firstCheckbox"
                  checked={item.completed}
                  onChange={() => toggleCompleted(item)}
                />
              </div>
              <div className="col-9">{item.text}</div>
              <div className="col-2">
                <select
                  className="form-select text-muted"
                  onChange={(event) =>
                    handleDateChange(item.id, event.currentTarget.value)
                  }
                  defaultValue={converTotString(item.date)}>
                  <option value="">Date</option>
                  {dateRange.map((dateItem) => (
                    <option
                      key={converTotString(dateItem)}
                      value={converTotString(dateItem)}
                      selected={
                        item.date &&
                        converTotString(dateItem) ==
                          converTotString(AppHelper.convertToDate(item.date))
                      }>
                      {convertToLongDateString(dateItem)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SprintDetailPage;

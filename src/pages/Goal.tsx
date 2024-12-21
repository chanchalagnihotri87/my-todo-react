import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import ObjectiveTab from "../components/Objective/ObjectiveTab";
import Top20PercentObjectives from "../components/Objective/Top20PercentObjectives";
import Goal from "../models/Goal";
import GoalService from "../services/goals.service";
import { useAppSelector } from "../store";
import { converToNumber } from "../utils";
import { queryClient } from "../utils/http";

const GoalPage: React.FC = () => {
  const id = converToNumber(useParams().id);

  const { data: goal } = useQuery<Goal>({
    queryKey: ["goal", id.toString()],
    queryFn: () => GoalService.getGoalById(id),
  });

  const problem = useAppSelector((state) =>
    state.problem.problems.find((problem) => problem.id === goal?.problemId)
  );

  //#region HandlePlanChange
  const handlePlanChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handlePlanChangeAction({ id: id, plan: event.target.value });
  };

  const { mutate: handlePlanChangeAction } = useMutation<
    boolean,
    Error,
    { id: number; plan: string }
  >({
    mutationFn: (data) => GoalService.updatePlan(data.id, data.plan),
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["goal", id.toString()],
      });
    },
  });

  //#endregion

  return (
    <>
      <div className="container pt-3">
        {/* Breadcrum */}
        <Breadcrumb
          items={[
            { path: "/", text: "Life Areas" },
            { path: `/lifearea/${problem?.lifeAreaId}`, text: "Problems" },
            { path: `/problem/${goal?.problemId}`, text: "Goals" },
            { path: "", text: "Detail" },
          ]}
        />

        {/* Title */}
        <div className="row">
          <div className="col">
            <h4>{goal?.text}</h4>
          </div>
        </div>

        {/* Top 20% Problems */}
        <div className="row">
          <div className="col">
            <Top20PercentObjectives goalId={id} />
          </div>
        </div>

        {/* Tabs */}
        <div className="row mt-4">
          <div className="col">
            {/* Tab Links */}
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className="nav-link"
                  id="plan-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#plan"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true">
                  Plan
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link active"
                  id="objectives-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#objectives"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true">
                  Objectives
                </button>
              </li>
            </ul>
            <div className="tab-content border p-3">
              {/* Plan Tab pane */}
              <div
                className="tab-pane"
                id="plan"
                role="tabpanel"
                aria-labelledby="profile-tab"
                tabIndex={0}>
                <textarea
                  name=""
                  id=""
                  rows={5}
                  cols={30}
                  className="form-control"
                  defaultValue={goal?.plan}
                  onBlur={handlePlanChange}></textarea>
              </div>

              {/* Objectives tab pane */}
              <div
                className="tab-pane active"
                id="objectives"
                role="tabpanel"
                aria-labelledby="messages-tab"
                tabIndex={0}>
                <ObjectiveTab goalId={id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoalPage;

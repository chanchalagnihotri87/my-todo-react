import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import TaskTab from "../components/Task/TaskTab";
import Top20PercentTasks from "../components/Task/Top20PercentTasks";
import Objective from "../models/Objective";
import ObjectiveService from "../services/objective.service";
import { useAppSelector } from "../store";
import { converToNumber } from "../utils";
import { queryClient } from "../utils/http";

const ObjectivePage: React.FC = () => {
  const id = converToNumber(useParams().id);
  // const objective = useAppSelector((state) =>
  //   state.objective.objectives.find((objective) => objective.id === id)
  // );

  const { data: objective } = useQuery<Objective>({
    queryKey: ["objective", id.toString()],
    queryFn: () => ObjectiveService.getObjectiveById(id),
  });

  const goal = useAppSelector((state) =>
    state.goal.goals.find((goal) => goal.id === objective?.goalId)
  );

  const problem = useAppSelector((state) =>
    state.problem.problems.find((problem) => problem.id === goal?.problemId)
  );

  //#region HandlePlanChange
  const handlePlanChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handlePlanChangeAction({ id, plan: event.target.value });
  };

  const { mutate: handlePlanChangeAction } = useMutation<
    boolean,
    Error,
    { id: number; plan: string }
  >({
    mutationFn: (data) => ObjectiveService.updatePlan(data.id, data.plan),
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["objective", id.toString()],
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
            { path: `/goal/${objective?.goalId}`, text: "Objectives" },
            { path: "", text: "Detail" },
          ]}
        />

        {/* Title */}
        <div className="row">
          <div className="col">
            <h4>{objective?.text}</h4>
          </div>
        </div>

        {/* Top 20% Problems */}
        <div className="row">
          <div className="col">
            <Top20PercentTasks objectiveId={id} />
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
                  id="tasks-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#tasks"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true">
                  Tasks
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
                  defaultValue={objective?.plan}
                  onBlur={handlePlanChange}></textarea>
              </div>

              {/* Objectives tab pane */}
              <div
                className="tab-pane active"
                id="tasks"
                role="tabpanel"
                aria-labelledby="messages-tab"
                tabIndex={0}>
                <TaskTab objectiveId={id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ObjectivePage;

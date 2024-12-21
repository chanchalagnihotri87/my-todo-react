import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import GoalTab from "../components/Goals/GoalTab";
import Top20PercentGoals from "../components/Goals/Top20PercentGoals";
import ProblemService from "../services/problems.service";
import { converToNumber } from "../utils";

const ProblemPage: React.FC = () => {
  const id = converToNumber(useParams().id);

  const { data: problem } = useQuery({
    queryKey: ["problem", id.toString()],
    queryFn: () => ProblemService.getProblemById(id),
  });

  //#region  handlePlanChange

  const { mutate: updatePlan } = useMutation<
    boolean,
    Error,
    { id: number; plan: string }
  >({
    mutationFn: (data) => ProblemService.updatePlan(data.id, data.plan),
  });

  const handlePlanChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updatePlan({ id, plan: event.target.value });
  };

  //#endregion

  return (
    <>
      <div className="container pt-3">
        {/* Breadcrum */}
        <Breadcrumb
          items={[
            { path: "/", text: "Life Areas" },
            { path: `/lifearea/${problem?.lifeAreaId}`, text: "Problems" },
            { path: "", text: "Detail" },
          ]}
        />

        {/* Title */}
        <div className="row">
          <div className="col">
            <h4>{problem?.text}</h4>
          </div>
        </div>

        {/* Top 20% Problems */}
        <div className="row">
          <div className="col">
            <Top20PercentGoals problemId={id} />
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
                  id="goals-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#goals"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true">
                  Goals
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
                  defaultValue={problem?.plan}
                  onBlur={handlePlanChange}></textarea>
              </div>

              {/* Goals tab pane */}
              <div
                className="tab-pane active"
                id="goals"
                role="tabpanel"
                aria-labelledby="messages-tab"
                tabIndex={0}>
                <GoalTab problemId={id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemPage;

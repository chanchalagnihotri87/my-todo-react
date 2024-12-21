import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import SprintTab from "../components/Sprint/SprintTab";

const SprintsPage: React.FC = () => {
  return (
    <>
      <div className="container pt-3">
        {/* Breadcrum */}
        <Breadcrumb items={[{ path: "", text: "Sprints" }]} />

        {/* Title */}
        <div className="row">
          <div className="col">
            <h4>Sprints</h4>
          </div>
        </div>

        <SprintTab />
      </div>
    </>
  );
};

export default SprintsPage;

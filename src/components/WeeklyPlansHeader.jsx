import React from "react";
import { useNavigate } from "react-router-dom";
// import { canUser } from "@/utils/canUser";

const WeeklyPlansHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="me-3">
        <h4 className="fw-bold mb-1">
          Weekly Plans
        </h4>

        <p className="text-muted fs-12 mb-0">
          Manage weekly plans and track weekly goals
        </p>
      </div>

      {/* Add permission check if required */}
      {/* {canUser("weekly_plans", "create") && ( */}
      <button
        className="btn btn-primary p-2"
        onClick={() =>
          navigate("/weekly-plans/create")
        }
      >
        Create Weekly Plan
      </button>
      {/* )} */}
    </div>
  );
};

export default WeeklyPlansHeader;
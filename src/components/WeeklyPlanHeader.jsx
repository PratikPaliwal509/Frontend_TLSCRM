import React from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

const WeeklyPlanHeader = () => {
  return (
    <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
      <Link
        to="/weekly-plans/create"
        className="btn btn-primary"
      >
        <FiPlus className="me-2" />
        Create Weekly Plan
      </Link>
    </div>
  );
};

export default WeeklyPlanHeader;
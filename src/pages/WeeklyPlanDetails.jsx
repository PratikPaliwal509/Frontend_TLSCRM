import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import WeeklyPlanHeader from "@/components/WeeklyPlanHeader";
import Footer from "@/components/shared/Footer";

const WeeklyPlanDetails = () => {
  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [plan, setPlan] =
    useState(null);

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        `https://api-0ggv.onrender.com/api/weekly-plans/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setPlan(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        Loading...
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container-fluid py-4">
        Weekly Plan not found
      </div>
    );
  }

  const totalTasks =
    plan.tasks?.length || 0;

  const completedTasks =
    plan.tasks?.filter(
      (t) => t.status === "completed"
    ).length || 0;

  const progress =
    totalTasks > 0
      ? Math.round(
        (completedTasks /
          totalTasks) *
        100
      )
      : 0;

  return (
    <div className="container-fluid" style={{ padding: "0" }}>
      <PageHeader>
        <WeeklyPlanHeader />
      </PageHeader>

      <div className="main-content m-4">
        <div className='row'>

          {/* Header */}

          {/* <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>{plan.plan_name}</h3>

          <p className="text-muted mb-0">
            {plan.description}
          </p>
        </div>

        <div>
          <button className="btn btn-primary me-2">
            Edit
          </button>

          <button className="btn btn-danger">
            Delete
          </button>
        </div>
      </div> */}

          {/* Summary Cards */}

          <div className="row mb-4">

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Total Tasks</h6>
                  <h3>{totalTasks}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Completed</h6>
                  <h3>{completedTasks}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Progress</h6>
                  <h3>{progress}%</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Week Range</h6>

                  <small>
  {new Date(plan.start_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}
  {" - "}
  {new Date(plan.end_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}
</small>
                </div>
              </div>
            </div>

          </div>


          {/* Progress Bar */}

          <div className="card mb-4">
            <div className="card-body">

              <h6 className="mb-3">
                Overall Progress
              </h6>

              <div className="progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${progress}%`,
                  }}
                >
                  {progress}%
                </div>
              </div>

            </div>
          </div>

          {/* Tasks */}

          <div className="card">

            <div className="card-header d-flex justify-content-between align-items-center">

              <h5 className="mb-0">
                Weekly Tasks
              </h5>

              <button className="btn btn-success btn-sm">
                Add Task
              </button>

            </div>

            <div className="card-body p-0">

              <table className="table mb-0">

                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assignee</th>
                    <th>Due Date</th>
                  </tr>
                </thead>

                <tbody>

                  {plan.tasks?.length ? (
                    plan.tasks.map((task) => (
                      <tr key={task.task_id}>

                        <td>
                          {task.task_title}
                        </td>

                        <td>
                          <span className="badge bg-secondary">
                            {task.priority}
                          </span>
                        </td>

                        <td>
                          <span className="badge bg-info">
                            {task.status}
                          </span>
                        </td>

                        <td>
                          {task.assignments?.length
                            ? task.assignments
                              .map(
                                (a) =>
                                  a.user
                                    ?.full_name
                              )
                              .join(", ")
                            : "-"}
                        </td>

                        <td>
                          {task.due_date
                            ? new Date(
                              task.due_date
                            ).toLocaleDateString()
                            : "-"}
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-4"
                      >
                        No tasks found
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default WeeklyPlanDetails;
import React, { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import WeeklyPlansHeader from "@/components/WeeklyPlansHeader";
import Footer from "@/components/shared/Footer";

const WeeklyPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://api-0ggv.onrender.com/api/weekly-plans",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    console.log(res.data)
      setPlans(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="container-fluid"  style={{ padding: "0" }}>
     <PageHeader>
      <WeeklyPlansHeader />
     </PageHeader>

      <div className="card m-4">
        <div className="card-body">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Tasks</th>
                  <th>Progress</th>
                </tr>
              </thead>

              <tbody>
                {plans.map((plan) => (
                  <tr
                    key={plan.weekly_plan_id}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      window.location.href =
                        `/applications/weekly-plans/${plan.weekly_plan_id}`
                    }
                  >
                    <td>{plan.title}</td>

                    <td>
                      {new Date(
                        plan.start_date
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {new Date(
                        plan.end_date
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <span className="badge bg-success">
                        {plan.status}
                      </span>
                    </td>

                    <td>
                      {plan.tasks?.length || 0}
                    </td>

                    <td>
                      {plan.progressPercentage || 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default WeeklyPlans;
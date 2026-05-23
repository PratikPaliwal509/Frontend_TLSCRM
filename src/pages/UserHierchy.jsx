import Loader from "@/components/loader";
import Footer from "@/components/shared/Footer";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import HierarchyTree from "@/components/userHierarchy/HierarchyTree";
import React, { useEffect, useState } from "react";

const UserHierarchy = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/hierarchy/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (result.success) setData(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchy();
  }, []);

  return (
  <>
    <PageHeader>
        <div>
          <h5 className="mb-1 fw-bold">User Hierarchy</h5>
          <span className="fs-12 text-muted">
            Visual representation of departments, team leads, and users
          </span>
        </div>
      </PageHeader>

    <div className="p-6 mt-4">
      {loading ? (
        <Loader/>
      ) : data.length > 0 ? (
        <HierarchyTree nodes={data} />
      ) : (
        <p>No data found</p>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default UserHierarchy;
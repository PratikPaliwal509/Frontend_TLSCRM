import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import RolesViewHeader from '@/components/Roles/RolesViewHeader';
import RolesViewContent from '@/components/Roles/RolesViewContent';
import RolesViewTab from '@/components/Roles/RolesViewTab';
import { verifyPagePermission } from '@/utils/verifyPagePermission';

const RoleView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Role data from previous page
  const role = location.state?.role;

  const [loading, setLoading] = useState(true);

  /* ============================
     PAGE PERMISSION CHECK
  ============================ */
  useEffect(() => {
    const checkPermission = async () => {
      await verifyPagePermission('roles', 'view', navigate);
      setLoading(false);
    };
    checkPermission();
  }, []);

  /* ============================
     SAFETY CHECK
  ============================ */
  if (loading) return <p>Loading role...</p>;
  if (!role) {
    return (
      <div className="text-center text-muted p-5">
        No role data available.
        <br />
        <button className="btn btn-sm btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  /* ============================
     RENDER
  ============================ */
  return (
    <>
      <PageHeader>
        <RolesViewHeader role={role} />
      </PageHeader>

      {/* <RolesViewTab role={role} /> */}

      <div className="main-content">
        <div className="tab-content">
          <RolesViewContent role={role} />
        </div>
      </div>
    </>
  );
};

export default RoleView;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import RolesEditHeader from '@/components//Roles/RolesEditHeader';
import RolesEditContent from '@/components/Roles/RolesEditContent';
import Swal from 'sweetalert2';
import { verifyPagePermission } from '@/utils/verifyPagePermission';

/* ============================ 
   VIEW SCOPES CONFIG
============================ */
const VIEW_SCOPES = {
  clients: ['all', 'agency', 'department', 'team', 'assigned', 'own'],
  projects: ['all', 'agency', 'department', 'team', 'assigned', 'own'],
  tasks: ['all', 'agency', 'department', 'team', 'assigned', 'own', 'client'],
  teams: ['all', 'agency', 'department', 'team', 'own'],
  departments: ['all', 'agency', 'department', 'team', 'own'],
};

/* ============================ 
   PERMISSION CONFIG
============================ */
const permissionPages = [
  { key: 'dashboard', label: 'Dashboard', actions: ['view'] },
  { key: 'users', label: 'Users', actions: ['view', 'create', 'edit', 'delete'] },
  {
    key: 'clients',
    label: 'Clients',
    actions: ['view', 'create', 'edit', 'delete', 'assign'],
    viewScopes: VIEW_SCOPES.clients,
  },
  {
    key: 'projects',
    label: 'Projects',
    actions: ['view', 'create', 'edit', 'delete'],
    viewScopes: VIEW_SCOPES.projects,
  },
  {
    key: 'tasks',
    label: 'Tasks',
    actions: ['view', 'create', 'edit', 'delete', 'assign'],
    viewScopes: VIEW_SCOPES.tasks,
  },
  {
    key: 'teams',
    label: 'Teams',
    actions: ['view', 'create', 'edit', 'delete'],
    viewScopes: VIEW_SCOPES.teams,
  },
  {
    key: 'departments',
    label: 'Departments',
    actions: ['view', 'create', 'edit', 'delete'],
    viewScopes: VIEW_SCOPES.departments,
  },
  { key: 'roles', label: 'Roles', actions: ['view', 'create', 'edit', 'delete'] },
];

const RolesEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role_name: '',
    role_description: '',
    is_system_role: false,
    permissions: {},
  });

  /* ============================ 
     PAGE PERMISSION CHECK
  ============================= */
  useEffect(() => {
    verifyPagePermission('roles', 'edit', navigate);
  }, []);

  /* ============================ 
     FETCH ROLE DATA
  ============================= */
  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await fetch(`https://api-0ggv.onrender.com/api/roles/${id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch role');

        const data = await response.json();

        setFormData({
          role_name: data.data.role_name || '',
          role_description: data.data.role_description || '',
          is_system_role: data.data.is_system_role || false,
          permissions: data.data.permissions || {},
        });
      } catch (error) {
        console.error('Fetch role error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [id]);

  /* ============================ 
     HANDLE INPUT CHANGE
  ============================= */
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* ============================ 
     TOGGLE PERMISSIONS
  ============================= */
  const toggleActionPermission = (page, action) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [page]: {
          ...prev.permissions?.[page],
          [action]: !prev.permissions?.[page]?.[action],
        },
      },
    }));
  };

  const handleViewScopeChange = (page, scope) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [page]: { ...prev.permissions?.[page], view: scope },
      },
    }));
  };

  /* ============================ 
     UPDATE ROLE
  ============================= */
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`https://api-0ggv.onrender.com/api/roles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      await Swal.fire({
        icon: 'success',
        title: 'Role Updated',
        text: 'Role details updated successfully',
        confirmButtonText: 'OK',
      });

      navigate(-1);
    } catch (error) {
      console.error('Update role error', error);
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <PageHeader>
      <RolesEditHeader loading={loading} onUpdate={handleUpdate} />
    </PageHeader>
    <div className="main-content">
      <div className="row">
        <RolesEditContent
          formData={formData}
          permissionPages={permissionPages}
          onChange={handleChange}
          onToggleAction={toggleActionPermission}
          onViewScopeChange={handleViewScopeChange}
        />
      </div>
    </div>
  </>
  );
};

export default RolesEdit;

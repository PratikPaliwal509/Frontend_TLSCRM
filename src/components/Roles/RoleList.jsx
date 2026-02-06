import React, { useEffect, useState, memo } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import Footer from "@/components/shared/Footer"
import PageHeaderSetting from "@/components/shared/pageHeader/PageHeaderSetting"
import Table from "@/components/shared/table/Table"
import Dropdown from "@/components/shared/Dropdown"
import {
  FiEye,
  FiEdit3,
  FiTrash2,
  FiMoreHorizontal,
  FiShield,
} from "react-icons/fi"
import { canUser } from "@/utils/canUser"
import { verifyPagePermission } from "@/utils/verifyPagePermission"
import { useNavigate } from "react-router-dom"

/* ---------------- TYPE BADGE ---------------- */

const RoleTypeBadge = memo(({ isSystem }) =>
  isSystem ? (
    <span className="badge bg-success">System</span>
  ) : (
    <span className="badge bg-secondary">Custom</span>
  )
)

/* ---------------- MAIN COMPONENT ---------------- */

const RoleListContent = ({ title }) => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  /* ---------------- PERMISSION + FETCH ---------------- */

  useEffect(() => {
    verifyPagePermission("roles", "view", navigate)
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const res = await fetch("https://api-0ggv.onrender.com/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (data.success) setRoles(data.data || [])
    } catch (err) {
      console.error("Fetch roles failed", err)
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- DELETE ---------------- */

  const handleDeleteRole = async (role) => {
    if (!canUser("role", "delete")) {
      alert("No permission")
      return
    }

    if (!window.confirm("Delete this role?")) return

    const token = localStorage.getItem("token")

    await fetch(`https://api-0ggv.onrender.com/api/roles/${role.role_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    setRoles((prev) => prev.filter((r) => r.role_id !== role.role_id))
  }

  /* ---------------- TABLE COLUMNS ---------------- */

  const columns = [
    /* CHECKBOX */
    {
      accessorKey: "role_id",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="custom-table-checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="custom-table-checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      meta: { headerClassName: "width-30" },
    },

    /* ROLE */
    {
      accessorKey: "role_name",
      header: () => "Role",
      cell: ({ row }) => (
        <div className="hstack gap-2">
          <div className="avatar-text avatar-sm bg-primary-soft text-primary">
            <FiShield />
          </div>
          <span className="fw-semibold">
            {row.original.role_name}
          </span>
        </div>
      ),
    },

    /* DESCRIPTION */
    {
      accessorKey: "role_description",
      header: () => "Description",
      cell: (info) => (
        <span className="text-muted">
          {info.getValue() || "—"}
        </span>
      ),
    },

    /* TYPE */
    {
      accessorKey: "is_system_role",
      header: () => "Type",
      cell: (info) => (
        <RoleTypeBadge isSystem={info.getValue()} />
      ),
    },

    /* ACTIONS */
    {
      accessorKey: "actions",
      header: () => "Actions",
      cell: ({ row }) => (
        <div className="hstack gap-2 justify-content-end">
          <div
            className="avatar-text avatar-md"
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(`/settings/roles/view/${row.original.role_id}`, {
                state: { role: row.original },
              })
            }
          >
            <FiEye />
          </div>

          <Dropdown
            triggerIcon={<FiMoreHorizontal />}
            triggerClassNaclassName="avatar-md"
            triggerPosition="0,21"
            dropdownItems={[
              {
                label: "Edit",
                icon: <FiEdit3 />,
                onClick: () =>
                  navigate(`/settings/roles/edit/${row.original.role_id}`, {
                    state: { role: row.original },
                  }),
              },
              { type: "divider" },
              {
                label: "Delete",
                icon: <FiTrash2 />,
                onClick: () => handleDeleteRole(row.original),
              },
            ]}
          />
        </div>
      ),
      meta: {
        headerClassName: "text-end",
      },
    },
  ]

  /* ---------------- UI ---------------- */

  return (
    <div className="content-area">
      <PerfectScrollbar>
        <PageHeaderSetting />

        <div className="content-area-body">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="fw-bold mb-0">{title}</h4>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={fetchRoles}
              >
                Refresh
              </button>
            </div>

            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" />
                </div>
              ) : (
                <Table data={roles} columns={columns} />
              )}
            </div>
          </div>
        </div>

        <Footer />
      </PerfectScrollbar>
    </div>
  )
}

export default RoleListContent

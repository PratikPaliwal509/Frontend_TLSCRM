
import React, { memo, useEffect, useState } from 'react'
import Table from '@/components/shared/table/Table'
import {
  // FiAlertOctagon,
  // FiArchive,
  // FiClock,
  FiEdit3,
  FiEye,
  FiMoreHorizontal,
  // FiPrinter,
  // FiTrash2
} from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { useNavigate } from 'react-router-dom'
import Loader from '../loader'


/* ---------- Actions ---------- */
// const actions = [
//   { label: "Edit", icon: <FiEdit3 /> },
//   // { label: "Print", icon: <FiPrinter /> },
//   // { label: "Remind", icon: <FiClock /> },
//   // { type: "divider" },
//   // { label: "Archive", icon: <FiArchive /> },
//   // { label: "Report Spam", icon: <FiAlertOctagon /> },
//   { type: "divider" },
//   { label: "Delete", icon: <FiTrash2 /> },
// ]


/* ---------- Status Cell ---------- */
// const TableCell = memo(({ options, defaultSelect }) => {
//   const [selectedOption, setSelectedOption] = useState(defaultSelect)

//   return (
//     <SelectDropdown
//       options={options}
//       defaultSelect={defaultSelect}
//       selectedOption={selectedOption}
//       onSelectOption={setSelectedOption}
//     />
//   )
// })
const TableCell = ({ value, onChange }) => {
  return (
    <select
      value={value.status}
      onChange={(e) => onChange(e.target.value)}
      className="form-select"
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  )
}





// export default TableCell

/* ---------- Main Component ---------- */
const ClientssTable = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

const navigate = useNavigate()
  /* ---------- Fetch Clients ---------- */
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch("https://api-0ggv.onrender.com/api/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const result = await res.json()

        if (result.success) {
          const mappedData = result.data.map((client) => ({
            id: client.client_id,

            clients: {
              name: client.company_name,
              img: client.logo_url, // null handled automatically
            },

            email: client.primary_contact_email,
            phone: client.primary_contact_phone,

            date: new Date(client.created_at).toLocaleDateString(),

            status: {
              defaultSelect: client.status === "active" ? "Active" : "Inactive",
              status: client.status
            },
          }))

          setClients(mappedData)
        }
      } catch (error) {
        console.error("Failed to fetch clients", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])
  const handleStatusUpdate = async (clientId, status) => {
  try {
    const token = localStorage.getItem("token")

    const res = await fetch(
      `https://api-0ggv.onrender.com/api/clients/${clientId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    )

    if (!res.ok) throw new Error("Failed to update status")

    // ✅ Update string value
  setClients(prev =>
  prev.map(client =>
    client.id === clientId
      ? {
          ...client,
          status: {
            ...client.status,
            status: status,
          },
        }
      : client
  )
)
  } catch (error) {
    console.error("Status update error:", error)
  }
}


// const handleDeleteClient = async (clientId) => {
//   try {
//     const token = localStorage.getItem("token")

//     await fetch(`https://api-0ggv.onrender.com/api/clients/${clientId}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })


//     // Optional: update UI
//     setClients(prev => prev.filter(c => c.id !== clientId))

//   } catch (error) {
//     console.error("Delete failed", error)
//   }
// }

  /* ---------- Table Columns ---------- */
  const columns = [
    
    {
      accessorKey: 'id',
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
      meta: { headerClassName: 'width-30' },
    },
    {
      accessorKey: 'clients',
      header: () => 'Clients',
      cell: (info) => {
        const client = info.getValue()
        return (
          <div className="hstack gap-3">
            {client?.img ? (
              <div className="avatar-image avatar-md">
                <img src={client.img} alt="" />
              </div>
            ) : (
              <div className="avatar-text avatar-md">
                {client?.name?.charAt(0)}
              </div>
            )}
            <span>{client?.name}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'email',
      header: () => 'Email',
      cell: (info) => <a href={`mailto:${info.getValue()}`}>{info.getValue()}</a>
    },
    {
      accessorKey: 'phone',
      header: () => 'Phone',
      cell: (info) => <a href={`tel:${info.getValue()}`}>{info.getValue()}</a>
    },
    {
      accessorKey: 'date',
      header: () => 'Created Date',
    },
   {
  accessorKey: 'status',
  header: () => 'Status',
  cell: (info) => {
    const row = info.row.original
        return (
          <TableCell
            value={row.status}   // ✅ STRING
            onChange={(value) => handleStatusUpdate(row.id, value)}
          />
        )
      },
    },


    {
  accessorKey: 'actions',
  header: () => "Actions",
  cell: ({ row }) => {
    const clientId = row.original.id

    const rowActions = [
      {
        label: "Edit",
        icon: <FiEdit3 />,
        onClick: () => navigate(`/clients/edit/${clientId}`),
      },
      // { type: "divider" },
      // {
      //   label: "Delete",
      //   icon: <FiTrash2 />,
      //   onClick: () => {
      //     handleDeleteClient(clientId);
      //     // call delete API here
      //   },
      // },
    ]

    return (
      <div className="hstack gap-2 justify-content-end">
        <span className="avatar-text avatar-md">
          <FiEye
            onClick={() => navigate(`/clients/view/${clientId}`)}
            className="cursor-pointer"
          />
        </span>

        <Dropdown
          dropdownItems={rowActions}
          triggerClass="avatar-md"
          triggerPosition={"0,21"}
          triggerIcon={<FiMoreHorizontal />}
        />
      </div>
    )
  },
  meta: { headerClassName: 'text-end' }
}
,
  ]

  // if (loading) return <p>Loading clients...</p>
  if (loading) return <Loader/>


  return <Table data={clients} columns={columns} />
}

export default ClientssTable

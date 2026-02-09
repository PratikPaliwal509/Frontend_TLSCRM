import React, { useEffect, useState } from 'react'
import { FiEdit3, FiEye, FiMoreHorizontal } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import { useNavigate } from 'react-router-dom'
import TableSearch from '@/components/shared/table/TableSearch'
import TablePagination from '@/components/shared/table/TablePagination'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Loader from '../loader'

const TeamsTable = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  /* ---------- Fetch Teams ---------- */
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:5000/api/teams', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const result = await res.json()

        if (result.success) {
          const mappedData = result.data.map((team) => ({
            id: team.team_id,
            name: team.team_name,
            code: team.team_code || '-',
            department: team.department?.department_name || '-',
            lead: team.team_lead
              ? `${team.team_lead.first_name} ${team.team_lead.last_name}`
              : '-',
            members: team.members?.length || 0,
            createdAt: new Date(team.created_at).toLocaleDateString(),
          }))
          setTeams(mappedData)
        }
      } catch (error) {
        console.error('Failed to fetch teams', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  /* ---------- Columns ---------- */
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
      accessorKey: 'name',
      header: 'Team Name',
      cell: (info) => (
        <div className="hstack gap-3">
          <div className="avatar-text avatar-md">
            {info.getValue()?.charAt(0)}
          </div>
          <span>{info.getValue()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'code',
      header: 'Code',
    },
    {
      accessorKey: 'department',
      header: 'Department',
    },
    {
      accessorKey: 'lead',
      header: 'Team Lead',
    },
    {
      accessorKey: 'members',
      header: 'Members',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created Date',
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const teamId = row.original.id
        const rowActions = [
          {
            label: 'Edit',
            icon: <FiEdit3 />,
            onClick: () => navigate(`/teams/edit/${teamId}`),
          },
        ]
        return (
          <div className="hstack gap-2 justify-content-end">
            <span className="avatar-text avatar-md">
              <FiEye
                onClick={() => navigate(`/teams/view/${teamId}`)}
                className="cursor-pointer"
              />
            </span>
            <Dropdown
              dropdownItems={rowActions}
              triggerClass="avatar-md"
              triggerPosition={'0,21'}
              triggerIcon={<FiMoreHorizontal />}
            />
          </div>
        )
      },
      meta: { headerClassName: 'text-end' },
    },
  ]

  if (loading) return <Loader/>
  // if (loading) return <p>Loading teams...</p>

  return <Table data={teams} columns={columns} />
}

/* ---------- Table Component ---------- */
const Table = ({ data, columns }) => {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, pagination, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
  })

  return (
    <div className="col-lg-12">
      <div className="card stretch stretch-full function-table">
        <div className="card-body p-0">
          <div className="table-responsive">
            <div className="dataTables_wrapper dt-bootstrap5 no-footer">
              <TableSearch
                table={table}
                setGlobalFilter={setGlobalFilter}
                globalFilter={globalFilter}
              />
              <table className="table table-hover dataTable no-footer">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className={header.column.columnDef.meta?.headerClassName}
                          onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                          style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <FaSortUp size={13} />,
                            desc: <FaSortDown size={13} />,
                          }[header.column.getIsSorted()] || (!header.column.getIsSorted() && header.column.getCanSort() ? <FaSort size={13} /> : null)}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className={cell.column.columnDef.meta?.className}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination table={table} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamsTable

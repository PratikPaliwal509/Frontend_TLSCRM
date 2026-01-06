
import React from 'react'
import {
  FiDelete,
  FiEdit,
  FiMoreHorizontal,
  FiPlus,
  FiPrinter,
  FiTrash2,
  FiUserX,
} from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import { Link, useNavigate } from 'react-router-dom'
import topTost from '@/utils/topTost'

const ClientsViewHeader = ({ client }) => {
  const navigate = useNavigate()

  const options = [
    { icon: <FiUserX />, label: 'Mark as Lost' },
    { icon: <FiDelete />, label: 'Mark as Junk' },
    { icon: <FiTrash2 />, label: 'Delete Client' },
  ]

  const handleMakeCustomer = () => {
    topTost(`Client "${client?.company_name}" converted to customer`)
  }

  return (
    <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
      {/* Print */}
      <button className="btn btn-icon btn-light-brand">
        <FiPrinter size={16} strokeWidth={1.6} />
      </button>

      {/* Edit Client */}
      <Link
        to={`/clients/edit/${client?.client_id}`}
        className="btn btn-icon btn-light-brand"
      >
        <FiEdit size={16} strokeWidth={1.6} />
      </Link>

      {/* More Actions */}
      <Dropdown
        dropdownItems={options}
        dropdownAutoClose="outside"
        triggerPosition="0, 10"
        triggerClass="btn btn-icon btn-light-brand"
        triggerIcon={<FiMoreHorizontal size={16} />}
      />

      {/* Make as Customer */}
      <button
        className="btn btn-primary"
        onClick={handleMakeCustomer}
        disabled={client?.status === 'active'}
      >
        <FiPlus size={16} className="me-2" />
        <span>
          {client?.status === 'active'
            ? 'Already Customer'
            : 'Make as Customer'}
        </span>
      </button>
    </div>
  )
}

export default ClientsViewHeader

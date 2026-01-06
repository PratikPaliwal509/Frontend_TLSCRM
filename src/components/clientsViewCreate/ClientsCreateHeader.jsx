
import React from 'react'
import { FiLayers, FiUserPlus } from 'react-icons/fi'

const ClientsCreateHeader = ({ onCreate, onDraft, loading }) => {
    return (
        <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
            <button
                type="button"
                className="btn btn-light-brand"
                disabled={loading}
                onClick={onDraft}
            >
                <FiLayers size={16} className="me-2" />
                Save as Draft
            </button>

            <button
                type="button"
                className="btn btn-primary"
                disabled={loading}
                onClick={onCreate}
            >
                <FiUserPlus size={16} className="me-2" />
                Create Client
            </button>
        </div>
    )
}

export default ClientsCreateHeader

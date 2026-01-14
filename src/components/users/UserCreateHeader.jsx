import React from 'react'
import { FiUserPlus, FiFileText } from 'react-icons/fi'

const UsersCreateHeader = ({ loading, onCreate, onDraft }) => {
    return (
        <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 d-flex align-items-center gap-2">
                <FiUserPlus />
                Create User
            </h4>

            <div className="d-flex gap-2">
                <button
                    className="btn btn-outline-secondary"
                    onClick={onDraft}
                    disabled={loading}
                >
                    <FiFileText className="me-1" />
                    Save as Draft
                </button>

                <button
                    className="btn btn-primary"
                    onClick={onCreate}
                    disabled={loading}
                >
                    Create User
                </button>
            </div>
        </div>
    )
}

export default UsersCreateHeader

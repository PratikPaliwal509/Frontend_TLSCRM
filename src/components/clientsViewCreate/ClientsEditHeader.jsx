import React from 'react';
import { FiSave, FiEdit2 } from 'react-icons/fi';

const ClientsEditHeader = ({ onUpdate, loading }) => {
    return (
        <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
            <button
                type="button"
                className="btn btn-primary"
                disabled={loading}
                onClick={onUpdate}
            >
                <FiEdit2 size={16} className="me-2" />
                Update Client
            </button>

            <button
                type="button"
                className="btn btn-light-brand"
                disabled={loading}
                onClick={onUpdate} // optionally same as update for now
            >
                <FiSave size={16} className="me-2" />
                Save Changes
            </button>
        </div>
    );
};

export default ClientsEditHeader;

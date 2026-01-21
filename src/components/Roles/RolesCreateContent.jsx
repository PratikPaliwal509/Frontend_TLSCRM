import React from 'react'

const RolesCreateContent = ({
    formData,
    permissionPages,
    onToggleAction,
    onViewScopeChange,
    onChange,
}) => {
    return (
        <div className="card w-100">
            <div className="card-body">
                {/* ROLE NAME */}
                <div className="mb-3">
                    <label className="form-label">Role Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.role_name}
                        onChange={e =>
                            onChange(prev => ({ ...prev, role_name: e.target.value }))
                        }
                    />
                </div>

                {/* ROLE DESCRIPTION */}
                <div className="mb-4">
                    <label className="form-label">Role Description</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        value={formData.role_description}
                        onChange={e =>
                            onChange(prev => ({ ...prev, role_description: e.target.value }))
                        }
                    />
                </div>

                <hr className="my-4" />

                {/* PERMISSIONS */}
                <h5 className="fw-bold mb-3">Permissions</h5>

                {permissionPages.map(page => (
                    <div key={page.key} className="border rounded p-3 mb-4">
                        <div className="fw-semibold mb-2">{page.label}</div>

                        {/* ACTION CHECKBOXES */}
                        <div className="d-flex flex-wrap gap-4 mb-2">
                            {page.actions.map(action => {
                                if (action === 'view' && page.viewScopes) return null

                                return (
                                    <div className="form-check" key={action}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={
                                                !!formData.permissions?.[page.key]?.[action]
                                            }
                                            onChange={() => onToggleAction(page.key, action)}
                                        />
                                        <label className="form-check-label text-capitalize">
                                            {action}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>

                        {/* VIEW SCOPE */}
                        {page.viewScopes && (
                            <div className="mt-2">
                                <label className="form-label fs-12 text-muted">
                                    View Access Scope
                                </label>
                                <select
                                    className="form-select"
                                    value={formData.permissions?.[page.key]?.view || ''}
                                    onChange={e => onViewScopeChange(page.key, e.target.value)}
                                >
                                    <option value="">Select scope</option>
                                    {page.viewScopes.map(scope => (
                                        <option key={scope} value={scope}>
                                            {scope.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RolesCreateContent

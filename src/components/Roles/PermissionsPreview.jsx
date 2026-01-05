const PermissionsPreview = ({ permissions }) => {
  if (!permissions || Object.keys(permissions).length === 0) {
    return (
      <span className="text-sm text-gray-400">
        No permissions
      </span>
    )
  }

  return (
    <div className="space-y-2 max-h-40 overflow-auto">
      {Object.entries(permissions).map(([module, actions]) => (
        <div key={module}>
          <div className="text-xs font-medium text-gray-600 mb-1 capitalize">
            {module.replace('_', ' ')}
          </div>

          <div className="grid grid-cols-2 gap-1">
            {actions.map(action => (
              <label
                key={action}
                className="flex items-center gap-1 text-xs text-gray-700"
              >
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="accent-blue-600"
                />
                {action}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PermissionsPreview

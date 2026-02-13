const VIEW_SCOPES = [
  'all',
  'agency',
  'department',
  'team',
  'assigned',
  'client',
  'own',
]

export const verifyPagePermission = async (
  moduleKey,
  action,
  navigate,
  loginPath = '/authentication/login'
) => {
  try {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    /* ============================
       AUTH CHECK
    ============================ */
    if (!token || !user?.user_id || !user?.role_id || user.is_active === false) {
      localStorage.clear()
      navigate(loginPath, { replace: true })
      return false
    }

    /* ============================
       FETCH ROLE
    ============================ */
    const res = await fetch(
      `https://api-0ggv.onrender.com/api/roles/${user.role_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (!res.ok) {
      navigate(loginPath, { replace: true })
      return false
    }

    const result = await res.json()
    const permissions = result?.data?.permissions || {}

    /* ============================
       MODULE EXISTS
    ============================ */
    if (!permissions.hasOwnProperty(moduleKey)) {
      console.warn(`Permission missing for module: ${moduleKey}`)
      navigate(loginPath, { replace: true })
      return false
    }

    const modulePermissions = permissions[moduleKey]

    /* ============================
       VIEW (BOOLEAN + SCOPE)
    ============================ */
    if (action === 'view') {
      const viewValue = modulePermissions.view

      // ✅ CASE 1: boolean true
      if (viewValue === true) {
        return true
      }

      // ✅ CASE 2: scoped string
      if (typeof viewValue === 'string' && VIEW_SCOPES.includes(viewValue)) {
        return true
      }

      // ❌ NOT ALLOWED
      navigate(loginPath, { replace: true })
      return false
    }

    /* ============================
       OTHER ACTIONS
    ============================ */
    if (modulePermissions[action] === true) {
      return true
    }

    navigate(loginPath, { replace: true })
    return false
  } catch (error) {
    console.error('verifyPagePermission error:', error)
    navigate(loginPath, { replace: true })
    return false
  }
}

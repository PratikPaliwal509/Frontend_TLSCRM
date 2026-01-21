// src/utils/verifyPagePermission.js

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
       BASIC AUTH VALIDATION
    ============================ */
    if (!token || !user?.user_id || !user?.role_id) {
      localStorage.clear()
      navigate(loginPath, { replace: true })
      return false
    }

    if (user.is_active === false) {
      localStorage.clear()
      navigate(loginPath, { replace: true })
      return false
    }

    /* ============================
       FETCH ROLE
    ============================ */
    const response = await fetch(
      `http://localhost:5000/api/roles/${user.role_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (response.status === 401 || response.status === 403) {
      localStorage.clear()
      navigate(loginPath, { replace: true })
      return false
    }

    if (!response.ok) return false

    const result = await response.json()
    const permissions = result?.data?.permissions || {}

    /* ============================
       SUPER ADMIN OVERRIDE (OPTIONAL)
       You can remove this if not needed
    ============================ */
    if (result?.data?.is_system_role === true) {
      return true
    }

    const modulePermissions = permissions?.[moduleKey]

    if (!modulePermissions) {
      navigate(loginPath, { replace: true })
      return false
    }

    /* ============================
       VIEW PERMISSION (SCOPE BASED)
    ============================ */
    if (action === 'view') {
      // view must exist and be a valid scope string
      if (typeof modulePermissions.view === 'string' && modulePermissions.view.length > 0) {
        return true
      }

      navigate(loginPath, { replace: true })
      return false
    }

    /* ============================
       OTHER ACTIONS (BOOLEAN)
    ============================ */
    if (modulePermissions?.[action] === true) {
      return true
    }

    /* ============================
       NOT ALLOWED
    ============================ */
    navigate(loginPath, { replace: true })
    return false
  } catch (error) {
    console.error('verifyPagePermission error:', error)
    localStorage.clear()
    navigate(loginPath, { replace: true })
    return false
  }
}

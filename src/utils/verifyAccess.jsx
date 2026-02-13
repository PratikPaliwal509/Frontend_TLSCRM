import { act } from "react"

export const verifyAccess = async (
  moduleKey,
  action,
  expectedValue, // 👈 NEW (scope string OR boolean)
) => {
  try {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    /* ============================
       BASIC AUTH VALIDATION
    ============================ */
    if (!token || !user?.user_id || !user?.role_id || user?.is_active === false) {
      localStorage.clear()
      navigate(loginPath, { replace: true })
      return false
    }

    /* ============================
       FETCH ROLE DATA
    ============================ */
    const response = await fetch(
      `https://api-0ggv.onrender.com/api/roles/${user.role_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (!response.ok) {
      localStorage.clear()
      navigate(loginPath, { replace: true })
      return false
    }

    const result = await response.json()
    const role = result?.data
    const permissions = role?.permissions || {}
    /* ============================
       SUPER ADMIN OVERRIDE
    ============================ */
    // if (role?.is_system_role === true) {
    //   return true
    // }
const modulePermissions = permissions?.[moduleKey]

    if (!modulePermissions) {
      navigate(loginPath, { replace: true })
      return false
    }

    /* ============================
       VIEW (SCOPE BASED)
    ============================ */
    if (action === 'view') {
      const viewScope = modulePermissions.view

      // expectedValue is scope string (e.g. 'client', 'team', 'all')
      if (
        typeof expectedValue === 'string' &&
        viewScope === expectedValue
      ) {
        return true
      }
      return false
    }

    /* ============================
       OTHER ACTIONS (BOOLEAN)
    ============================ */
    if (
      typeof expectedValue === 'boolean' &&
      modulePermissions?.[action] === expectedValue
    ) {
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

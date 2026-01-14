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

    // ❌ Basic auth validation
    if (!token || !user?.user_id || !user?.role_id) {
      localStorage.clear()
      navigate(loginPath, { replace: true })
      return false
    }

    // ❌ Inactive user
    if (user.is_active === false) {
      localStorage.clear()
      navigate(loginPath, { replace: true })
      return false
    }

    // 🔹 Fetch role permissions
    const response = await fetch(
      `http://localhost:5000/api/roles/${user.role_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    // ❌ Token invalid or forbidden
    if (response.status === 401 || response.status === 403) {
      localStorage.clear()
      navigate(loginPath, { replace: true })
      return false
    }

    if (!response.ok) return false

    const result = await response.json()
    const permissions = result?.data?.permissions || {}

    // ❌ Permission not allowed
    if (!permissions?.[moduleKey]?.includes(action)) {
      localStorage.clear()
      navigate(loginPath, { replace: true })
      return false
    }

    // ✅ Page access allowed
    return true
  } catch (error) {
    console.error('verifyPagePermission error:', error)
    localStorage.clear()
    navigate(loginPath, { replace: true })
    return false
  }
}

export const canUser = async (moduleKey, action) => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // ❌ Not authenticated
    if (!token || !user?.user_id || !user?.role_id) return false;

    // ❌ Inactive user
    if (user.is_active === false) return false;

    // 🔹 Fetch role using role_id
    const response = await fetch(
      `http://localhost:5000/api/roles/${user.role_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) return false;

    const result = await response.json();
    const permissions = result?.data?.permissions || {};

    // ❌ Module not found
    if (!permissions[moduleKey]) return false;

    // 🔹 Action check
    const modulePermissions = permissions[moduleKey];

    // Some actions might be boolean (true/false) or "all"
    if (modulePermissions[action] === true || modulePermissions[action] === 'all') {
      return true;
    }

    return false;
  } catch (error) {
    console.error('canUser error:', error);
    return false;
  }
};

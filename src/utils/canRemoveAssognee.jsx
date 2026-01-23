import { useEffect, useState, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'

const useVerifyRole = () => {
    const [currentUser, setCurrentUser] = useState(null)
    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!token) return

            let decoded
            try {
                // ✅ NO "Bearer"
                decoded = jwtDecode(token)
            } catch (err) {
                console.error('Invalid token')
                return
            }

            if (!decoded?.user_id) return

            try {
                const res = await fetch(
                    `http://localhost:5000/api/users/${decoded.user_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (!res.ok) throw new Error('Failed to fetch user')

                const data = await res.json()
                setCurrentUser(data?.data || data)
            } catch (err) {
                console.error('Failed to fetch current user', err)
            }
        }

        fetchCurrentUser()
    }, [token])

    /**
     * RULES:
     * - Admin / Super Admin / Project Manager → YES
     * - Task creator → YES
     * - Assignee creator → YES
     */
    const canRemoveAssignee = useCallback(
        ({ taskCreatedBy, assignedBy }) => {
            if (!currentUser) return false

            const role =
                currentUser.role_name ||
                currentUser?.role?.role_name

            if (
                ['Admin', 'Super Admin', 'Project Manager'].includes(role)
            ) {
                return true
            }

            if (currentUser.user_id === taskCreatedBy) return true
            if (currentUser.user_id === assignedBy) return true

            return false
        },
        [currentUser]
    )

   /* ---------------- ATTACHMENT REMOVE ---------------- */
  const canRemoveAttachment = useCallback(
    ({ taskCreatedBy, attachmentCreatedBy }) => {
      if (!currentUser) return false

      const role =
        currentUser.role_name || currentUser?.role?.role_name

      if (
        ['Admin', 'Super Admin', 'Project Manager'].includes(role)
      ) {
        return true
      }

      // task owner
      if (currentUser.user_id === taskCreatedBy) return true

      // attachment uploader
      if (currentUser.user_id === attachmentCreatedBy) return true

      return false
    },
    [currentUser]
  )

  return {
    currentUser,
    canRemoveAssignee,
    canRemoveAttachment,
  }

}



export default useVerifyRole

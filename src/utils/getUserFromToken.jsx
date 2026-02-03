const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma') // adjust path if needed

const getUserFromToken = async (token) => {
  if (!token) return null

  try {
    // Remove "Bearer "
    const rawToken = token.startsWith('Bearer ')
      ? token.split(' ')[1]
      : token

    // Decode & verify token
    const decoded = jwt.verify(rawToken, process.env.JWT_SECRET)

    if (!decoded?.user_id) return null

    // Fetch user with role
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.user_id },
      include: {
        role: true,
        department: true,
        team: true,
        portal_clients: {
          select: {
            client_id: true,
            company_name: true,
          },
        },
      },
    })

    return user
  } catch (err) {
    console.error('Invalid token:', err.message)
    return null
  }
}

module.exports = getUserFromToken

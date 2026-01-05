import React, { useEffect, useState } from 'react'
import { FiFacebook, FiGithub, FiTwitter } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../loader'
const LoginForm = ({ registerPath, resetPath }) => {
    const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
const navigate = useNavigate() 
const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  setSuccess('')

  try {
    const response = await fetch(`http://localhost:5000/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.message || 'Login failed')
      return
    }

    const { token, user } = data.data

    // 🔐 Remove sensitive fields before storing
    const safeUser = {
      user_id: user.user_id,
      agency_id: user.agency_id,
      role_id: user.role_id,
      department_id: user.department_id,
      team_id: user.team_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.full_name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      job_title: user.job_title,
      timezone: user.timezone,
      language: user.language,
      is_active: user.is_active,
      is_verified: user.is_verified,
      notification_preferences: user.notification_preferences,

      // 👇 permissions should come from backend (role based)
      permissions: user.permissions || {}
    }

    // ✅ Store in localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(safeUser))

    setSuccess('Login successful!')
    console.log('Logged in user:', safeUser)

    navigate('/')
  } catch (err) {
    setError('Something went wrong. Please try again.')
    console.error(err)
  } finally {
    setLoading(false)
  }
}


    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Login</h2>
            <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>
            <p className="fs-12 fw-medium text-muted">Thank you for get back <strong>Nelel</strong> web applications, let's access our the best recommendation for you.</p>
            <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input type="email"   value={email}  onChange={(e) => setEmail(e.target.value)}  className="form-control" placeholder="Email or Username" required />
                    
                </div>
                <div className="mb-3">
                    <input type="password" value={password}  onChange={(e) => setPassword(e.target.value)}  className="form-control" placeholder="Password" required />
                     
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="rememberMe" />
                            <label className="custom-control-label c-pointer" htmlFor="rememberMe">Remember Me</label>
                        </div>
                    </div>
                    <div>
                        <Link to={resetPath} className="fs-11 text-primary">Forget password?</Link>
                    </div>
                </div>
                <div className="mt-5">
                    <button type="submit" className="btn btn-lg btn-primary w-100">Login</button>
                </div>
            </form>
            <div className="w-100 mt-5 text-center mx-auto">
                <div className="mb-4 border-bottom position-relative"><span className="small py-1 px-3 text-uppercase text-muted bg-white position-absolute translate-middle">or</span></div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                    <a href="#" className="btn btn-light-brand flex-fill" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Login with Facebook">
                        <FiFacebook size={16} />
                    </a>
                    <a href="#" className="btn btn-light-brand flex-fill" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Login with Twitter">
                        <FiTwitter size={16} />
                    </a>
                    <a href="#" className="btn btn-light-brand flex-fill" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Login with Github">
                        <FiGithub size={16} className='text' />
                    </a>
                </div>
            </div>
            <div className="mt-5 text-muted">
                <span> Don't have an account?</span>
                <Link to={registerPath} className="fw-bold"> Create an Account</Link>
            </div>
        </>
    )
}

export default LoginForm
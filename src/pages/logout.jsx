import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // clear auth
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");

    // redirect after 2 sec (optional)
    setTimeout(() => {
      navigate("/authentication/login");
    }, 2000);
  }, [navigate]);

  return (
    <main className="auth-cover-wrapper">
      <div className="auth-cover-content-inner">
        <div className="auth-cover-content-wrapper">
          <div className="auth-img">
            <img
              src="/images/auth/auth-cover-login-bg.svg"
              alt="img"
              className="img-fluid"
            />
          </div>
        </div>
      </div>

      <div className="auth-cover-sidebar-inner">
        <div className="auth-cover-card-wrapper">
          <div className="auth-cover-card p-sm-5 text-center">
            
            <div className="wd-50 mb-5">
              <img
                src="/images/logo/techlal.png"
                alt="logo"
                className="img-fluid"
              />
            </div>

            <h3 className="mb-3">You have been logged out</h3>
            <p className="text-muted mb-4">
              Thank you for using CRM. Redirecting to login...
            </p>

            <button
              className="btn btn-primary w-100"
              onClick={() => navigate("/authentication/login")}
            >
              Go to Login
            </button>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Logout;
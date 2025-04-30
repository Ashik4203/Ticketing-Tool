import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { apiService } from "../../services/apiService";
import "../../style/login/login-right.css";

// SweetAlert2 setup
const MySwal = withReactContent(Swal);

function LoginRight() {
  const [userName, setuserName] = useState("");
  const [password, setPasswordHash] = useState("");
  const [userNameError, setuserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const validateuserName = (userName) =>
    String(userName)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "true";
    const savedUserName = localStorage.getItem("rememberedUserName");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (remembered) {
      setuserName(savedUserName || "");
      setPasswordHash(savedPassword || "");
      setRemember(true);
    }
  }, []);

  const validateInputs = () => {
    let isValid = true;

    if (!userName.trim()) {
      setuserNameError("Username is required");
      isValid = false;
    } else if (!validateuserName(userName)) {
      setuserNameError("Please enter a valid email");
      isValid = false;
    } else {
      setuserNameError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    try {
      const response = await apiService.post("/api/auth/login", {
        userName,
        password,
      });

      if (response?.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("name", response.user.name);
        localStorage.setItem("role_id", response.user.role);

        if (remember) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("rememberedUserName", userName);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("rememberedUserName");
          localStorage.removeItem("rememberedPassword");
        }

        // Fetch RBAC
        const rbacRes = await apiService.get("/api/auth/rbac");
        if (rbacRes.permissions) {
          localStorage.setItem(
            "permissions",
            JSON.stringify(rbacRes.permissions)
          );
        }

        // Success alert
        MySwal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          html: `
            <div class="custom-toast-icon tick-icon"></div>
            <div class="custom-toast-title">Login Successful!</div>
            <div class="custom-toast-message">Redirecting to Dashboard...</div>
          `,
          customClass: {
            popup: "custom-toast success-toast",
          },
          showConfirmButton: false,
          timer: 500,
          timerProgressBar: true,
          didClose: () => {
            navigate("/dashboard", { replace: true });
          },
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.status === 401
          ? "Invalid username or password"
          : "Something went wrong. Please try again.";

      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        html: `
          <div class="custom-toast-icon error-icon"></div>
          <div class="custom-toast-title">Login Failed!</div>
          <div class="custom-toast-message">${errorMsg}</div>
        `,
        customClass: {
          popup: "custom-toast error-toast",
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <div className="login-title">Login to access your account</div>
        </div>
        <form className="form-content" onSubmit={handleSubmit}>
          <div className="input-field">
            <div className="input-wrapper">
              <input
                type="text"
                className="input-text"
                placeholder="Email Address"
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
              />
              {userNameError && <div className="error">{userNameError}</div>}
            </div>
          </div>

          <div className="input-field">
            <div className="input-wrapper">
              <input
                type="password"
                className="input-text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPasswordHash(e.target.value)}
              />
              {passwordError && <div className="error">{passwordError}</div>}
            </div>
          </div>

          {/* <div className="options-container">
            <div className="CheckRem">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember">Remember Password</label>
            </div>
          </div> */}

          <div className="login-btn-container">
            <button type="submit" className="login-btn">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginRight;

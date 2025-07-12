import { loginUser, registerUser } from "../apiHandler/authAPIHandler";
import { jwtDecode } from "jwt-decode";

// Helper function to process normal login response
const processLoginResponse = (response, loginContext) => {
  const token = response.token;

  if (!token) {
    throw new Error("Invalid login response: Missing access token");
  }

  const decodedToken = jwtDecode(token);
  const roleClaim =
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  const userId =
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
  const userData = {
    email: decodedToken.email,
    fullName: decodedToken.FullName,
    role: decodedToken[roleClaim] || "Unknown",
    id: decodedToken[userId],
  };

  loginContext(userData, token);

  return {
    user: userData,
    token: token,
  };
};

const handleAuthError = (error, defaultMessage) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 400) {
      throw new Error(data.message || "Invalid data provided");
    } else if (status === 401) {
      throw new Error("Unauthorized: Invalid credentials");
    }
    throw new Error(data.message || defaultMessage);
  }
  throw new Error(error.message || "Network error");
};

export const login = async (email, password, loginContext) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const response = await loginUser(email, password);
    return processLoginResponse(response, loginContext);
  } catch (error) {
    return handleAuthError(error, "Login failed");
  }
};

export const register = async (userData) => {
  const requiredFields = ["email", "fullName", "password", "role"];
  const missingFields = requiredFields.filter((field) => !userData[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  try {
    const response = await registerUser(userData);
    // Chỉ cần response có message là thành công
    return {
      success: true,
      message: response.message || "Registration successful",
    };
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        throw new Error(data.message || "Invalid data provided");
      } else if (status === 409) {
        throw new Error(data.message || "Email already exists");
      } else if (status === 401) {
        throw new Error("Unauthorized: Admin access required");
      }
      throw new Error(data.message || "Registration failed");
    }
    throw new Error(error.message || "Network error");
  }
};

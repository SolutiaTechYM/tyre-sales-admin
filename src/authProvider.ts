import { AuthProvider } from "@refinedev/core";
import { notification } from "antd";
import bcrypt from "bcryptjs";
import axios from "axios";
import { enableAutoLogin } from "./hooks";
import { customAxiosInstance } from "./utils/custom-axios";
import { API_URL } from "./utils";

export const TOKEN_KEY = "token";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await customAxiosInstance.post(`${API_URL}/auth/login`, { email, password });
     
      if (!response.headers.authorization) {
        throw new Error('Invalid email or password');
      }

      localStorage.setItem(TOKEN_KEY, response.headers.authorization);

      return {
        success: true,
        redirectTo: "/"
      };
    } catch (error) {
      console.log(error);
      
      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid email or password"
        }
      };
    }
  },
  register: async ({ email, password }) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await axios.post(`http://localhost:3000/api/register`, { email, password: hashedPassword });

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Register failed"
        }
      };
    }
  },
  updatePassword: async () => {
    try {
      await axios.post(`http://localhost:3000/api/updatePassword`, null, {
        headers: {
          'Authorization': `${localStorage.getItem(TOKEN_KEY)}`
        }
      });

      notification.success({
        message: "Updated Password",
        description: "Password updated successfully"
      });

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Update password failed",
          name: "Update password failed"
        }
      };
    }
  },
  forgotPassword: async ({ email }) => {
    try {
      await axios.post(`http://localhost:3000/api/forgotPassword`, { email });

      notification.success({
        message: "Reset Password",
        description: `Reset password link sent to "${email}"`
      });

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Reset password failed",
          name: "Reset password failed"
        }
      };
    }
  },
  logout: async () => {
    try {
      await axios.post(`http://localhost:3000/api/logout`, null, {
        headers: {
          'Authorization': `${localStorage.getItem(TOKEN_KEY)}`
        }
      });

      localStorage.removeItem(TOKEN_KEY);

      return {
        success: true,
        redirectTo: "/login"
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Logout failed",
          name: "Logout failed"
        }
      };
    }
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true
      };
    }

    return { error };
  },
  check: async () => {
    // try {
    //   console.log("yyyyyyyyyyyyyyyyy");
      
    //   const response = await axios.post(`http://localhost:3000/api/check`, null, {
    //     headers: {
    //       'Authorization': `${localStorage.getItem(TOKEN_KEY)}`
    //     }
    //   });

    //   console.log("xxxxxxxxxxxxxxx");
      
    //   console.log(response);
      
    //   if (!response.data.authenticated) {
    //     throw new Error('Check failed');
    //   }

    //   return {
    //     authenticated: true
    //   };
    // } catch (error) {
    //   localStorage.removeItem(TOKEN_KEY);

    //   return {
    //     authenticated: false,
    //     error: {
    //       message: "Check failed",
    //       name: "Check failed"
    //     },
    //     redirectTo: "/login"
    //   };
    // }
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      error: {
        message: "Check failed",
        name: "Token not found",
      },
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/identity`, {
        headers: {
          'Authorization': `${localStorage.getItem(TOKEN_KEY)}`
        }
      });

      if (!response.data) {
        throw new Error('Failed to fetch identity');
      }

      return {
        id: response.data.id,
        name: response.data.name,
        avatar: response.data.avatar
      };
    } catch (error) {
      return null;
    }
  }
};

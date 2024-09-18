import { AuthProvider } from "@refinedev/core";
import axios from "axios";
import { encode } from "base-64";

const API_URL=import.meta.env.VITE_APP_API_URL

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const encodedCredentials = encode(`${email}:${password}`);
      const response = await axios.post(`${API_URL}/auth/login`, {cred:encodedCredentials});

      if (!response.data.success) {
        throw new Error('Invalid email or password');
      }

      const token = response.headers.authorization;
      localStorage.setItem('token', token);

      return {
        success: true,
        redirectTo: "/"
      };
    }
    catch (error) {
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
  // register: async ({ email, password }) => {
  //   return {
  //     success: false,
  //     error: {
  //       message: "Register failed",
  //       name: "Register failed"
  //     }
  //   };
  // },
  // updatePassword: async () => {
  //   return {
  //     success: false,
  //     error: {
  //       message: "Update password failed",
  //       name: "Update password failed"
  //     }
  //   };
  // },
  // forgotPassword: async ({ email }) => {
  //   return {
  //     success: false,
  //     error: {
  //       message: "Reset password failed",
  //       name: "Reset password failed"
  //     }
  //   };
  // },
  logout: async () => {
    localStorage.removeItem('token');
    return {
      success: true,
      redirectTo: "/login"
    };
  },
  onError: async (error) => {
    console.log('error')
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      return {
        logout: true
      };
    }

    return { error };
  },
  check: async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/check`, null, {
        headers: {
          Authorization: localStorage.getItem('token') || ''
        }
      });
      console.log(response.data);

      if (!response.data.success) {
        throw new Error('Check failed');
      }

      return {
        authenticated: true
      };
    }
    catch (error) {
      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Check failed"
        },
        redirectTo: "/login"
      };
    }
  },
};

import Cookies from "js-cookie";

const TOKEN_COOKIE_KEY = "auth_token";
const USER_COOKIE_KEY = "user_data";

const COOKIE_OPTIONS = {
  secure: true,
  sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
  expires: 7,
  path: "/",
  domain:
    process.env.NODE_ENV === "production" ? "osakana-calendar.com" : undefined,
};

const debug = process.env.NODE_ENV !== "production";
const log = debug ? console.log : () => {};

export const tokenManager = {
  setToken(token) {
    if (!token) return;

    try {
      log("Setting token:", token);
      if (process.env.NODE_ENV === "production") {
        Cookies.set(TOKEN_COOKIE_KEY, token, COOKIE_OPTIONS);
      } else {
        localStorage.setItem(TOKEN_COOKIE_KEY, token);
      }
      log("Token saved successfully");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  },

  setUser(user) {
    if (!user) return;

    try {
      log("Setting user:", user);
      if (process.env.NODE_ENV === "production") {
        Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), COOKIE_OPTIONS);
      } else {
        localStorage.setItem(USER_COOKIE_KEY, JSON.stringify(user));
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  },

  getToken() {
    try {
      const token =
        process.env.NODE_ENV === "production"
          ? Cookies.get(TOKEN_COOKIE_KEY)
          : localStorage.getItem(TOKEN_COOKIE_KEY);
      log("Getting token:", token);
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  getUser() {
    try {
      const userData =
        process.env.NODE_ENV === "production"
          ? Cookies.get(USER_COOKIE_KEY)
          : localStorage.getItem(USER_COOKIE_KEY);
      log("Getting user data:", userData);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  clearAll() {
    try {
      if (process.env.NODE_ENV === "production") {
        Cookies.remove(TOKEN_COOKIE_KEY, { ...COOKIE_OPTIONS, path: "/" });
        Cookies.remove(USER_COOKIE_KEY, { ...COOKIE_OPTIONS, path: "/" });
      } else {
        localStorage.removeItem(TOKEN_COOKIE_KEY);
        localStorage.removeItem(USER_COOKIE_KEY);
      }
      if (window.activeRequests) {
        window.activeRequests.forEach((controller) => controller.abort());
        window.activeRequests = [];
      }
      log("All tokens and user data cleared");
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  },

  getAuthHeader() {
    const token = this.getToken();
    const header = token ? `Bearer ${token}` : null;
    log("Auth header:", header);
    return header;
  },

  isAuthenticated() {
    const hasToken = !!this.getToken();
    const hasUser = !!this.getUser();
    log("Auth check:", { hasToken, hasUser });
    return hasToken && hasUser;
  },
};

export default tokenManager;

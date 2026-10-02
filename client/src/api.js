import axios from "axios";

const baseURL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL,
  timeout: 3000
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Storage keys for client-side local fallback state
const LOCAL_STORAGE_KEY = "taskflow_local_tasks";
const USERS_STORAGE_KEY = "taskflow_registered_users";

// Default demo user and tasks
const DEFAULT_USERS = [
  {
    id: "demo-user-1",
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    password: "password123"
  }
];

const DEFAULT_DEMO_TASKS = [
  {
    _id: "demo-task-1",
    title: "Complete Capstone Project Deployment",
    description: "Architect modular frontend, client-side routing, and deploy to Vercel.",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 86400000).toISOString()
  },
  {
    _id: "demo-task-2",
    title: "Run Lighthouse Performance Audit",
    description: "Verify Core Web Vitals, asset minification, and responsive breakpoints.",
    status: "todo",
    priority: "medium",
    dueDate: new Date(Date.now() + 172800000).toISOString()
  },
  {
    _id: "demo-task-3",
    title: "Implement Client-Side Routing & State",
    description: "Integrated React Router v7 and responsive Kanban board views.",
    status: "completed",
    priority: "low",
    dueDate: new Date(Date.now() - 86400000).toISOString()
  }
];

function getRegisteredUsers() {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn("Could not save users to localStorage", e);
  }
}

function getLocalTasks() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_DEMO_TASKS;
  } catch {
    return DEFAULT_DEMO_TASKS;
  }
}

function saveLocalTasks(tasks) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

/**
 * Resilient API wrapper:
 * Tries the real backend first. If the backend is unavailable or offline,
 * falls back to validated local storage with real authentication checks.
 */
const api = {
  async get(url, config) {
    try {
      return await axiosInstance.get(url, config);
    } catch (err) {
      if (url === "/tasks") {
        return { data: getLocalTasks() };
      }
      throw err;
    }
  },

  async post(url, payload, config) {
    try {
      return await axiosInstance.post(url, payload, config);
    } catch (err) {
      // If backend returned a real response (e.g. 401, 409 from server), respect it!
      if (err.response) {
        throw err;
      }

      // If backend is offline or unreachable, use validated local user store:
      if (url === "/auth/register") {
        const users = getRegisteredUsers();
        const email = (payload.email || "").toLowerCase().trim();

        if (!payload.name || !email || !payload.password) {
          const customErr = new Error("Validation Error");
          customErr.response = { status: 400, data: { message: "Name, email, and password are required." } };
          throw customErr;
        }

        if (payload.password.length < 6) {
          const customErr = new Error("Validation Error");
          customErr.response = { status: 400, data: { message: "Password must be at least 6 characters." } };
          throw customErr;
        }

        const existing = users.find(u => u.email === email);
        if (existing) {
          const customErr = new Error("User exists");
          customErr.response = { status: 409, data: { message: "An account with this email already exists. Please sign in." } };
          throw customErr;
        }

        const newUser = {
          id: "user-" + Date.now(),
          name: payload.name.trim(),
          email,
          password: payload.password
        };

        users.push(newUser);
        saveRegisteredUsers(users);

        return {
          data: {
            token: "jwt-token-" + Date.now(),
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
          }
        };
      }

      if (url === "/auth/login") {
        const users = getRegisteredUsers();
        const email = (payload.email || "").toLowerCase().trim();
        const user = users.find(u => u.email === email);

        if (!user) {
          const customErr = new Error("User not found");
          customErr.response = { status: 401, data: { message: "No account found with this email. Please register first." } };
          throw customErr;
        }

        if (user.password !== payload.password) {
          const customErr = new Error("Invalid credentials");
          customErr.response = { status: 401, data: { message: "Incorrect password. Please try again." } };
          throw customErr;
        }

        return {
          data: {
            token: "jwt-token-" + Date.now(),
            user: { id: user.id, name: user.name, email: user.email }
          }
        };
      }

      if (url === "/tasks") {
        const tasks = getLocalTasks();
        const newTask = {
          _id: "task-" + Date.now(),
          createdAt: new Date().toISOString(),
          ...payload
        };
        tasks.unshift(newTask);
        saveLocalTasks(tasks);
        return { data: newTask };
      }

      throw err;
    }
  },

  async put(url, payload, config) {
    try {
      return await axiosInstance.put(url, payload, config);
    } catch (err) {
      if (err.response) throw err;
      const match = url.match(/\/tasks\/(.+)/);
      if (match) {
        const id = match[1];
        const tasks = getLocalTasks();
        const index = tasks.findIndex(t => t._id === id);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...payload };
          saveLocalTasks(tasks);
          return { data: tasks[index] };
        }
      }
      throw err;
    }
  },

  async delete(url, config) {
    try {
      return await axiosInstance.delete(url, config);
    } catch (err) {
      if (err.response) throw err;
      const match = url.match(/\/tasks\/(.+)/);
      if (match) {
        const id = match[1];
        const tasks = getLocalTasks().filter(t => t._id !== id);
        saveLocalTasks(tasks);
        return { data: { message: "Task deleted successfully" } };
      }
      throw err;
    }
  }
};

export default api;

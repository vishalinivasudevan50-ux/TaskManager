import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import api from "../api";

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "kanban"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/tasks");
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
      } else {
        setError("Could not load tasks from server.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const saveTask = async (form) => {
    try {
      setError("");
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask._id}`, form);
        setTasks(tasks.map(t => (t._id === data._id ? data : t)));
        setEditingTask(null);
      } else {
        const { data } = await api.post("/tasks", form);
        setTasks([data, ...tasks]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not save task.");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      if (editingTask?._id === id) {
        setEditingTask(null);
      }
    } catch {
      setError("Could not delete task.");
    }
  };

  const changeStatus = async (task, status) => {
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { status });
      setTasks(tasks.map(t => (t._id === data._id ? data : t)));
    } catch {
      setError("Could not update task status.");
    }
  };

  // Filter tasks based on status, priority, and search
  const filteredTasks = useMemo(() => {
    const term = search.toLowerCase().trim();
    return tasks.filter(task => {
      const matchesStatus = filterStatus === "all" || task.status === filterStatus;
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
      const matchesSearch =
        !term ||
        `${task.title || ""} ${task.description || ""}`.toLowerCase().includes(term);
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, filterStatus, filterPriority, search]);

  // Derived statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;
    const todo = tasks.filter(t => t.status === "todo").length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, todo, rate };
  }, [tasks]);

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={onLogout} />

      <main className="dashboard">
        {/* HERO SECTION */}
        <section className="dashboard-hero">
          <div className="hero-text">
            <h1>Welcome back, <span>{user?.name || "Productivity Pro"}</span> 👋</h1>
            <p className="hero-subtitle">Organize your sprints, track task statuses, and hit your milestones.</p>
          </div>
        </section>

        {/* LIVE STATS ROW */}
        <section className="stats-row">
          <div className="stat-card">
            <div className="stat-icon total">📋</div>
            <div className="stat-info">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon todo">⏳</div>
            <div className="stat-info">
              <span className="stat-number">{stats.todo}</span>
              <span className="stat-label">To Do</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon progress">⚡</div>
            <div className="stat-info">
              <span className="stat-number">{stats.inProgress}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">🎯</div>
            <div className="stat-info">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <span>Overall Completion Rate</span>
              <span>{stats.rate}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${stats.rate}%` }}></div>
            </div>
          </div>
        </section>

        {error && <div className="error-banner">{error}</div>}

        {/* WORKSPACE & TASKS CONTAINER */}
        <section className="workspace-grid">
          {/* TASK FORM (Sticky on desktop) */}
          <TaskForm
            editingTask={editingTask}
            onSave={saveTask}
            onCancel={() => setEditingTask(null)}
          />

          {/* MAIN TASKS PANEL */}
          <div className="tasks-panel">
            <div className="panel-toolbar">
              <div className="toolbar-top">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by title or keyword..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="view-toggle">
                  <button
                    type="button"
                    className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    ▦ Grid View
                  </button>
                  <button
                    type="button"
                    className={`view-btn ${viewMode === "kanban" ? "active" : ""}`}
                    onClick={() => setViewMode("kanban")}
                  >
                    ☷ Kanban Board
                  </button>
                </div>
              </div>

              <div className="toolbar-filters">
                <div className="status-pills">
                  {[
                    ["all", "All", stats.total],
                    ["todo", "To Do", stats.todo],
                    ["in-progress", "In Progress", stats.inProgress],
                    ["completed", "Completed", stats.completed]
                  ].map(([val, label, count]) => (
                    <button
                      key={val}
                      type="button"
                      className={`pill-btn ${filterStatus === val ? "active" : ""}`}
                      onClick={() => setFilterStatus(val)}
                    >
                      {label}
                      <span className="pill-count">{count}</span>
                    </button>
                  ))}
                </div>

                <select
                  className="select-field"
                  style={{ width: "auto", padding: "6px 12px", fontSize: "0.82rem" }}
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  aria-label="Filter by priority"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            {/* CONTENT AREA */}
            {loading ? (
              <div className="empty-state">
                <div className="empty-icon">⏳</div>
                <h3>Loading your workspace...</h3>
                <p>Retrieving tasks from the cloud.</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🌱</div>
                <h3>No tasks match your filter</h3>
                <p>Try modifying your search query or create a new task.</p>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="task-grid-view">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={deleteTask}
                    onStatusChange={changeStatus}
                  />
                ))}
              </div>
            ) : (
              /* KANBAN BOARD VIEW */
              <div className="kanban-view">
                {[
                  { key: "todo", title: "To Do", emoji: "⏳", color: "var(--color-todo)" },
                  { key: "in-progress", title: "In Progress", emoji: "⚡", color: "var(--color-progress)" },
                  { key: "completed", title: "Completed", emoji: "🎯", color: "var(--color-completed)" }
                ].map(col => {
                  const colTasks = filteredTasks.filter(t => t.status === col.key);
                  return (
                    <div key={col.key} className="kanban-column">
                      <div className="kanban-column-header">
                        <span className="column-title" style={{ color: col.color }}>
                          {col.emoji} {col.title}
                        </span>
                        <span className="column-count">{colTasks.length}</span>
                      </div>
                      <div className="kanban-cards-container">
                        {colTasks.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "24px 8px", color: "var(--text-dim)", fontSize: "0.85rem" }}>
                            No tasks here
                          </div>
                        ) : (
                          colTasks.map(task => (
                            <TaskCard
                              key={task._id}
                              task={task}
                              onEdit={setEditingTask}
                              onDelete={deleteTask}
                              onStatusChange={changeStatus}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

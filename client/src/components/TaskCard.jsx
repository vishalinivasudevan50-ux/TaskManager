export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const isCompleted = task.status === "completed";

  // Format Due Date and detect overdue
  let dueText = "No due date";
  let isOverdue = false;

  if (task.dueDate) {
    const due = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueText = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (due < today && !isCompleted) {
      isOverdue = true;
    }
  }

  const priorityLabels = {
    high: "High",
    medium: "Medium",
    low: "Low"
  };

  const statusLabels = {
    todo: "To Do",
    "in-progress": "In Progress",
    completed: "Completed"
  };

  return (
    <article className={`task-card ${isCompleted ? "completed-task" : ""}`}>
      <div className="task-card-header">
        <div className="badges-group">
          <span className={`badge ${task.priority || "medium"}`}>
            ● {priorityLabels[task.priority] || "Medium"}
          </span>
          <span className={`badge ${task.status}`}>
            {statusLabels[task.status] || "To Do"}
          </span>
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-sm btn-danger"
          title="Delete task"
          onClick={() => onDelete(task._id)}
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>

      <div>
        <h3 className="task-card-title">{task.title}</h3>
        {task.description && <p className="task-card-desc">{task.description}</p>}
      </div>

      <div className="task-card-meta">
        <span className={`due-chip ${isOverdue ? "overdue" : ""}`}>
          📅 {isOverdue ? `Overdue (${dueText})` : dueText}
        </span>

        <div className="task-card-actions">
          <select
            className="status-dropdown"
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value)}
            aria-label="Change status"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}

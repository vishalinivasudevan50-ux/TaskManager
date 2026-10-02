import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: ""
};

export default function TaskForm({ editingTask, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "todo",
        priority: editingTask.priority || "medium",
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : ""
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
    if (!editingTask) {
      setForm(emptyForm);
    }
  };

  return (
    <form className="task-form-card" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <h2>{editingTask ? "✏️ Edit Task" : "✨ Create New Task"}</h2>
          <p>{editingTask ? "Update existing task properties." : "Organize your workflow and set goals."}</p>
        </div>
        {editingTask && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="taskTitle">Task Title *</label>
        <input
          id="taskTitle"
          className="input-field"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Deploy React Capstone to Vercel"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="taskDesc">Notes &amp; Description</label>
        <textarea
          id="taskDesc"
          className="textarea-field"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add implementation details, sub-tasks, or notes..."
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="taskStatus">Status</label>
          <select
            id="taskStatus"
            className="select-field"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="taskPriority">Priority</label>
          <select
            id="taskPriority"
            className="select-field"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="taskDueDate">Target Due Date</label>
        <input
          id="taskDueDate"
          type="date"
          className="input-field"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
      </div>

      <button className="btn btn-primary full" type="submit">
        {editingTask ? "Save Changes" : "＋ Create Task"}
      </button>
    </form>
  );
}

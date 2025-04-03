import { useEffect, useState } from "react";

interface FilePlan {
  id?: number;
  name: string;
  description: string;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/fileplans";

export default function App() {
  const [filePlans, setFilePlans] = useState<FilePlan[]>([]);
  const [form, setForm] = useState<FilePlan>({ name: "", description: "" });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fetchFilePlans();
  }, []);

  const fetchFilePlans = async () => {
    const res = await fetch(API_BASE_URL);
    const data = await res.json();
    setFilePlans(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    const url = form.id ? `${API_BASE_URL}/${form.id}` : API_BASE_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", description: "" });
    setIsEditing(false);
    fetchFilePlans();
  };

  const handleEdit = (fp: FilePlan) => {
    setForm(fp);
    setIsEditing(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    fetchFilePlans();
  };

  const handleCancel = () => {
    setForm({ name: "", description: "" });
    setIsEditing(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>File Plan Manager</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Name</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Description</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filePlans.map((fp) => (
            <tr key={fp.id}>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{fp.name}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{fp.description}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                <button onClick={() => handleEdit(fp)} style={{ marginRight: "0.5rem" }}>Edit</button>
                <button onClick={() => handleDelete(fp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{isEditing ? "Edit File Plan" : "Create File Plan"}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <div>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            required
            style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
          />
        </div>
        <div>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
          />
        </div>
        <button type="submit" style={{ marginRight: "0.5rem" }}>{form.id ? "Update" : "Create"}</button>
        {isEditing && <button type="button" onClick={handleCancel}>Cancel</button>}
      </form>
    </div>
  );
}


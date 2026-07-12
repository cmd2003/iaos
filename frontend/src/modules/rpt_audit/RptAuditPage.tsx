import { useEffect, useState } from "react";
import { del, get, post } from "../../lib/api";

const SLUG = "rpt_audit";

interface Item {
  id: number;
  title: string;
  notes: string;
}

export default function RptAuditPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setItems(await get<Item[]>(`/api/modules/${SLUG}/items`));
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    await post(`/api/modules/${SLUG}/items`, {
      title,
      notes,
    });

    setTitle("");
    setNotes("");
    refresh();
  }

  async function remove(id: number) {
    await del(`/api/modules/${SLUG}/items/${id}`);
    refresh();
  }

  return (
    <div>
      <h2>RPT Audit</h2>

      <p style={{ color: "var(--slate)", marginBottom: 20 }}>
        Manage Related Party Transaction audit records.
      </p>

      <form
        onSubmit={add}
        className="card"
        style={{ padding: 20, marginBottom: 24, maxWidth: 560 }}
      >
        <div className="field">
          <label>Title</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Notes</label>
          <input
            className="input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button className="btn btn-primary">
          Add Item
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.title}</td>
                  <td>{it.notes}</td>
                  <td>
                    <button
                      className="btn btn-ghost"
                      onClick={() => remove(it.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
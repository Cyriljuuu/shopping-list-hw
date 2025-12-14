import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CURRENT_USER_ID } from "../data";
import { api } from "../api";
import "../styles/listOverview.css";

export default function ListOverviewPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.getLists();
        setLists(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load lists:", e);
        setLists([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const visibleLists = useMemo(() => {
    if (filter === "active") return lists.filter((l) => l.status === "active");
    if (filter === "archived")
      return lists.filter((l) => l.status === "archived");
    return lists;
  }, [lists, filter]);

  const activeCount = lists.filter((l) => l.status === "active").length;
  const archivedCount = lists.filter((l) => l.status === "archived").length;

  const handleOpen = (id) => navigate(`/lists/${id}`);

  const handleCreate = async (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    try {
      const created = await api.createList({ title });
      if (created) setLists((prev) => [...prev, created]);
      else {
        const data = await api.getLists();
        setLists(Array.isArray(data) ? data : []);
      }
      setNewTitle("");
    } catch (e) {
      console.error("Create failed:", e);
    }
  };

  const handleDelete = async (listId) => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;
    if (list.ownerId !== CURRENT_USER_ID) return;

    const ok = window.confirm(`Opravdu chcete smazat seznam "${list.title}"?`);
    if (!ok) return;

    try {
      await api.deleteList(listId);
      setLists((prev) => prev.filter((l) => l.id !== listId));
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  if (loading) return <p>Načítám seznamy…</p>;

  return (
    <div className="page list-overview-container">
      <header className="overview-header">
        <h1>Seznamy</h1>
        <div className="overview-stats">
          <span>Aktivní: {activeCount}</span>
          <span>Archivované: {archivedCount}</span>
        </div>
      </header>

      <section className="overview-controls">
        <label>
          Filtrovat:{" "}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="active">Jen nearchivované</option>
            <option value="all">Vše (včetně archivovaných)</option>
            <option value="archived">Jen archivované</option>
          </select>
        </label>

        <form className="new-list-form" onSubmit={handleCreate}>
          <input
            placeholder="Název nového seznamu…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button type="submit">Přidat seznam</button>
        </form>
      </section>

      <section className="list-grid">
        {visibleLists.map((list) => {
          const isOwner = list.ownerId === CURRENT_USER_ID;
          const items = Array.isArray(list.items) ? list.items : [];
          const members = Array.isArray(list.members) ? list.members : [];
          const resolvedCount = items.filter((i) => i.resolved).length;

          return (
            <article key={list.id} className={`list-tile ${list.status}`}>
              <h2>{list.title}</h2>

              <p>
                Položky: {resolvedCount}/{items.length}
              </p>
              <p>Členové: {members.length}</p>
              <p className="list-status">
                Stav: {list.status === "archived" ? "archivovaný" : "aktivní"}
              </p>

              <div className="tile-actions">
                <button onClick={() => handleOpen(list.id)}>Otevřít</button>
                {isOwner && (
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDelete(list.id)}
                  >
                    Smazat
                  </button>
                )}
              </div>
            </article>
          );
        })}

        {visibleLists.length === 0 && (
          <p>Pro zvolený filtr nejsou žádné seznamy.</p>
        )}
      </section>
    </div>
  );
}

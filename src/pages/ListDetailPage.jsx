import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { lists } from "../data";
import "../styles/listDetail.css";

const CURRENT_USER_ID = "user1";

export default function ListDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const initialList =
        lists.find((l) => l.id === id) || lists[0];

    const [list, setList] = useState(initialList);
    const [showOnlyUnresolved, setShowOnlyUnresolved] = useState(false);

    const isOwner = useMemo(
        () => CURRENT_USER_ID === list.ownerId,
        [list.ownerId]
    );

    const handleBack = () => navigate(-1);

    const handleUpdateTitle = (nextTitle) => {
        if (!isOwner) return;
        setList((prev) => ({ ...prev, title: nextTitle }));
    };

    const handleArchive = () => {
        if (!isOwner) return;
        setList((prev) => ({
            ...prev,
            status: prev.status === "archived" ? "active" : "archived",
        }));
    };

    const handleDeleteList = () => {
        if (!isOwner) return;
        alert("Seznam smazán (demo).");
        navigate("/lists");
    };

    const handleToggleResolved = (itemId) => {
        setList((prev) => ({
            ...prev,
            items: prev.items.map((it) =>
                it.id === itemId ? { ...it, resolved: !it.resolved } : it
            ),
        }));
    };

    const handleRemoveItem = (itemId) => {
        setList((prev) => ({
            ...prev,
            items: prev.items.filter((it) => it.id !== itemId),
        }));
    };

    const handleAddItem = (name) => {
        if (!name.trim()) return;
        const newItem = { id: String(Date.now()), name, resolved: false };
        setList((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    };

    const handleInviteMember = (email) => {
        if (!isOwner) return;
        if (!email.trim()) return;
        const newMember = {
            id: "u" + Math.floor(Math.random() * 100000),
            name: email,
            role: "member",
        };
        setList((prev) => ({ ...prev, members: [...prev.members, newMember] }));
    };

    const handleRemoveMember = (memberId) => {
        if (!isOwner && memberId !== CURRENT_USER_ID) return;
        setList((prev) => ({
            ...prev,
            members: prev.members.filter((m) => m.id !== memberId),
        }));
    };

    const visibleItems = useMemo(() => {
        return showOnlyUnresolved
            ? list.items.filter((i) => !i.resolved)
            : list.items;
    }, [showOnlyUnresolved, list.items]);

    return (
        <div className="page">
            { }
            <div className="header">
                <button onClick={handleBack}>← Zpět</button>

                <EditableTitle
                    value={list.title}
                    onChange={handleUpdateTitle}
                    canEdit={isOwner}
                />

                <div className="header-actions">
                    <button onClick={handleArchive}>
                        {list.status === "archived" ? "Odarchivovat" : "Archivovat"}
                    </button>
                    {isOwner && (
                        <button className="danger" onClick={handleDeleteList}>
                            Smazat
                        </button>
                    )}
                </div>
            </div>

            { }
            <section className="section">
                <label className="toggle">
                    <input
                        type="checkbox"
                        checked={showOnlyUnresolved}
                        onChange={(e) => setShowOnlyUnresolved(e.target.checked)}
                    />
                    <span>Zobrazit pouze nevyřešené</span>
                </label>

                <h3>Položky</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Název</th>
                            <th>Stav</th>
                            <th>Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleItems.map((item) => (
                            <ItemRow
                                key={item.id}
                                item={item}
                                onToggleResolved={() => handleToggleResolved(item.id)}
                                onRemove={() => handleRemoveItem(item.id)}
                                disabled={list.status === "archived"}
                            />
                        ))}
                    </tbody>
                </table>

                <AddItemForm
                    onAdd={handleAddItem}
                    disabled={list.status === "archived"}
                />
            </section>

            {/* Členové */}
            <section className="section">
                <h3>Členové</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Jméno</th>
                            <th>Role</th>
                            <th>Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.members.map((m) => (
                            <MemberRow
                                key={m.id}
                                member={m}
                                isCurrentUser={m.id === CURRENT_USER_ID}
                                canRemoveMembers={isOwner}
                                onRemove={() => handleRemoveMember(m.id)}
                            />
                        ))}
                    </tbody>
                </table>

                <AddMemberForm visible={isOwner} onInvite={handleInviteMember} />
            </section>

            <p className="note">
                Poznámka: Úpravy názvu a správa členů jsou dostupné pouze vlastníkovi.
            </p>
        </div>
    );
}


function EditableTitle({ value, onChange, canEdit }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    const save = () => {
        if (!canEdit) return;
        onChange(draft.trim() || value);
        setEditing(false);
    };

    return (
        <div className="title">
            {editing ? (
                <div className="title-edit">
                    <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        autoFocus
                    />
                    <button onClick={save}>Uložit</button>
                    <button onClick={() => setEditing(false)}>Zrušit</button>
                </div>
            ) : (
                <h1 onDoubleClick={() => canEdit && setEditing(true)}>{value}</h1>
            )}
            {!editing && canEdit && (
                <button className="link" onClick={() => setEditing(true)}>
                    Upravit název
                </button>
            )}
        </div>
    );
}

function ItemRow({ item, onToggleResolved, onRemove, disabled }) {
    return (
        <tr className={item.resolved ? "muted" : ""}>
            <td>{item.name}</td>
            <td>
                <label className="toggle">
                    <input
                        type="checkbox"
                        checked={item.resolved}
                        onChange={onToggleResolved}
                        disabled={disabled}
                    />
                    <span>{item.resolved ? "vyřešeno" : "nevyřešeno"}</span>
                </label>
            </td>
            <td>
                <button onClick={onRemove} disabled={disabled}>
                    Odebrat
                </button>
            </td>
        </tr>
    );
}

function AddItemForm({ onAdd, disabled }) {
    const [name, setName] = useState("");
    const submit = (e) => {
        e.preventDefault();
        if (disabled) return;
        onAdd(name);
        setName("");
    };
    return (
        <form className="row" onSubmit={submit}>
            <input
                placeholder="Nová položka…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={disabled}
            />
            <button type="submit" disabled={disabled}>
                Přidat položku
            </button>
        </form>
    );
}

function MemberRow({ member, isCurrentUser, canRemoveMembers, onRemove }) {
    const canOwnerRemoveThis =
        canRemoveMembers && member.role !== "owner";

    return (
        <tr>
            <td>{member.name}</td>
            <td>{member.role === "owner" ? "vlastník" : "člen"}</td>
            <td>
                {member.role === "owner" ? (
                    "—"
                ) : isCurrentUser ? (
                    <button onClick={onRemove}>Odejít</button>
                ) : canOwnerRemoveThis ? (
                    <button onClick={onRemove}>Odebrat</button>
                ) : (
                    "—"
                )}
            </td>
        </tr>
    );
}

function AddMemberForm({ visible, onInvite }) {
    const [email, setEmail] = useState("");
    if (!visible) return null;

    const submit = (e) => {
        e.preventDefault();
        onInvite(email);
        setEmail("");
    };

    return (
        <form className="row" onSubmit={submit}>
            <input
                placeholder="E-mail člena…"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Přidat člena</button>
        </form>
    );
}

import { useNavigate } from "react-router-dom";
import { lists } from "../data";

export default function ListOverviewPage() {
    const navigate = useNavigate();

    const activeLists = lists.filter((l) => l.status === "active");

    const handleOpenDetail = (id) => {
        navigate(`/lists/${id}`);
    };

    return (
        <div className="page">
            <h1>Seznamy</h1>

            <table className="table">
                <thead>
                    <tr>
                        <th>Název</th>
                        <th>Položky</th>
                        <th>Členové</th>
                        <th>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    {activeLists.map((list) => (
                        <tr key={list.id}>
                            <td>{list.title}</td>
                            <td>{list.items.length}</td>
                            <td>{list.members.length}</td>
                            <td>
                                <button onClick={() => handleOpenDetail(list.id)}>
                                    Otevřít
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={() => navigate("/lists/archived")}>
                Archivované seznamy
            </button>
        </div>
    );
}


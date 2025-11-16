import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ListOverviewPage from "./pages/ListOverviewPage";
import ListDetailPage from "./pages/ListDetailPage";
import ArchivedListsPage from "./pages/ArchivedListsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/lists" replace />} />

        <Route path="/lists" element={<ListOverviewPage />} />
        <Route path="/lists/:id" element={<ListDetailPage />} />
        <Route path="/lists/archived" element={<ArchivedListsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

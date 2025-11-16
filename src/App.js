import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListOverviewPage from "./pages/ListOverviewPage";
import ListDetailPage from "./pages/ListDetailPage";
import ArchivedListsPage from "./pages/ArchivedListsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lists" element={<ListOverviewPage />} />
        <Route path="/lists/:id" element={<ListDetailPage />} />
        <Route path="/lists/archived" element={<ArchivedListsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";

const App: React.FC = () => {
  return (
    <div className="full-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
    </div>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppBar from "./components/AppBar";
import AddPlantPage from "./pages/AddPlantPage";
import { Toaster } from "sonner";

// import all the pages
import HomePage from "./pages/HomePage";
import FamilyPage from "./pages/PlantFamily";
import ViewPlantPage from "./pages/ViewPlantPage";
import EditPlantPage from "./pages/EditPlantPage";

function App() {
  return (
    <Router>
      <AppBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddPlantPage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/view/:id" element={<ViewPlantPage />} />
        <Route path="/edit/:id" element={<EditPlantPage />} />
      </Routes>
      <Toaster
        richColors
        position="bottom-right"
        toastOptions={{
          classNames: {
            success: "bg-green-600 text-white",
            error: "bg-red-600 text-white",
            warning: "bg-yellow-600 text-black",
          },
        }}
      />
    </Router>
  );
}

export default App;

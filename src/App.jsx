import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Grounds from "./pages/Grounds";
import Matches from "./pages/Matches";
import Tournaments from "./pages/Tournaments";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CaptainDashboard from "./pages/CaptainDashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grounds" element={<Grounds />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/organizer/dashboard" element={
            <ProtectedRoute allowedRoles={["organizer"]}><OrganizerDashboard /></ProtectedRoute>
          } />
          <Route path="/captain/dashboard" element={
            <ProtectedRoute allowedRoles={["captain"]}><CaptainDashboard /></ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
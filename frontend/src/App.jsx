import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import BuyerHome from './pages/buyer/BuyerHome'
import DivisionPlaces from './pages/buyer/DivisionPlaces'
import PlacePlots from './pages/buyer/PlacePlots'
import PlotDetail from './pages/buyer/PlotDetail'
import SellerForm from './pages/seller/SellerForm'
import SellerDashboard from './pages/seller/SellerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/buyer" element={<ProtectedRoute role="buyer"><BuyerHome /></ProtectedRoute>} />
        <Route path="/buyer/division/:divisionId" element={<ProtectedRoute role="buyer"><DivisionPlaces /></ProtectedRoute>} />
        <Route path="/buyer/place/:placeId" element={<ProtectedRoute role="buyer"><PlacePlots /></ProtectedRoute>} />
        <Route path="/buyer/plot/:plotId" element={<ProtectedRoute role="buyer"><PlotDetail /></ProtectedRoute>} />

        <Route path="/seller" element={<ProtectedRoute role="seller"><SellerForm /></ProtectedRoute>} />
        <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute role="owner"><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  )
}
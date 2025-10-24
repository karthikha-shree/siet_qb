import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'rsuite/dist/rsuite.min.css';
import HomePage from './pages/HomePage';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import DepartmentView from './pages/DepartmentView';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/department/:id" element={<DepartmentView />} />
      </Routes>
    </Router>
  );
}

export default App;

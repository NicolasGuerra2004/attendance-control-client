import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Assist } from './pages/Assist';
import { Users } from './pages/Users';
import { Reports } from './pages/Reports';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assist" element={<Assist />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/reportes" element={<Reports />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
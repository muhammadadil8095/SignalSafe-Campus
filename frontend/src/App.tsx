import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import CheckPage from './pages/CheckPage';
import VerdictPage from './pages/VerdictPage';
import ReportPage from './pages/ReportPage';
import ReportConfirmPage from './pages/ReportConfirmPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/check" element={<CheckPage />} />
          <Route path="/verdict" element={<VerdictPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/report-confirm" element={<ReportConfirmPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

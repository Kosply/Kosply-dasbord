import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AiModel from './pages/AiModel';
import FraudReports from './pages/FraudReports';
import UserVerification from './pages/UserVerification';
import ToolsBenchmark from './pages/ToolsBenchmark';
import ContactSupport from './pages/ContactSupport';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/ai-model" element={<AiModel />} />
      <Route path="/fraud-reports" element={<FraudReports />} />
      <Route path="/user-verification" element={<UserVerification />} />
      <Route path="/tools-benchmark" element={<ToolsBenchmark />} />
      <Route path="/contact-support" element={<ContactSupport />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WorkspaceLayout from './components/WorkspaceLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Projects from './pages/Projects';
import ProjectView from './pages/ProjectView'; // Unified View
// import ProjectDetail from './pages/ProjectDetail'; // Deprecated
// import DecisionEditor from './pages/DecisionEditor'; // Deprecated

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected workspace routes */}
        <Route element={<ProtectedRoute><WorkspaceLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<Projects />} />
          {/* New 3-Column Layout Routes */}
          <Route path="/projects/:projectId" element={<ProjectView />} />
          <Route path="/projects/:projectId/prs/:prId" element={<ProjectView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

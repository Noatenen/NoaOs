import { Navigate, Route, Routes } from 'react-router'
import AppShell from './AppShell'
import TodayPage from '../features/today/TodayPage'
import TasksPage from '../features/tasks/TasksPage'
import MePage from '../features/me/MePage'
import BrainPage from '../features/brain/BrainPage'
import JournalPage from '../features/journal/JournalPage'
import WorkPage from '../features/work/WorkPage'
import MyNoaPage from '../features/my-noa/MyNoaPage'
import NoaAiPage from '../features/noa-ai/NoaAiPage'
import SettingsPage from '../features/settings/SettingsPage'

// URL → screen. Every page renders inside AppShell (navigation + content area).
export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/today" replace />} />
        <Route path="today" element={<TodayPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="me" element={<MePage />} />
        <Route path="brain" element={<BrainPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="work" element={<WorkPage />} />
        <Route path="my-noa" element={<MyNoaPage />} />
        <Route path="noa-ai" element={<NoaAiPage />} />
        <Route path="settings" element={<SettingsPage />} />
        {/* Unknown address → back to the center. */}
        <Route path="*" element={<Navigate to="/today" replace />} />
      </Route>
    </Routes>
  )
}

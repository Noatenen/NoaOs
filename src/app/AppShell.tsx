import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import styles from './AppShell.module.css'

// The frame of the OS. Both navigations are rendered; CSS decides which one is visible
// (sidebar on wide screens, bottom bar on narrow ones).
export default function AppShell() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}

import { NavLink } from 'react-router'
import { Icon } from '../components/Icon'
import { navItems, type NavItem } from './navigation'
import styles from './Sidebar.module.css'

function SidebarLink({ item }: { item: NavItem }) {
  return (
    <li>
      {/* NavLink knows whether its route is the current one and passes isActive. */}
      <NavLink
        to={item.path}
        className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
      >
        <Icon name={item.icon} />
        <span>{item.label}</span>
      </NavLink>
    </li>
  )
}

export default function Sidebar() {
  const primary = navItems.filter((item) => item.group === 'primary')
  const secondary = navItems.filter((item) => item.group === 'secondary')

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true" />
        <span className="ltr">NoaOS</span>
      </div>

      <nav className={styles.nav} aria-label="ניווט ראשי">
        <ul className={styles.list}>
          {primary.map((item) => (
            <SidebarLink key={item.path} item={item} />
          ))}
        </ul>

        <ul className={`${styles.list} ${styles.secondary}`}>
          {secondary.map((item) => (
            <SidebarLink key={item.path} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  )
}

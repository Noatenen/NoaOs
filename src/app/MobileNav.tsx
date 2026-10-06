import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { Icon } from '../components/Icon'
import { navItems } from './navigation'
import styles from './MobileNav.module.css'

// Narrow screens: a bottom bar with the most-used areas, plus a "more" sheet for the rest.
export default function MobileNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()

  const barItems = navItems.filter((item) => item.mobile === 'bar')
  const moreItems = navItems.filter((item) => item.mobile === 'more')
  // Highlight "more" when the current page lives inside the sheet.
  const moreIsActive = moreItems.some((item) => location.pathname.startsWith(item.path))

  // Close the sheet after navigating somewhere.
  useEffect(() => {
    setMoreOpen(false)
  }, [location.pathname])

  // Close the sheet with Escape.
  useEffect(() => {
    if (!moreOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [moreOpen])

  return (
    <div className={styles.root}>
      {moreOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setMoreOpen(false)} />
          <nav className={styles.sheet} id="more-sheet" aria-label="אזורים נוספים">
            <ul className={styles.sheetList}>
              {moreItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? `${styles.sheetLink} ${styles.sheetActive}` : styles.sheetLink
                    }
                  >
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}

      <nav className={styles.bar} aria-label="ניווט ראשי">
        {barItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          className={moreIsActive ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          aria-expanded={moreOpen}
          aria-controls="more-sheet"
          onClick={() => setMoreOpen((open) => !open)}
        >
          <Icon name={moreOpen ? 'close' : 'more'} />
          <span>עוד</span>
        </button>
      </nav>
    </div>
  )
}

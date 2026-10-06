import { useEffect } from 'react'
import styles from './PlaceholderPage.module.css'

// An honest "not built yet" page: says what will live here, no fake data.
interface PlaceholderPageProps {
  title: string
  description: string
  upcoming: string[]
  // 'building' = part of v0.1; 'later' = beyond v0.1.
  status: 'building' | 'later'
  note?: string
}

export default function PlaceholderPage({ title, description, upcoming, status, note }: PlaceholderPageProps) {
  useEffect(() => {
    document.title = `${title} · NoaOS`
  }, [title])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </header>

      <section className={styles.note} aria-labelledby="upcoming-heading">
        <span className={styles.sticker} aria-hidden="true">
          {status === 'building' ? 'בבנייה' : 'בהמשך'}
        </span>
        <h2 id="upcoming-heading" className={styles.noteHeading}>
          {status === 'building' ? 'מה יגיע לכאן' : 'מה יגיע לכאן, אחרי הגרסה הראשונה'}
        </h2>
        <ul className={styles.list}>
          {upcoming.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {note && <p className={styles.footnote}>{note}</p>}
      </section>
    </div>
  )
}

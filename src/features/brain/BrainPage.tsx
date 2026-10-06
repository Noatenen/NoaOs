import PlaceholderPage from '../../components/PlaceholderPage'

// Placeholder until this area is built (see docs/MVP.md and docs/ROADMAP.md).
// Hebrew copy is a draft for Noa's review.
export default function BrainPage() {
  return (
    <PlaceholderPage
      title="המוח"
      description="מוח חיצוני: לשמור מחשבות וקישורים, ולחזור אליהם כשצריך."
      status="building"
      upcoming={[
        "שמירה מהירה של טקסט וקישורים מכל מקום",
        "תיבת קליטה לכל מה שנשמר",
        "שמור ← מאורגן ← בשימוש",
      ]}
    />
  )
}

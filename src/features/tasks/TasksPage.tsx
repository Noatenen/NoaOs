import PlaceholderPage from '../../components/PlaceholderPage'

// Placeholder until this area is built (see docs/MVP.md and docs/ROADMAP.md).
// Hebrew copy is a draft for Noa's review.
export default function TasksPage() {
  return (
    <PlaceholderPage
      title="משימות"
      description="כל מה שצריך לעשות, במקום אחד. בלי להפוך את זה לג'ירה."
      status="building"
      upcoming={[
        "הוספה וסימון של משימות",
        "עדיפות, תאריך יעד והערכת זמן",
        "שיוך לפרויקט או לתחום חיים",
      ]}
    />
  )
}

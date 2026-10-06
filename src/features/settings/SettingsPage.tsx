import PlaceholderPage from '../../components/PlaceholderPage'

// Placeholder until this area is built (see docs/MVP.md and docs/ROADMAP.md).
// Hebrew copy is a draft for Noa's review.
export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="הגדרות"
      description="יעדים רכים וגיבוי של המידע."
      status="building"
      upcoming={[
        "יעדים יומיים למים ולצעדים",
        "ייצוא וייבוא של כל המידע (גיבוי)",
      ]}
      note="כל המידע נשמר רק בדפדפן הזה, במכשיר הזה."
    />
  )
}

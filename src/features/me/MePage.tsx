import PlaceholderPage from '../../components/PlaceholderPage'

// Placeholder until this area is built (see docs/MVP.md and docs/ROADMAP.md).
// Hebrew copy is a draft for Noa's review.
export default function MePage() {
  return (
    <PlaceholderPage
      title="אני"
      description="מודעות לגוף ולמצב לאורך זמן, בלי ציונים ובלי שיפוט."
      status="building"
      upcoming={[
        "מים, מול יעד יומי רך",
        "צעדים",
        "אימונים ויוגה",
      ]}
    />
  )
}

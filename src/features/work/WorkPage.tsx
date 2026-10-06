import PlaceholderPage from '../../components/PlaceholderPage'

// Placeholder until this area is built (see docs/MVP.md and docs/ROADMAP.md).
// Hebrew copy is a draft for Noa's review.
export default function WorkPage() {
  return (
    <PlaceholderPage
      title="עבודה"
      description="שכבה אישית מעל העבודה: פרויקטים, זמן ופוקוס."
      status="building"
      upcoming={[
        "פרויקטים",
        "טיימר לסשן עבודה",
        "מעקב אחרי זמן שעוד לא דווח",
      ]}
      note="NoaOS לא מחליפה את מערכת דיווח השעות בעבודה, רק עוזרת לזכור לדווח."
    />
  )
}

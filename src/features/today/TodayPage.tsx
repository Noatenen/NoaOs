import PlaceholderPage from '../../components/PlaceholderPage'

// Placeholder until this area is built (see docs/MVP.md and docs/ROADMAP.md).
// Hebrew copy is a draft for Noa's review.
export default function TodayPage() {
  return (
    <PlaceholderPage
      title="היום"
      description="המקום שבו כל היום מתחבר: מה קורה, מה חשוב ומה הבא בתור."
      status="building"
      upcoming={[
        "צ'ק-אין של בוקר: מצב רוח ואנרגיה",
        "עד שלושה דברים בפוקוס",
        "מה הבא בתור מהמשימות",
        "מים, צעדים ואימון של היום",
        "סשן עבודה פעיל",
        "רפלקציית ערב שסוגרת את היום",
      ]}
    />
  )
}

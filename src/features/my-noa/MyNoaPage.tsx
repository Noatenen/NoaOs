import PlaceholderPage from '../../components/PlaceholderPage'

// Placeholder until this area is built (see docs/MVP.md and docs/ROADMAP.md).
// Hebrew copy is a draft for Noa's review.
export default function MyNoaPage() {
  return (
    <PlaceholderPage
      title="נועה שלי"
      description="השכבה האישית והמשחקית של NoaOS."
      status="later"
      upcoming={[
        "מיני נועה",
        "פרק 26",
        "הישגים ואוספים",
        "החדר שלי",
      ]}
      note="לא חלק מהגרסה הראשונה."
    />
  )
}

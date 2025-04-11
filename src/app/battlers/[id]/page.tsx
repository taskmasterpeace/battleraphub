
import BattlerDetails from "@/components/pages/battlers/details"

export default function BattlerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <BattlerDetails params={params} />
}
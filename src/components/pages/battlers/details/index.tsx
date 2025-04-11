"use client"

import { use, useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin } from "lucide-react"
import AttributesTab from "@/components/pages/battlers/details/AttributesTab"
import AnalyticsTab from "@/components/pages/battlers/details/AnalyticsTab"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import { battlerDetails } from "@/__mocks__/battlers"

export default function BattlerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: battlerId } = use(params);
  const [selectedBadges, setSelectedBadges] = useState<{
    positive: string[]
    negative: string[]
  }>({
    positive: [],
    negative: [],
  })

  const [totalPoints, setTotalPoints] = useState(battlerDetails.totalPoints)

  // Function to update badges (will be passed to AttributesTab)
  const updateBadges = (badges: { positive: string[]; negative: string[] }) => {
    setSelectedBadges(badges)
  }

  // Function to update total points (will be passed to AttributesTab)
  const updateTotalPoints = (points: number) => {
    setTotalPoints(points)
  }

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-48 relative">
        <Image
          src={battlerDetails.banner || "/placeholder.svg"}
          alt={`${battlerDetails.name} banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-900 relative">
            <Image src={battlerDetails.image || "/placeholder.svg"} alt={battlerDetails.name} fill className="object-cover" />
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{battlerDetails.name}</h1>
                <p className="text-gray-400 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {battlerDetails.location}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {battlerDetails.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400">Total Rating</p>
                <p className="text-3xl font-bold text-purple-400">{totalPoints.toFixed(1)}</p>
              </div>
            </div>

            {/* Selected badges */}
            {(selectedBadges.positive.length > 0 || selectedBadges.negative.length > 0) && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Selected Badges</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedBadges.positive.map((badge, index) => (
                    <div key={`${badge}-${index}`}>
                      <Badge className="px-3 py-2 text-base bg-green-900/30 text-green-400 border-green-700 hover:bg-green-900/30 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {badge}
                      </Badge>
                    </div>
                  ))}
                  {selectedBadges.negative.map((badge, index) => (
                    <div key={`${badge}-${index}`}>
                      <Badge className="px-3 py-2 text-base bg-red-900/30 text-red-400 border-red-700 hover:bg-red-900/30 flex items-center">
                        <XCircle className="w-4 h-4 mr-2" />
                        {badge}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="attributes" className="mb-12">
          <TabsList className="mb-8 bg-gray-900 border border-gray-800">
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="attributes">
            <AttributesTab updateBadges={updateBadges} updateTotalPoints={updateTotalPoints} />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab battlerId={battlerId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


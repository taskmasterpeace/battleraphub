'use client';
import Link from "next/link"
import Image from "next/image"
import QuickFilterBar from "@/components/pages/battlers/QuickFilterBar"
import { battlers } from "@/__mocks__/battlers"

export default function Battlers() {
  // Add this function to handle filter changes
  const handleFilterChange = (filters: {
    search: string
    tags: string[]
  }) => {
    // In a real app, this would filter the battlers
    console.log("Filters changed:", filters)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Battlers</h1>

      {/* Add the QuickFilterBar component */}
      <div className="mb-6">
        <QuickFilterBar onFilterChange={handleFilterChange} />
      </div>

      {/* Battlers grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {battlers.map((battler) => (
          <Link
            key={battler.id}
            href={`/battlers/${battler.id}`}
            className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-900/20"
          >
            <div className="aspect-square relative">
              <Image src={battler.image || "/placeholder.svg"} alt={battler.name} fill className="object-cover" />
            </div>
            <div className="p-3">
              <h3 className="font-medium">{battler.name}</h3>
              <p className="text-sm text-gray-400">{battler.location}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {battler.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


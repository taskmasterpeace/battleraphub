"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { popularTags } from "@/__mocks__/battlers"

interface QuickFilterBarProps {
  onFilterChange: (filters: {
    search: string
    tags: string[]
  }) => void
}

export default function QuickFilterBar({ onFilterChange }: QuickFilterBarProps) {
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onFilterChange({
      search: e.target.value,
      tags: selectedTags,
    })
  }

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]

    setSelectedTags(newTags)
    onFilterChange({
      search,
      tags: newTags,
    })
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedTags([])
    onFilterChange({
      search: "",
      tags: [],
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search battlers..." value={search} onChange={handleSearchChange} className="pl-9" />
        </div>

        {(search || selectedTags.length > 0) && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium">Quick Filters</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedTags.includes(tag) ? "bg-blue-900/30 hover:bg-blue-900/50 text-blue-300" : "hover:bg-gray-800"
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && <X className="h-3 w-3 ml-1" />}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}


"use server"

import { cache } from "react"
import { createClient } from "@/utils/supabase/server"
import { Battler, Attribute, Badge } from "@/types"

// Mock data for battlers
const battlersMock: Battler[] = [
  {
    id: 1,
    name: "Loaded Lux",
    location: "Harlem, NY",
    image: "/placeholder.svg?height=400&width=400",
    banner: "/placeholder.svg?height=200&width=1200",
    tags: ["URL", "Veteran", "Lyricist"],
    totalPoints: 8.7,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: 2,
    name: "Tsu Surf",
    location: "Newark, NJ",
    image: "/placeholder.svg?height=400&width=400",
    banner: "/placeholder.svg?height=200&width=1200",
    tags: ["URL", "Puncher"],
    totalPoints: 8.5,
    createdAt: new Date("2023-02-10"),
  },
  {
    id: 3,
    name: "Geechi Gotti",
    location: "Compton, CA",
    image: "/placeholder.svg?height=400&width=400",
    banner: "/placeholder.svg?height=200&width=1200",
    tags: ["URL", "Performance"],
    totalPoints: 8.9,
    createdAt: new Date("2023-03-05"),
  },
  {
    id: 4,
    name: "Rum Nitty",
    location: "Phoenix, AZ",
    image: "/placeholder.svg?height=400&width=400",
    banner: "/placeholder.svg?height=200&width=1200",
    tags: ["URL", "Puncher"],
    totalPoints: 9.0,
    createdAt: new Date("2023-04-20"),
  },
  {
    id: 5,
    name: "JC",
    location: "Pontiac, MI",
    image: "/placeholder.svg?height=400&width=400",
    banner: "/placeholder.svg?height=200&width=1200",
    tags: ["URL", "Lyricist"],
    totalPoints: 8.5,
    createdAt: new Date("2023-05-15"),
  },
  {
    id: 6,
    name: "K-Shine",
    location: "Harlem, NY",
    image: "/placeholder.svg?height=400&width=400",
    banner: "/placeholder.svg?height=200&width=1200",
    tags: ["URL", "Performance"],
    totalPoints: 8.3,
    createdAt: new Date("2023-06-10"),
  },
]

// Attributes data
const attributesMock: Attribute[] = [
  { category: "Writing", attribute: "Wordplay", description: "Clever manipulation of language and double entendres" },
  { category: "Writing", attribute: "Punchlines", description: "Impactful lines designed to get reactions" },
  { category: "Writing", attribute: "Schemes", description: "Extended metaphors and thematic writing" },
  {
    category: "Writing",
    attribute: "Angles",
    description: "Unique perspectives and approaches to attacking opponents",
  },
  { category: "Performance", attribute: "Delivery", description: "Clarity, timing, and emphasis in speech" },
  { category: "Performance", attribute: "Stage Presence", description: "Commanding attention and energy on stage" },
  {
    category: "Performance",
    attribute: "Crowd Control",
    description: "Ability to engage and manipulate audience reactions",
  },
  { category: "Performance", attribute: "Showmanship", description: "Entertainment value and performance artistry" },
  { category: "Personal", attribute: "Authenticity", description: "Genuineness and believability of content" },
  { category: "Personal", attribute: "Battle IQ", description: "Strategic approach and in-battle adaptability" },
  { category: "Personal", attribute: "Preparation", description: "Research and battle-specific content" },
  { category: "Personal", attribute: "Consistency", description: "Reliability of performance quality across battles" },
]

// Function to fetch and parse CSV data
async function fetchCSV(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.statusText}`)
  }
  return response.text()
}
// Parse CSV string to array of objects
function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.split("\n")
  const headers = lines[0].split(",").map((header) => header.trim())

  return lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => {
      const values = line.split(",").map((value) => value.trim())
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index]
        return obj
      }, {} as Record<string, string>)
    })
}

// Fetch writing badges
export const getWritingBadges = cache(async (): Promise<Badge[]> => {
  try {
    const csvData = await fetchCSV(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Battle%20Rap%20Experience%20-%20Writing%20Badges-vUFDh3l4W5OHdguZK6goGs87sBWGUR.csv",
    )
    const parsedData = parseCSV(csvData)

    return parsedData.map((item) => ({
      category: item.Category,
      badge: item.Badge,
      description: item.Description,
      isPositive: !item.Category.toLowerCase().includes("neg"),
    }))
  } catch (error) {
    console.error("Error fetching writing badges:", error)
    return []
  }
})

// Fetch performance badges
export const getPerformanceBadges = cache(async (): Promise<Badge[]> => {
  try {
    const csvData = await fetchCSV(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Battle%20Rap%20Experience%20-%20Performance%20Badges-KJkxHybeS2XuSZAr4OBK316eqZ6xU4.csv",
    )
    const parsedData = parseCSV(csvData)

    return parsedData.map((item) => ({
      category: item.Category,
      badge: item.Badge,
      description: item.Description,
      isPositive: !item.Category.toLowerCase().includes("neg"),
    }))
  } catch (error) {
    console.error("Error fetching performance badges:", error)
    return []
  }
})

// Fetch personal reputation badges
export const getPersonalBadges = cache(async (): Promise<Badge[]> => {
  try {
    const csvData = await fetchCSV(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Battle%20Rap%20Experience%20-%20Personal%20Reputation%20Badges-VjjEGsuC5VoIROqg55XrDIMnVGqgHU.csv",
    )
    const parsedData = parseCSV(csvData)

    return parsedData.map((item) => ({
      category: item.Category,
      badge: item.Badge,
      description: item.Description,
      isPositive: !item.Category.toLowerCase().includes("neg"),
    }))
  } catch (error) {
    console.error("Error fetching personal badges:", error)
    return []
  }
})

// Get all badges
export const getAllBadges = cache(async (): Promise<Badge[]> => {
  const [writing, performance, personal] = await Promise.all([
    getWritingBadges(),
    getPerformanceBadges(),
    getPersonalBadges(),
  ])

  return [...writing, ...performance, ...personal]
})

// Get battlers
export const getBattlers = cache(async (): Promise<Battler[]> => {
  // In a real app, this would fetch from a database
  return battlersMock
})

// Get a single battler by ID
export const getBattlerById = cache(async (id: number): Promise<Battler | null> => {
  // In a real app, this would fetch from a database
  const battler = battlersMock.find((b) => b.id === id)
  return battler || null
})

// Get attributes
export const getAttributes = cache(async (): Promise<Attribute[]> => {
  // In a real app, this would fetch from a database
  return attributesMock
})

// Get attributes by category
export const getAttributesByCategory = cache(async (category: string): Promise<Attribute[]> => {
  const attributes = await getAttributes()
  return attributes.filter((attr) => attr.category === category)
})

// Admin functions (would connect to a database in a real app)

export async function createBattler(battler: Omit<Battler, "id" | "createdAt">): Promise<Battler> {
  // In a real app, this would insert into a database
  const newBattler: Battler = {
    ...battler,
    id: battlersMock.length + 1,
    createdAt: new Date(),
  }

  battlersMock.push(newBattler)
  return newBattler
}

export async function updateBattler(id: number, battler: Partial<Battler>): Promise<Battler | null> {
  // In a real app, this would update a database record
  const index = battlersMock.findIndex((b) => b.id === id)
  if (index === -1) return null

  battlersMock[index] = { ...battlersMock[index], ...battler }
  return battlersMock[index]
}

export async function deleteBattler(id: number): Promise<boolean> {
  // In a real app, this would delete from a database
  const index = battlersMock.findIndex((b) => b.id === id)
  if (index === -1) return false

  battlersMock.splice(index, 1)
  return true
}

// Get user by username
export const getUserByUsername = cache(async (username: string): Promise<null> => {
  console.log("Getting user by username:", username)
  // In a real app, this would fetch from a database
  return null
})

export async function updateUserAddedBattler(userId: string, battleId: string): Promise<void> {
  // In a real app, this would update the user's addedBattlers array
  const supabaseClient = await createClient()
  const { data: user, error: userError } = await supabaseClient
    .from("user_profiles")
    .select("addedBattlers")
    .eq("id", userId)
    .single()

  if (userError) {
    console.error("Error fetching user:", userError)
    throw userError
  }

  const addedBattlers = user?.addedBattlers || []
  const { error } = await supabaseClient
    .from("user_profiles")
    .update({ addedBattlers: [...addedBattlers, battleId] })
    .eq("id", userId)

  if (error) {
    console.error("Error updating user's addedBattlers:", error)
    throw error
  }
}

"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  defaultValue?: string
}

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(defaultValue)
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(() => {
      const params = new URLSearchParams()

      if (searchQuery) {
        params.set("search", searchQuery)
      }

      params.set("page", "1")

      router.push(`/?${params.toString()}`)
    })
  }

  const handleClear = () => {
    setSearchQuery("")
    startTransition(() => {
      router.push("/")
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          className="pl-8 pr-10 text-foreground bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isPending}
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-9 w-9 text-foreground bg-background"
            onClick={handleClear}
            disabled={isPending}
          >
            <X className="h-4 w-4 " />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
    </form>
  )
}


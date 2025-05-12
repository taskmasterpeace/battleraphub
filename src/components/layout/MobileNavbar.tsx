"use client";

import type React from "react";

import { useState, useRef } from "react";
import Link from "next/link";
import { Menu, User, LogIn, Search, Star, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth.context";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { filterNavList, mainNavItems, secondaryNavItems } from "@/lib/navigation-links";

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filteredMainLinks = mainNavItems.filter(
    (link) =>
      !link.roles.length ||
      (user?.user_metadata?.role && link.roles.includes(user.user_metadata.role)),
  );

  const filteredSecondaryLinks = filterNavList(secondaryNavItems, user);

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") {
      return false;
    }
    return pathname.startsWith(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsOpen(false);
      // In a real app, this would navigate to search results
      console.log(`Searching for: ${searchQuery}`);
    }
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            id="mobile-menu-trigger"
            ref={triggerRef}
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <Menu className="h-6 w-6 text-foreground" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[350px] bg-background border-border overflow-y-auto"
        >
          <SheetHeader className="border-b border-border pb-4 mb-4" />

          {/* User profile section */}
          <div className="mb-6">
            {user ? (
              <div className="flex items-center p-4 bg-muted text-foreground rounded-lg">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="/placeholder.svg" alt={user.email?.split("@")[0]} />
                  <AvatarFallback>{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{user.email?.split("@")[0]}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                >
                  <LogIn className="h-5 w-5 rotate-180 text-accent-foreground" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 p-4">
                <SheetClose asChild className="flex-1">
                  <Button asChild variant="default" className="w-full">
                    <Link href="/auth/login">Login</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild className="flex-1">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </SheetClose>
              </div>
            )}
          </div>

          {/* Search bar */}
          <div className="px-4 mb-6">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search battlers, battles..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Main navigation */}
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Main Navigation
            </h3>
            <div className="space-y-1">
              {filteredMainLinks.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-amber-900/20 text-amber-400"
                        : "text-foreground hover:bg-muted hover:text-amber-400"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </div>

          {/* Secondary navigation */}
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Features
            </h3>
            <div className="space-y-1">
              {filteredSecondaryLinks.map((item) => {
                if (item.children && item.children.length > 0) {
                  const isActive =
                    item.children.find((child) => child.href && pathname.startsWith(child.href)) ||
                    pathname.startsWith(item.href);
                  return (
                    <div key={item.href}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <span
                            className={`cursor-pointer flex items-center py-3 px-4 rounded-md transition-colors ${
                              isActive
                                ? "bg-amber-900/20 text-amber-400"
                                : "text-foreground hover:bg-muted hover:text-amber-400"
                            }`}
                          >
                            {item.icon}
                            {item.label}
                          </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                          {item.children.map((child) => (
                            <DropdownMenuItem
                              asChild
                              key={child.href}
                              className="cursor-pointer hover:bg-muted"
                            >
                              <Link href={child.href || "#"}>{child.label}</Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                }
                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                        isActive(item.href)
                          ? "bg-amber-900/20 text-amber-400"
                          : "text-foreground hover:bg-muted hover:text-amber-400"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </div>
          </div>

          {/* User account links */}
          {user && (
            <div className="mb-6">
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Your Account
              </h3>
              <div className="space-y-1">
                <SheetClose asChild>
                  <Link
                    href="/profile"
                    className="flex items-center py-3 px-4 rounded-md transition-colors text-foreground hover:bg-muted hover:text-amber-400"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/my-ratings"
                    className="flex items-center py-3 px-4 rounded-md transition-colors text-foreground hover:bg-muted hover:text-amber-400"
                  >
                    <Star className="w-5 h-5 mr-3" />
                    My Ratings
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/notifications"
                    className="flex items-center py-3 px-4 rounded-md transition-colors text-foreground hover:bg-muted hover:text-amber-400"
                  >
                    <Bell className="w-5 h-5 mr-3" />
                    Notifications
                    <span className="ml-auto bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      3
                    </span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/settings"
                    className="flex items-center py-3 px-4 rounded-md transition-colors text-foreground hover:bg-muted hover:text-amber-400"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </Link>
                </SheetClose>
              </div>
            </div>
          )}

          {/* Footer links */}
          <div className="border-t border-border pt-4 mt-auto">
            <div className="flex flex-wrap gap-3 px-4 text-sm text-muted-foreground">
              <SheetClose asChild>
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/terms" className="hover:text-foreground">
                  Terms
                </Link>
              </SheetClose>
            </div>
            <div className="px-4 mt-4 text-xs text-muted-foreground">
              © 2023 Algorithm Institute of Battle Rap
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

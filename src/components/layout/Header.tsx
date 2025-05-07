"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileNavbar from "./MobileNavbar";
// import NotificationCenter from "@/components/notifications/NotificationCenter"
import KeyboardShortcutsHelper from "@/components/KeyboardShortcutsHelper";
import { ROLE } from "@/config";
import { filterNavList, NAV_LINKS } from "@/lib/navigation-links";

export default function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const filteredLinks = filterNavList(NAV_LINKS, user);

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50 header-container">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <MobileNavbar />
          <Link href="/" className="flex items-center">
            <div className="relative mr-2">
              <Image
                src="/image/battleraphub.png"
                alt="Algorithm Institute of Battle Rap"
                width={80}
                height={40}
                className="object-none !h-auto"
                priority
              />
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6">
            {filteredLinks.map((link) => {
              if (link.children && link.children.length > 0) {
                const isActive =
                  link.children.find((child) => child.href && pathname.startsWith(child.href)) ||
                  pathname.startsWith(link.href);
                return (
                  <DropdownMenu key={link.href}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                          isActive ? "text-blue-400" : "text-gray-300"
                        }`}
                      >
                        {link.icon}
                        {link.label}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {link.children.map((child) => (
                        <DropdownMenuItem asChild key={child.href}>
                          <Link href={child.href || "#"}>{child.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                    pathname === link.href ? "text-blue-400" : "text-gray-300"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <KeyboardShortcutsHelper />

          {user ? (
            <>
              {/* <NotificationCenter /> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{user.email?.split("@")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.id}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-ratings">My Ratings</Link>
                  </DropdownMenuItem>
                  {user.user_metadata.role === ROLE.ADMIN && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin-tools">Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login" className="gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

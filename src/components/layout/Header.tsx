"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, Moon, Sun, User } from "lucide-react";
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
import { PAGES, ROLE } from "@/config";
import { filterNavList, NAV_LINKS } from "@/lib/navigation-links";
import { useTheme } from "next-themes";

export default function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { setTheme } = useTheme();

  const filteredLinks = filterNavList(NAV_LINKS, user);

  return (
    <header className="fixed top-0 left-0 right-0 bg-background backdrop-blur-md border-b border-border z-50 header-container">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <MobileNavbar />
          <Link href={PAGES.HOME} className="flex items-center">
            <div className="relative mr-2">
              <Image
                src="/image/battleraphub.png"
                alt="Algorithm Institute of Battle Rap"
                width={80}
                height={46}
                className="object-cover !h-auto"
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
                        className={`text-sm flex items-center gap-2 font-medium transition-colors hover:text-primary outline-none ${
                          isActive ? "text-primary" : "text-muted-foreground"
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
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
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
                    <User className="h-4 w-4 text-foreground" />
                    <span className="hidden md:inline text-foreground">
                      {user.user_metadata.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`${PAGES.PROFILE}/${user.id}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={PAGES.MY_RATINGS}>My Ratings</Link>
                  </DropdownMenuItem>
                  {user.user_metadata.role === ROLE.ADMIN && (
                    <DropdownMenuItem asChild>
                      <Link href={PAGES.ADMIN_TOOLS}>Admin Tools</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href={PAGES.LOGIN} className="gap-2">
                <LogIn className="h-4 w-4 text-foreground" />
                <span className="hidden sm:inline text-foreground">Login</span>
              </Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                <Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
                <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

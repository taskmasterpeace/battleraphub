"use client";

import { useEffect, useState, useRef } from "react";
import { Keyboard, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { PAGES } from "@/config";

type ShortcutCategory = {
  name: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
};

const KEYBOARD_SHORTCUTS: ShortcutCategory[] = [
  {
    name: "Navigation",
    shortcuts: [
      { keys: ["g", "t", "h"], description: "Go to Home" },
      { keys: ["g", "t", "b"], description: "Go to Battlers" },
      { keys: ["g", "t", "a"], description: "Go to Analytics" },
      { keys: ["g", "t", "l"], description: "Go to Leaderboard" },
      { keys: ["g", "t", "p"], description: "Go to Profile" },
      { keys: ["g", "t", "r"], description: "Go to My Rating" },
    ],
  },
  {
    name: "Actions",
    shortcuts: [
      { keys: ["?"], description: "Show Keyboard Shortcuts" },
      { keys: ["Esc"], description: "Close Dialog / Cancel" },
    ],
  },
  {
    name: "Admin",
    shortcuts: [
      { keys: ["m", "t", "b"], description: "Manage Battler" },
      { keys: ["m", "t", "u"], description: "Manage Users" },
      { keys: ["m", "d", "t"], description: "Data Tools" },
    ],
  },
];

export default function KeyboardShortcutsHelper() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const sequence = useRef<string[]>([]);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !open) {
        setOpen(true);
        return;
      }

      if (timer.current) {
        clearTimeout(timer.current);
      }
      sequence.current.push(e.key);

      const shortcutMap: Record<string, string> = {
        "Go to Home": PAGES.HOME,
        "Go to Battlers": PAGES.BATTLERS,
        "Go to Analytics": PAGES.ANALYTICS,
        "Go to Leaderboard": PAGES.LEADERBOARD,
        "Go to Profile": PAGES.PROFILE,
        "Go to My Rating": PAGES.MY_RATINGS,
        "Manage Battler": PAGES.ADMIN_BATTLERS,
        "Manage Users": PAGES.ADMIN_USER_LIST,
        "Data Tools": PAGES.ADMIN_TOOLS,
      };

      const match = KEYBOARD_SHORTCUTS.flatMap((cat) => cat.shortcuts).find((sc) =>
        sc.keys.every((k, idx) => sequence.current[idx] === k),
      );

      if (match) {
        sequence.current = [];

        if (shortcutMap[match.description]) {
          router.push(shortcutMap[match.description]);
          return;
        }

        switch (match.description) {
          case "Show Keyboard Shortcuts":
            setOpen(true);
            break;
          case "Close Dialog / Cancel":
            setOpen(false);
            break;
        }
        return;
      }

      timer.current = setTimeout(() => {
        sequence.current = [];
      }, 500);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Keyboard shortcuts">
          <Keyboard className="h-5 w-5 text-muted-foreground" />
          <HelpCircle className="h-3 w-3 absolute bottom-0 right-0 text-blue-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and perform actions quickly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {KEYBOARD_SHORTCUTS.map((category) => (
            <div key={category.name} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                {category.name}
              </h3>
              <div className="rounded-md border">
                {category.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 ${
                      index !== category.shortcuts.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="inline-flex h-5 items-center justify-center rounded border bg-muted px-1.5 text-xs font-medium text-muted-foreground dark:border-border dark:bg-background dark:text-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Press{" "}
          <kbd className="px-1 py-0.5 rounded border bg-muted text-xs dark:border-background dark:bg-background dark:text-foreground">
            ?
          </kbd>{" "}
          anywhere to open this dialog
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import {
  FlipHorizontal2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  FileText
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { Separator } from "@/components/ui/separator"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col max-w-[100vw] w-[100vw] min-w-[100vw] max-h-[100vh] h-[100vh] min-h-[100vh]">
      <div className="p-2 bg-[var(--dark-color)] gap-2">
        <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Button className={navigationMenuTriggerStyle()}>
              Enlarge
              <ZoomIn />
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button className={navigationMenuTriggerStyle()}>
              Mirror
              <FlipHorizontal2 />
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button className={navigationMenuTriggerStyle()}>
              Turn Left
              <RotateCcw />
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button className={navigationMenuTriggerStyle()}>
              Turn Right
              <RotateCw />
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button className={navigationMenuTriggerStyle()}>
              Documentation
              <FileText />
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Separator className="mx-auto w-[99vw]"/>
      <div className="flex justify-center items-center flex-1 w-[100vw] p-3">
        {children}
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Lightbulb,
  HelpCircle,
  CheckCircle,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/quiz/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAction } from "@/app/admin/login/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/facts", label: "Facts", icon: Lightbulb },
  { href: "/admin/questions", label: "Pending Questions", icon: HelpCircle },
  { href: "/admin/published", label: "Published Questions", icon: CheckCircle },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b px-4 py-4">
          <Link
            href="/admin"
            aria-label="WS Trivia Admin"
            className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <SiteLogo />
            <span className="text-muted-foreground text-[0.8125rem] font-semibold tracking-[-0.02em]">
              Admin
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname.startsWith(item.href)
                      }
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-2">
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" className="w-full justify-start">
              <LogOut />
              Log out
            </Button>
          </form>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Link
              href="/"
              className="text-muted-foreground px-2 text-sm transition-colors hover:text-foreground"
            >
              Back to site
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

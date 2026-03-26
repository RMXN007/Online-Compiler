import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Code2, Terminal, FileCode, Cpu, Zap, BookOpen, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const languages = [
  {
    id: "javascript",
    title: "JavaScript",
    icon: FileCode,
    color: "text-yellow-500 dark:text-yellow-400",
    badge: "JS",
    badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    url: "/",
  },
  {
    id: "typescript",
    title: "TypeScript",
    icon: FileCode,
    color: "text-blue-500 dark:text-blue-400",
    badge: "TS",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    url: "/typescript",
  },
  {
    id: "cpp",
    title: "C++",
    icon: Cpu,
    color: "text-purple-500 dark:text-purple-400",
    badge: "C++",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    url: "/cpp",
  },
  {
    id: "python",
    title: "Python",
    icon: Zap,
    color: "text-green-500 dark:text-green-400",
    badge: "PY",
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    url: "/python",
  },
  {
    id: "bash",
    title: "Bash / Shell",
    icon: Terminal,
    color: "text-orange-500 dark:text-orange-400",
    badge: "SH",
    badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    url: "/bash",
  },
];

const resources = [
  { title: "Snippets", icon: BookOpen, url: "/snippets" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">CodeRunner</p>
            <p className="text-xs text-muted-foreground leading-tight">Multi-language IDE</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">
            Languages
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {languages.map((lang) => {
                const isActive = location === lang.url || (lang.url === "/" && location === "");
                return (
                  <SidebarMenuItem key={lang.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      data-testid={`nav-${lang.id}`}
                    >
                      <Link href={lang.url} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <lang.icon className={`w-4 h-4 ${lang.color}`} />
                          <span className="text-sm font-medium">{lang.title}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${lang.badgeColor}`}>
                          {lang.badge}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resources.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`nav-${item.title.toLowerCase()}`}>
                    <Link href={item.url} className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Terminal className="w-3 h-3" />
          <span>Runtime Environment v1.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

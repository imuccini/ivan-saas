"use client";

import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/card";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Play,
  Settings,
  Shield,
  Sparkles,
  ThumbsUp,
  Users,
  Wifi,
} from "lucide-react";
import Link from "next/link";

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-bold">Status</CardTitle>
            <Badge status="info">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Live in 4 Networks
            </Badge>
          </div>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            Deploy on Networks <Play className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            {/* Health Score (Circular Progress Simulation) */}
            <div className="relative flex h-24 w-24 flex-none items-center justify-center rounded-full border-4 border-muted border-t-green-500">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">70</span>
                <span className="text-xs text-muted-foreground">Health</span>
              </div>
            </div>

            {/* Health Checks */}
            <div className="flex-1 space-y-3">
              {/* Blocking/Danger Issues - White background when good */}
              <Alert className="bg-background border">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  You have <span className="font-bold">no</span> blocking issues
                </AlertDescription>
              </Alert>
              
              {/* Warning Issues - Yellow background when there are warnings */}
              <Link href="#" className="block">
                <Alert className="border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400 hover:bg-yellow-500/20 transition-colors cursor-pointer">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>You have <span className="font-bold">3 anomalies</span> worth taking a look</span>
                    <ChevronRight className="h-4 w-4 opacity-50 ml-2" />
                  </AlertDescription>
                </Alert>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration & Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Configuration and management</h2>
          <Button size="sm" className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 border-0">
            <Sparkles className="h-3.5 w-3.5" />
            AI Assisted setup
            <Play className="h-3 w-3 ml-1 fill-current" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Users & Groups */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                Users & Groups
              </CardTitle>
              <Link href="#" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                BYOD Directory <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="flex-1 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">BYOD Users</div>
                  <div className="text-3xl font-bold tracking-tight">1,288</div>
                </div>
                <div className="space-y-1 border-l pl-4">
                  <div className="text-sm font-medium text-muted-foreground">Groups</div>
                  <div className="text-3xl font-bold tracking-tight">5</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Rules */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                Access Rules
              </CardTitle>
              <Link href="#" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Configure <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="flex-1 pt-4">
              <div className="flex items-start gap-6">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Active Rules</div>
                  <div className="text-3xl font-bold tracking-tight">0</div>
                </div>
                <div className="flex-1 border-l pl-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Set up <span className="font-medium text-foreground">Access Rules</span> to specify who can gain authorization and which network policies apply.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding & Network */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Wifi className="h-5 w-5 text-muted-foreground" />
                Onboarding & Network
              </CardTitle>
              <Link href="#" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Setup <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="flex-1 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Wifi className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Secure access to <span className="font-medium text-foreground">CorpoNet_Secure</span> via <span className="font-medium text-foreground">Passpoint</span>.
                  </p>
                  <Badge variant="outline" className="text-xs font-normal">BYOD Portal Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identity Providers */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Cloud className="h-5 w-5 text-muted-foreground" />
                Identity Providers
              </CardTitle>
              <Link href="#" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Manage IdPs <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="flex-1 pt-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2 rounded-lg border p-4 bg-muted/20 hover:bg-muted/40 transition-colors flex-1">
                    {/* Azure AD Placeholder */}
                    <div className="h-8 w-8 text-blue-500">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full"><path d="M12.7 2.3c-.4-.5-1.1-.5-1.5 0L2.3 11.2c-.4.4-.4 1.1 0 1.5l8.9 8.9c.4.4 1.1.4 1.5 0l8.9-8.9c.4-.4.4-1.1 0-1.5L12.7 2.3z"/></svg>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Azure AD</span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border p-4 bg-muted/20 hover:bg-muted/40 transition-colors flex-1">
                    {/* Google Placeholder */}
                    <div className="h-8 w-8 text-red-500">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Google</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Alert, AlertDescription } from "@ui/components/alert";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Input } from "@ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/table";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  MoreVertical,
  Plus,
  Search,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function IoTPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                  Total
                </div>
                <div className="text-3xl font-bold">356</div>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border bg-blue-500/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Active
                </div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">298</div>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border bg-green-500/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                  <ThumbsUp className="h-4 w-4" />
                  Online
                </div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">78</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card (Reused Style) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl font-bold">Status</CardTitle>
              <Badge status="info" className="flex items-center gap-1 h-6">
                <CheckCircle2 className="h-3 w-3" />
                <span>Live in 4 Networks</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-8 md:flex-row md:items-center">
              {/* Health Score */}
              <div className="relative flex h-24 w-24 flex-none items-center justify-center rounded-full border-4 border-muted border-t-green-500">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">70%</span>
                  <span className="text-xs text-muted-foreground">SCORE</span>
                </div>
                <div className="absolute bottom-0 left-0 text-[10px] text-muted-foreground">0</div>
                <div className="absolute bottom-0 right-0 text-[10px] text-muted-foreground">100</div>
              </div>

              {/* Alerts */}
              <div className="flex-1 space-y-2">
                <Alert variant="success" className="bg-green-500/10 text-green-600 border-green-500/20 [&>svg]:text-green-600">
                  <ThumbsUp className="h-4 w-4" />
                  <AlertDescription>
                    No blocking issues
                  </AlertDescription>
                </Alert>
                
                <Link href="#" className="block">
                  <Alert className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 [&>svg]:text-yellow-600 hover:bg-yellow-500/20 transition-colors">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <span><span className="font-bold">3 anomalies</span></span>
                      <ChevronRightIcon className="h-4 w-4 opacity-50" />
                    </AlertDescription>
                  </Alert>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devices Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Devices</CardTitle>
          <div className="flex items-center gap-2">
             <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add Device
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Export</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {/* Toolbar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by anything"
                className="pl-9 w-full md:w-[300px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Status
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Inactive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Group
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Dev</DropdownMenuItem>
                  <DropdownMenuItem>Prod</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Last seen
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Newest</DropdownMenuItem>
                  <DropdownMenuItem>Oldest</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  </TableHead>
                  <TableHead>Device name</TableHead>
                  <TableHead>MAc Address</TableHead>
                  <TableHead>Device group (s)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last seen</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                    </TableCell>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.mac}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">{device.group}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={device.status} />
                    </TableCell>
                    <TableCell>{device.lastSeen}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              0 of 68 row(s) selected.
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rows per page</span>
                    <Select defaultValue="10">
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent side="top">
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Page 1 of 7</span>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Mock Data
const devices = [
  { id: 1, name: "Camera 101", mac: "44:33:22:11:44:33", group: "Dev", status: "pending", lastSeen: "never" },
  { id: 2, name: "Printer 1", mac: "44:33:22:11:44:33", group: "Dev", status: "done", lastSeen: "Oct 20 2025 15:10" },
  { id: 3, name: "Printer 2", mac: "44:33:22:11:44:33", group: "Dev", status: "done", lastSeen: "Oct 20 2025 15:10" },
  { id: 4, name: "Camera 102", mac: "44:33:22:11:44:33", group: "Product", status: "pending", lastSeen: "Oct 20 2025 15:10" },
  { id: 5, name: "Camera 103", mac: "44:33:22:11:44:33", group: "Admin", status: "pending", lastSeen: "Oct 20 2025 15:10" },
  { id: 6, name: "Thermostat 1", mac: "44:33:22:11:44:33", group: "Admin", status: "done", lastSeen: "Oct 20 2025 15:10" },
  { id: 7, name: "dquadrini@cloud4wi.com", mac: "44:33:22:11:44:33", group: "Dev", status: "error", lastSeen: "Oct 20 2025 15:10" },
  { id: 8, name: "dquadrini@cloud4wi.com", mac: "44:33:22:11:44:33", group: "HR", status: "done", lastSeen: "Oct 20 2025 15:10" },
  { id: 9, name: "dquadrini@cloud4wi.com", mac: "44:33:22:11:44:33", group: "HR", status: "done", lastSeen: "Oct 20 2025 15:10" },
  { id: 10, name: "dquadrini@cloud4wi.com", mac: "44:33:22:11:44:33", group: "Marketing", status: "pending", lastSeen: "Oct 20 2025 15:10" },
];

function StatusBadge({ status }: { status: string }) {
    if (status === "done") {
        return (
            <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-700 hover:bg-green-100/80">
                <CheckCircle2 className="h-3 w-3" />
                Done
            </div>
        )
    }
    if (status === "pending") {
        return (
            <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-700 hover:bg-gray-100/80">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Pending
            </div>
        )
    }
     if (status === "error") {
        return (
            <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-red-100 text-red-700 hover:bg-red-100/80">
                <AlertTriangle className="h-3 w-3" />
                Error
            </div>
        )
    }
    return null;
}

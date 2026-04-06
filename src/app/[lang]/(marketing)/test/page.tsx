'use client'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Badge } from '@/shared/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Switch } from '@/shared/ui/switch'
import { Textarea } from '@/shared/ui/textarea'
import { Checkbox } from '@/shared/ui/checkbox'
import { Skeleton } from '@/shared/ui/skeleton'

import { SearchBar } from '@/shared/ui/search-bar'
import { useState } from 'react'

export default function DesignSystemKitchenSink() {
  const [toggle, setToggle] = useState(false)

  return (
    <div className="container space-y-12 py-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Design System Kitchen Sink</h1>
        <p className="text-muted-foreground text-lg">
          Master verification page for 100% Visual Test Coverage. Verifying:
          12px (xl) rounding, Solid backgrounds, Typography scale.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Colors Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Colors & Radius</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="bg-primary shadow-primary h-16 w-full rounded-xl"></div>
              <p className="font-mono text-xs">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="bg-secondary border-border h-16 w-full rounded-xl border"></div>
              <p className="font-mono text-xs">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="bg-destructive h-16 w-full rounded-xl"></div>
              <p className="font-mono text-xs">Destructive</p>
            </div>
            <div className="space-y-2">
              <div className="bg-muted h-16 w-full rounded-xl"></div>
              <p className="font-mono text-xs">Muted</p>
            </div>
          </div>
        </div>

        {/* Typography Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Typography</h2>
          <div className="flex flex-col gap-2">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Heading 1
            </h1>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Heading 2
            </h2>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Heading 3
            </h3>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Heading 4
            </h4>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              The quick brown fox jumps over the lazy dog. Standard body text.
            </p>
            <p className="text-muted-foreground text-sm">Muted text small.</p>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-2xl font-bold">Buttons (Radius: 12px)</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">icon</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button disabled>Disabled</Button>
          </div>
        </div>

        {/* Inputs Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Forms (Radius: 12px)</h2>
          <div className="max-w-sm space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email (Solid BG)" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea placeholder="Textarea (Solid BG)" id="message" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label>Select</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select (Solid BG)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="airplane-mode"
                checked={toggle}
                onCheckedChange={setToggle}
              />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Cards (Radius: 20px) & Badges</h2>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>
                Deploy your new project in one-click.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Content goes here. Background should be solid white (light) or
                slate-800 (dark).
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Skeletons Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Skeletons</h2>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        </div>

        {/* Search Bar Section */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-2xl font-bold">Search Bar</h2>
          <SearchBar />
        </div>
      </div>
    </div>
  )
}

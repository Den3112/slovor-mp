'use client'

import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="mb-2 font-heading text-3xl font-black tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your profile and account preferences.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 rounded-[2rem] border border-border/40 bg-card p-6">
          <h3 className="text-lg font-bold">Profile Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                First Name
              </label>
              <input
                className="w-full rounded-xl border border-border/40 bg-muted/20 px-4 py-3 font-medium outline-none transition-colors focus:border-primary/50"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Last Name
              </label>
              <input
                className="w-full rounded-xl border border-border/40 bg-muted/20 px-4 py-3 font-medium outline-none transition-colors focus:border-primary/50"
                placeholder="Doe"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <input
                className="w-full rounded-xl border border-border/40 bg-muted/20 px-4 py-3 font-medium outline-none transition-colors focus:border-primary/50"
                placeholder="john@example.com"
                disabled
              />
            </div>
          </div>
          <div className="pt-4">
            <Button className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

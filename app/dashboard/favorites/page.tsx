'use client'

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 font-heading text-3xl font-black tracking-tight">
          Favorites
        </h1>
        <p className="text-muted-foreground">Items you have saved for later.</p>
      </div>

      <div className="rounded-[3rem] border border-dashed border-border/50 bg-muted/5 p-12 text-center">
        <h3 className="mb-2 text-xl font-bold">No favorites yet</h3>
        <p className="text-muted-foreground">Start exploring to save items.</p>
      </div>
    </div>
  )
}

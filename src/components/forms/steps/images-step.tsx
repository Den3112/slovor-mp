import { ImageUpload } from '../image-upload'

export function ImagesStep() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Fotografie</h2>
        <p className="text-muted-foreground">
          Pridajte aspoň jednu fotku. Kvalitné fotky zvyšujú šancu na predaj o
          70%.
        </p>
      </div>

      <ImageUpload />
    </div>
  )
}

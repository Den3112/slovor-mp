import { Plus, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CategoryFormDialogProps } from './types'

export function CategoryFormDialog({
  isOpen,
  onOpenChange,
  editingCategory,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
}: CategoryFormDialogProps) {
  const { t } = useTranslation(['admin', 'common'])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card rounded-lg shadow-lg sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight uppercase">
              {editingCategory
                ? t('admin:editCategory')
                : t('admin:createCategory')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/60 text-xs font-bold tracking-widest uppercase">
              {editingCategory
                ? t('admin:updatingCategory', { name: editingCategory.name })
                : t('admin:defineNewCategory')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase"
              >
                {t('admin:inputName')}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: editingCategory
                      ? formData.slug
                      : e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  })
                }}
                className="border-border/60 bg-muted/20 focus:bg-background h-11 rounded-lg font-bold transition-all"
                placeholder="Electronics"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="slug"
                className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase"
              >
                {t('admin:inputSlug')}
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="border-border/60 bg-muted/20 focus:bg-background h-11 rounded-lg font-bold transition-all"
                placeholder="electronics"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="icon"
                className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase"
              >
                {t('admin:inputIconLabel')}
              </Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="border-border/60 bg-muted/20 focus:bg-background h-11 rounded-lg font-bold transition-all"
                placeholder="📱"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase"
              >
                {t('common:description')}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border-border/60 bg-muted/20 focus:bg-background min-h-[100px] rounded-lg font-medium transition-all"
                placeholder="..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-lg px-6 font-bold tracking-widest uppercase"
            >
              {t('common:cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="shadow-primary/20 h-11 rounded-lg px-6 font-bold tracking-widest uppercase shadow-lg"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {editingCategory
                ? t('admin:saveChanges')
                : t('admin:createCategory')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

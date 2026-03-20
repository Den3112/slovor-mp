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
import { AVAILABLE_ICON_NAMES } from '@/lib/constants/category-icons'
import { cn } from '@/lib/utils'
import { CategoryIcon } from '@/components/category/category-icon'

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
      <DialogContent className="border-border bg-card rounded-xl shadow-lg sm:max-w-[425px]">
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
                value={formData.name || ''}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: editingCategory
                      ? formData.slug
                      : e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  })
                }}
                className="border-border/60 bg-muted/20 focus:bg-background h-11 rounded-xl font-bold transition-all"
                placeholder={t('admin:placeholderName')}
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
                value={formData.slug || ''}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="border-border/60 bg-muted/20 focus:bg-background h-11 rounded-xl font-bold transition-all"
                placeholder={t('admin:placeholderSlug')}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="icon"
                  className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase"
                >
                  {t('admin:inputIconLabel')} (Emoji)
                </Label>
                <Input
                  id="icon"
                  value={formData.icon || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="border-border/60 bg-muted/20 focus:bg-background h-11 rounded-xl font-bold transition-all"
                  placeholder="⚡"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="icon_name"
                  className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase"
                >
                  Lucide Icon
                </Label>
                <select
                  id="icon_name"
                  value={formData.icon_name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, icon_name: e.target.value })
                  }
                  className="border-border/60 bg-muted/20 focus:bg-background focus:ring-primary/20 h-11 w-full rounded-xl px-3 font-bold transition-all focus:ring-2 focus:outline-none"
                >
                  <option value="">None</option>
                  {AVAILABLE_ICON_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-primary/5 border-primary/10 flex items-center justify-between rounded-xl border p-4">
              <div className="space-y-1">
                <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                  Preview
                </span>
                <div className="flex items-center gap-4">
                  <CategoryIcon
                    slug={formData.slug}
                    iconName={formData.icon_name}
                    iconEmoji={formData.icon}
                    className="h-6 w-6"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">
                      {formData.name || 'Category Name'}
                    </span>
                    <span className="text-muted-foreground text-[10px] tracking-tighter uppercase">
                      {formData.slug || 'category-slug'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex max-w-[120px] flex-wrap items-center justify-end gap-2">
                {['Laptop', 'Car', 'Home', 'Shirt', 'Dog'].map((name) => {
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, icon_name: name, icon: '' })
                      }
                      className={cn(
                        'transform transition-all duration-300 hover:scale-110 active:scale-95',
                        formData.icon_name === name &&
                          'ring-primary rounded-xl ring-2 ring-offset-2'
                      )}
                      title={name}
                    >
                      <CategoryIcon
                        iconName={name}
                        className="h-4 w-4"
                        showBackground={true}
                      />
                    </button>
                  )
                })}
              </div>
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
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border-border/60 bg-muted/20 focus:bg-background min-h-[100px] rounded-xl font-medium transition-all"
                placeholder={t('admin:placeholderDescription')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-xl px-6 font-bold tracking-widest uppercase"
            >
              {t('common:cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="shadow-primary/20 h-11 rounded-xl px-6 font-bold tracking-widest uppercase shadow-lg"
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

import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategoryFormDialogProps } from './types';

export function CategoryFormDialog({
    isOpen,
    onOpenChange,
    editingCategory,
    formData,
    setFormData,
    onSubmit,
    isSubmitting
}: CategoryFormDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-xl border-border bg-card shadow-lg">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold uppercase tracking-tight">
                            {editingCategory ? 'Edit Category' : 'Create Category'}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                            {editingCategory ? `Updating ${editingCategory.name}` : 'Define a new category for the marketplace'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                        slug: editingCategory ? formData.slug : e.target.value.toLowerCase().replace(/\s+/g, '-')
                                    })
                                }}
                                className="rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all h-11 font-bold"
                                placeholder="Electronics"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Slug</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all h-11 font-bold"
                                placeholder="electronics"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="icon" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Icon (Emoji or Icon name)</Label>
                            <Input
                                id="icon"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                className="rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all h-11 font-bold"
                                placeholder="📱"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all min-h-[100px] font-medium"
                                placeholder="Phones, laptops, and gadgets..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl h-11 px-6 font-bold uppercase tracking-widest"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl h-11 px-6 font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            {editingCategory ? 'Save Changes' : 'Create Category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

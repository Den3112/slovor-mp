import { Loader2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CategoryDeleteDialogProps } from './types';

export function CategoryDeleteDialog({
    deleteId,
    onOpenChange,
    onDelete,
    isSubmitting
}: CategoryDeleteDialogProps) {
    return (
        <AlertDialog open={!!deleteId} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-xl border-border bg-card shadow-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold uppercase tracking-tight text-destructive">
                        Delete Category?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-medium text-muted-foreground">
                        This action cannot be undone. All listings in this category might become uncategorized.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel
                        className="rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[10px]"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete();
                        }}
                        disabled={isSubmitting}
                        className="rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[10px] bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20 border-0"
                    >
                        {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Delete Category'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

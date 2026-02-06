'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils/cn';
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

interface BulkActionsBarProps {
    selectedCount: number;
    onCancel: () => void;
    onDeactivate: () => void;
    onDelete: () => void;
    isSubmitting: boolean;
}

export function BulkActionsBar({
    selectedCount,
    onCancel,
    onDeactivate,
    onDelete,
    isSubmitting,
}: BulkActionsBarProps) {
    if (selectedCount === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 min-w-[320px] max-w-[90vw]"
        >
            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Bulk actions</span>
                <span className="text-xs font-bold text-white">{selectedCount} items selected</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest h-9 px-4 rounded-xl"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    size="sm"
                    className="bg-white text-slate-900 hover:bg-white/90 text-[10px] font-bold uppercase tracking-widest h-9 px-4 rounded-xl"
                    onClick={onDeactivate}
                    disabled={isSubmitting}
                >
                    Deactivate
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    className="text-[10px] font-bold uppercase tracking-widest h-9 px-4 rounded-xl"
                    onClick={onDelete}
                    disabled={isSubmitting}
                >
                    Delete
                </Button>
            </div>
        </motion.div>
    );
}

interface BulkConfirmDialogProps {
    action: 'delete' | 'deactivate' | null;
    onClose: () => void;
    onConfirm: () => void;
    selectedCount: number;
    isSubmitting: boolean;
}

export function BulkConfirmDialog({
    action,
    onClose,
    onConfirm,
    selectedCount,
    isSubmitting,
}: BulkConfirmDialogProps) {
    const { t } = useTranslation(['common']);

    return (
        <AlertDialog open={!!action} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="rounded-xl border-border bg-card">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold uppercase tracking-tight">
                        {action === 'delete' ? 'Delete Listings' : 'Deactivate Listings'}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground font-medium">
                        {action === 'delete'
                            ? `Are you sure you want to permanently delete ${selectedCount} listings? This action cannot be undone.`
                            : `Are you sure you want to deactivate ${selectedCount} listings? They will be marked as sold and hidden from search.`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-[10px]" disabled={isSubmitting}>
                        {t('common:cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        className={cn(
                            'rounded-xl font-bold uppercase tracking-widest text-[10px]',
                            action === 'delete'
                                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        )}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : action === 'delete' ? (
                            t('common:delete')
                        ) : (
                            'Deactivate'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

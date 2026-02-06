import { Category } from '@/lib/api';

export interface CategoryFormData {
    name: string;
    slug: string;
    description: string;
    icon: string;
    icon_name: string;
    color: string;
    order_index: number;
}

export interface CategoryFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editingCategory: Category | null;
    formData: CategoryFormData;
    setFormData: (data: CategoryFormData) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    isSubmitting: boolean;
}

export interface CategoryHeaderProps {
    onAdd: () => void;
}

export interface CategoryDeleteDialogProps {
    deleteId: string | null;
    onOpenChange: (open: boolean) => void;
    onDelete: () => Promise<void>;
    isSubmitting: boolean;
}

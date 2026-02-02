import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListingCardSkeleton, CategoryCardSkeleton, ListingGridSkeleton, CategoryGridSkeleton } from '@/components/ui/skeleton-loader';

const meta: Meta<typeof ListingCardSkeleton> = {
    title: 'UI/SkeletonLoader',
    component: ListingCardSkeleton,
    tags: ['autodocs'],
};

export default meta;

export const ListingCard: StoryObj = {
    render: () => <ListingCardSkeleton />,
};

export const CategoryCard: StoryObj = {
    render: () => <CategoryCardSkeleton />,
};

export const ListingGrid: StoryObj = {
    render: () => <ListingGridSkeleton count={3} />,
};

export const CategoryGrid: StoryObj = {
    render: () => <CategoryGridSkeleton count={4} />,
};

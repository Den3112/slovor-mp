import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './empty-state';
import { ShoppingBag } from 'lucide-react';

const meta: Meta<typeof EmptyState> = {
    title: 'UI/EmptyState',
    component: EmptyState,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
    args: {
        title: 'No results found',
        description: "We couldn't find anything matching your search criteria. Try different keywords.",
        icon: '🔍',
        actionLabel: 'Clear Search',
        actionHref: '#',
    },
};

export const Shopping: Story = {
    args: {
        title: 'Your cart is empty',
        description: 'Looks like you haven\'t added any items to your cart yet.',
        icon: ShoppingBag,
        actionLabel: 'Go Shopping',
        actionHref: '/shop',
    },
};

export const Mini: Story = {
    args: {
        title: 'No messages yet',
        icon: '💬',
    },
};

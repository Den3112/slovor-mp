import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkeletonCard, SkeletonCardCompact, SkeletonCardList, SkeletonCardListCompact } from './skeleton-card';

const meta: Meta<typeof SkeletonCard> = {
    title: 'UI/SkeletonCard',
    component: SkeletonCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SkeletonCard>;

export const Default: Story = {
    render: () => <SkeletonCard />,
};

export const Compact: Story = {
    render: () => <SkeletonCardCompact />,
};

export const List: Story = {
    render: () => <SkeletonCardList count={4} />,
};

export const ListCompact: Story = {
    render: () => <SkeletonCardListCompact count={3} />,
};

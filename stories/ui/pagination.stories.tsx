import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from '@/components/ui/pagination';

const meta: Meta<typeof Pagination> = {
    title: 'UI/Pagination',
    component: Pagination,
    tags: ['autodocs'],
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/listings',
                query: { page: '1' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
    args: {
        currentPage: 1,
        totalPages: 5,
        totalItems: 245,
    },
};

export const MiddlePage: Story = {
    args: {
        currentPage: 3,
        totalPages: 10,
        totalItems: 500,
    },
};

export const ManyPages: Story = {
    args: {
        currentPage: 25,
        totalPages: 50,
        totalItems: 2500,
    },
};

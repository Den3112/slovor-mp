import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchBar } from '@/components/ui/search-bar';

const meta: Meta<typeof SearchBar> = {
    title: 'UI/SearchBar',
    component: SearchBar,
    tags: ['autodocs'],
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {};

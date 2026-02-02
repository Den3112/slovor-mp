import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '@/components/ui/container';

const meta: Meta<typeof Container> = {
    title: 'UI/Container',
    component: Container,
    tags: ['autodocs'],
    argTypes: {
        maxWidth: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
    args: {
        children: <div className="bg-muted p-8 text-center border-2 border-dashed">Content inside 2xl container (Default)</div>,
        maxWidth: '2xl',
    },
};

export const Small: Story = {
    args: {
        children: <div className="bg-muted p-8 text-center border-2 border-dashed">Small Container</div>,
        maxWidth: 'sm',
    },
};

export const FullWidth: Story = {
    args: {
        children: <div className="bg-muted p-8 text-center border-2 border-dashed">Full Width Container</div>,
        maxWidth: 'full',
    },
};

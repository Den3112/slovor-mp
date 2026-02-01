import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';
import { Mail } from 'lucide-react';

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg', 'xl', 'icon'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        children: 'Button',
        variant: 'default',
        size: 'default',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary',
        variant: 'secondary',
    },
};

export const Destructive: Story = {
    args: {
        children: 'Destructive',
        variant: 'destructive',
    },
};

export const Outline: Story = {
    args: {
        children: 'Outline',
        variant: 'outline',
    },
};

export const Ghost: Story = {
    args: {
        children: 'Ghost',
        variant: 'ghost',
    },
};

export const Link: Story = {
    args: {
        children: 'Link',
        variant: 'link',
    },
};

export const Large: Story = {
    args: {
        children: 'Large Button',
        size: 'lg',
    },
};

export const ExtraLarge: Story = {
    args: {
        children: 'XL Button',
        size: 'xl',
    },
};

export const Small: Story = {
    args: {
        children: 'Small',
        size: 'sm',
    },
};

export const Icon: Story = {
    args: {
        size: 'icon',
        children: <Mail className="h-4 w-4" />,
    },
};

export const WithIcon: Story = {
    args: {
        children: (
            <>
                <Mail className="mr-2 h-4 w-4" /> Login with Email
            </>
        ),
    },
};

export const Disabled: Story = {
    args: {
        children: 'Disabled',
        disabled: true,
    },
};

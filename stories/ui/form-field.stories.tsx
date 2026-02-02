import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

const meta: Meta<typeof FormField> = {
    title: 'UI/FormField',
    component: FormField,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
    args: {
        label: 'Email Address',
        children: <Input placeholder="john@example.com" />,
    },
};

export const Required: Story = {
    args: {
        label: 'Username',
        required: true,
        children: <Input placeholder="johndoe" />,
    },
};

export const WithError: Story = {
    args: {
        label: 'Password',
        error: 'Password must be at least 8 characters',
        children: <Input type="password" value="short" className="border-destructive" />,
    },
};

export const WithDescription: Story = {
    args: {
        label: 'Bio',
        description: 'Tell us a bit about yourself.',
        children: <Input placeholder="I am a developer..." />,
    },
};

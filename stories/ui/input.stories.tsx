import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@/components/ui/input';

const meta: Meta<typeof Input> = {
    title: 'UI/Input',
    component: Input,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        placeholder: 'Type something...',
    },
};

export const Email: Story = {
    args: {
        type: 'email',
        placeholder: 'Email',
    },
};

export const Disabled: Story = {
    args: {
        placeholder: 'Disabled input',
        disabled: true,
    },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './label';
import { Input } from './input';

const meta: Meta<typeof Label> = {
    title: 'UI/Label',
    component: Label,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
    render: () => (
        <div className="flex flex-col space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" placeholder="john@example.com" />
        </div>
    ),
};

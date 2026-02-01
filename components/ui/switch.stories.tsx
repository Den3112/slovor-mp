import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './switch';
import { Label } from './label';

const meta: Meta<typeof Switch> = {
    title: 'UI/Switch',
    component: Switch,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
    render: () => (
        <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
    ),
};

export const Checked: Story = {
    render: () => (
        <div className="flex items-center space-x-2">
            <Switch id="dark-mode" defaultChecked />
            <Label htmlFor="dark-mode">Dark Mode</Label>
        </div>
    ),
};

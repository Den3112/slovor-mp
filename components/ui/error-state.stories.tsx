import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorState } from './error-state';

const meta: Meta<typeof ErrorState> = {
    title: 'UI/ErrorState',
    component: ErrorState,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
    args: {
        message: 'Something went wrong',
    },
};

export const CustomMessage: Story = {
    args: {
        message: 'Failed to load data. Please check your internet connection and try again.',
    },
};

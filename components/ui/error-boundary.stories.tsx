import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorBoundary } from './error-boundary';
import { Button } from './button';
import React from 'react';

const meta: Meta<typeof ErrorBoundary> = {
    title: 'UI/ErrorBoundary',
    component: ErrorBoundary,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;


export const Default: Story = {
    render: () => (
        <ErrorBoundary>
            <div>Content works fine</div>
        </ErrorBoundary>
    ),
};

const BuggyComponent = () => {
    const [shouldThrow, setShouldThrow] = React.useState(false);
    if (shouldThrow) {
        throw new Error("Simulated Crash!");
    }
    return <Button variant="destructive" onClick={() => setShouldThrow(true)}>Crash me!</Button>;
}

export const Interactive: Story = {
    render: () => (
        <ErrorBoundary>
            <BuggyComponent />
        </ErrorBoundary>
    )
}

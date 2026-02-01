import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageTransition } from './page-transition';
import { Button } from './button';
import { useState } from 'react';

const meta: Meta<typeof PageTransition> = {
    title: 'UI/PageTransition',
    component: PageTransition,
    tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj = {
    render: () => {
        const [count, setCount] = useState(0);
        // Key change forces unmount/mount to trigger animation
        return (
            <div>
                <Button onClick={() => setCount(c => c + 1)} className="mb-4">Trigger Transition</Button>
                <PageTransition key={count}>
                    <div className="p-8 bg-card border rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-2">Animated Content {count}</h2>
                        <p className="text-muted-foreground">
                            This content fades and slides up when it appears.
                        </p>
                    </div>
                </PageTransition>
            </div>
        );
    },
};

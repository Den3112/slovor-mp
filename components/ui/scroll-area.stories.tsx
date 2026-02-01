import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './scroll-area';

const meta: Meta<typeof ScrollArea> = {
    title: 'UI/ScrollArea',
    component: ScrollArea,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
    render: () => (
        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
            <div className="text-sm">
                <h4 className="mb-4 font-medium leading-none">Tags</h4>
                {Array.from({ length: 50 }).map((_, i, a) => (
                    <React.Fragment key={i}>
                        <div className="text-sm">
                            Tag {i + 1}
                        </div>
                        {i < a.length - 1 && <hr className="my-2" />}
                    </React.Fragment>
                ))}
            </div>
        </ScrollArea>
    ),
};

import React from 'react';

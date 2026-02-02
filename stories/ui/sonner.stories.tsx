import type { Meta } from '@storybook/react-vite';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const meta: Meta<typeof Toaster> = {
    title: 'UI/Toast',
    component: Toaster,
    tags: ['autodocs'],
};

export default meta;

export const Default = {
    render: () => (
        <div>
            <Toaster />
            <Button
                onClick={() => toast.success('Event has been created', {
                    description: 'Monday, January 3rd at 10:00am',
                })}
            >
                Show Toast
            </Button>
        </div>
    ),
};

export const Error = {
    render: () => (
        <div>
            <Toaster />
            <Button
                variant="destructive"
                onClick={() => toast.error('Check your internet connection', {
                    description: 'We could not reach the server.',
                })}
            >
                Show Error Toast
            </Button>
        </div>
    ),
};

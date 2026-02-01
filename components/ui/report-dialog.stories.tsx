import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReportDialog } from './report-dialog';
import { Button } from './button';
import { useState } from 'react';

// Mock the Auth Context
export const _MockAuthProvider = ({ children, user }: { children: React.ReactNode; user: any }) => {
    // This is a simplified mock. In a real app, you might use a more robust mocking strategy
    // or the actual provider with mock data if possible.
    // Since ReportDialog likely uses useAuth internally, we might need to mock the hook import or wrap it.
    // For this story file, since we can't easily mock imports without addon-mocks,
    // we assume the component handles null user gracefully or we see the "login required" state.
    return <div data-user={user ? user.id : 'null'}>{children}</div>;
};

const meta: Meta<typeof ReportDialog> = {
    title: 'UI/ReportDialog',
    component: ReportDialog,
    tags: ['autodocs'],
};

export default meta;

const ReportDialogWrapper = (props: any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>Open Report Dialog</Button>
            <ReportDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                {...props}
            />
        </div>
    );
};

export const ReportListing: StoryObj<typeof ReportDialog> = {
    render: () => <ReportDialogWrapper listingId="123" />,
};

export const ReportUser: StoryObj<typeof ReportDialog> = {
    render: () => <ReportDialogWrapper userId="456" />,
};

// Note: To truly test authenticated vs unauthenticated states in Storybook without mocking the
// useAuth hook at the module level (which is hard in simple story files),
// we rely on the component's default behavior. If useAuth returns null by default in Storybook,
// we will see the "Sign In required" state.

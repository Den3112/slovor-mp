import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet';
import { Button } from './button';

const meta: Meta<typeof Sheet> = {
    title: 'UI/Sheet',
    component: Sheet,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    ),
};

export const LeftSide: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Open Left Sheet</Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>
                        Access all sections of the application here.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    ),
};

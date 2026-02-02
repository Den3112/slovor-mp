import type { Meta, StoryObj } from '@storybook/react-vite';
import { PriceDisplay } from '@/components/ui/price-display';

const meta: Meta<typeof PriceDisplay> = {
    title: 'UI/PriceDisplay',
    component: PriceDisplay,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PriceDisplay>;

export const Default: Story = {
    args: {
        amount: 1250,
    },
};

export const Large: Story = {
    args: {
        amount: 45000,
        baseCurrency: 'EUR',
        className: 'text-2xl font-bold text-primary',
    },
};

export const WithOriginal: Story = {
    args: {
        amount: 150,
        showOriginal: true,
    },
};

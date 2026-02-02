import type { Meta, StoryObj } from '@storybook/react-vite';
import { LocationCombobox } from '@/components/ui/location-combobox';
import { useState } from 'react';

const meta: Meta<typeof LocationCombobox> = {
    title: 'UI/LocationCombobox',
    component: LocationCombobox,
    tags: ['autodocs'],
};

export default meta;

const LocationComboboxWrapper = (props: any) => {
    const [value, setValue] = useState(props.value || '');
    return <LocationCombobox {...props} value={value} onChange={setValue} />;
}

export const Default: StoryObj<typeof LocationCombobox> = {
    render: () => <LocationComboboxWrapper />,
};

export const PreSelected: StoryObj<typeof LocationCombobox> = {
    render: () => <LocationComboboxWrapper value="Bratislava" />,
};

export const WithError: StoryObj<typeof LocationCombobox> = {
    render: () => <LocationComboboxWrapper error="Please select a valid city" />,
};

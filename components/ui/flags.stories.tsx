import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlagSK, FlagUS, FlagCZ, FlagRU } from './flags';

const meta: Meta = {
    title: 'UI/Flags',
    tags: ['autodocs'],
};

export default meta;

export const Slovakia: StoryObj = {
    render: () => <FlagSK className="h-10 w-16" />,
};

export const USA: StoryObj = {
    render: () => <FlagUS className="h-10 w-16" />,
};

export const CzechRepublic: StoryObj = {
    render: () => <FlagCZ className="h-10 w-16" />,
};

export const Russia: StoryObj = {
    render: () => <FlagRU className="h-10 w-16" />,
};

export const Grid = {
    render: () => (
        <div className="flex gap-4">
            <FlagSK className="h-8 w-12" />
            <FlagUS className="h-8 w-12" />
            <FlagCZ className="h-8 w-12" />
            <FlagRU className="h-8 w-12" />
        </div>
    )
}

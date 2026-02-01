import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AdminSidebar } from './admin-sidebar'

const meta: Meta<typeof AdminSidebar> = {
    title: 'Admin/Layout/Sidebar',
    component: AdminSidebar,
    parameters: {
        layout: 'fullscreen',
        // Mocking next/navigation
        nextjs: {
            appDirectory: true,
        },
    },
    decorators: [
        (Story: any) => (
            <div className="flex h-screen w-64">
                <Story />
            </div>
        )
    ]
}

export default meta
type Story = StoryObj<typeof AdminSidebar>

export const Default: Story = {}

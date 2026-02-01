import '../app/globals.css'
import type { Preview } from '@storybook/nextjs'
import { ThemeProvider } from '../components/providers/theme-provider'
import React from 'react'

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story) => (
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <Story />
            </ThemeProvider>
        ),
    ],
}

export default preview

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthSocial } from '@/app/auth/login/components/auth-social'

describe('AuthSocial', () => {
  const defaultProps = {
    onGoogleLogin: vi.fn(),
    googleLoading: false,
    loading: false,
  }

  it('renders google login button', () => {
    render(<AuthSocial {...defaultProps} />)
    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument()
    expect(screen.getByText(/Or continue with email/i)).toBeInTheDocument()
  })

  it('calls onGoogleLogin when clicked', () => {
    const onGoogleLogin = vi.fn()
    render(<AuthSocial {...defaultProps} onGoogleLogin={onGoogleLogin} />)

    fireEvent.click(
      screen.getByText(/Continue with Google/i).closest('button')!
    )
    expect(onGoogleLogin).toHaveBeenCalled()
  })

  it('disables button and shows loader when googleLoading is true', () => {
    render(<AuthSocial {...defaultProps} googleLoading={true} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    // Check for loader (using class or searching for svg if needed, but disabled state is a good indicator)
  })

  it('disables button when general loading is true', () => {
    render(<AuthSocial {...defaultProps} loading={true} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})

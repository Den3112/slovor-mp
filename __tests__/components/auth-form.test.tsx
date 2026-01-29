import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthForm } from '@/app/[lang]/auth/login/components/auth-form'

// Mock i18n
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: any = {
        'email': 'Email',
        'password': 'Password',
        'signIn': 'Sign In',
        'signUp': 'Sign Up',
        'dontHaveAccount': "Don't have an account?",
        'alreadyHaveAccount': 'Already have an account?',
        'showPassword': 'Show Password',
        'hidePassword': 'Hide Password',
      }
      return translations[key] || key
    },
  }),
}))

describe('AuthForm', () => {
  const defaultProps = {
    onSubmit: vi.fn((e) => e.preventDefault()),
    loading: false,
    googleLoading: false,
    isRegistering: false,
    showPassword: false,
    setShowPassword: vi.fn(),
    setIsRegistering: vi.fn(),
  }

  it('renders login form by default', () => {
    render(<AuthForm {...defaultProps} />)
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
    expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument()
  })

  it('renders register form when isRegistering is true', () => {
    render(<AuthForm {...defaultProps} isRegistering={true} />)
    expect(
      screen.getByRole('button', { name: /Sign Up/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument()
  })

  it('toggles password visibility when eye icon clicked', () => {
    const setShowPassword = vi.fn()
    render(<AuthForm {...defaultProps} setShowPassword={setShowPassword} />)

    const toggleButton = screen.getByRole('button', { name: /Show Password/i })
    fireEvent.click(toggleButton)
    expect(setShowPassword).toHaveBeenCalledWith(true)
  })

  it('calls onSubmit when form is submitted', () => {
    const onSubmit = vi.fn((e) => e.preventDefault())
    render(<AuthForm {...defaultProps} onSubmit={onSubmit} />)

    fireEvent.submit(
      screen.getByRole('button', { name: /Sign In/i }).closest('form')!
    )
    expect(onSubmit).toHaveBeenCalled()
  })

  it('disables submit button when loading', () => {
    const { container } = render(<AuthForm {...defaultProps} loading={true} />)
    const submitButton = container.querySelector('button[type="submit"]')
    expect(submitButton).toBeDisabled()
  })

  it('calls setIsRegistering when toggle link clicked', () => {
    const setIsRegistering = vi.fn()
    render(<AuthForm {...defaultProps} setIsRegistering={setIsRegistering} />)

    const toggleLink = screen.getByRole('button', { name: /Sign Up/i })
    fireEvent.click(toggleLink)
    expect(setIsRegistering).toHaveBeenCalledWith(true)
  })
})

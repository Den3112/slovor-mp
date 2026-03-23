import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StepImages } from '@/components/features/listing/ui/form-steps/step-images'

// Mock useTranslation
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: any = {
        uploadPhotos: 'Upload Photos',
        dragDrop: 'Drag and drop',
        selectImages: 'Select images',
        uploading: 'Uploading...',
        addMockImage: 'Add Mock Image',
      }
      return translations[key] || key
    },
  }),
}))

describe('StepImages', () => {
  const defaultProps = {
    formData: { images: [] } as any,
    isUploading: false,
    uploadProgress: null,
    onFilesSelected: vi.fn(),
    onRemoveImage: vi.fn(),
    onReorderImages: vi.fn(),
    onClearImages: vi.fn(),
  }

  it('renders upload area', () => {
    render(<StepImages {...defaultProps} />)
    expect(screen.getByText(/Drag and drop/i)).toBeInTheDocument()
    expect(screen.getByText(/Select images/i)).toBeInTheDocument()
  })

  it('shows loading state when isUploading is true', () => {
    render(<StepImages {...defaultProps} isUploading={true} />)
    expect(screen.getByText(/Uploading.../i)).toBeInTheDocument()
  })

  it('shows progress bar when uploadProgress is provided', () => {
    render(
      <StepImages
        {...defaultProps}
        uploadProgress={{ current: 5, total: 10 }}
      />
    )
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('calls onFilesSelected when file input changes', () => {
    const onFilesSelected = vi.fn()
    const { container } = render(
      <StepImages {...defaultProps} onFilesSelected={onFilesSelected} />
    )

    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })

    fireEvent.change(fileInput, { target: { files: [file] } })
    expect(onFilesSelected).toHaveBeenCalled()
  })

  it('renders previews and allows removal', () => {
    const onRemoveImage = vi.fn()
    const images = ['https://example.com/1.jpg', 'https://example.com/2.jpg']
    render(
      <StepImages
        {...defaultProps}
        formData={{ images } as any}
        onRemoveImage={onRemoveImage}
      />
    )

    const previews = screen.getAllByAltText('preview')
    expect(previews).toHaveLength(2)

    const removeButtons = screen
      .getAllByRole('button')
      .filter((btn: HTMLElement) => btn.querySelector('svg.lucide-trash2'))

    fireEvent.click(removeButtons[0]!)

    expect(onRemoveImage).toHaveBeenCalledWith(0)
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ImageGallery } from '@/components/listing/image-gallery'

describe('ImageGallery', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ]
  const mockTitle = 'Test Listing'

  it('renders the first image by default', () => {
    render(<ImageGallery images={mockImages} title={mockTitle} />)
    const mainImage = screen.getByAltText(`${mockTitle} - Image 1`)
    expect(mainImage).toBeInTheDocument()
    expect(mainImage).toHaveAttribute('src', mockImages[0])
  })

  it('renders navigation arrows when multiple images exist', () => {
    render(<ImageGallery images={mockImages} title={mockTitle} />)
    expect(screen.getByLabelText('Previous image')).toBeInTheDocument()
    expect(screen.getByLabelText('Next image')).toBeInTheDocument()
  })

  it('does not render navigation arrows for a single image', () => {
    render(<ImageGallery images={[mockImages[0]!]} title={mockTitle} />)
    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument()
  })

  it('changes image when clicking "Next"', () => {
    render(<ImageGallery images={mockImages} title={mockTitle} />)
    const nextButton = screen.getByLabelText('Next image')
    fireEvent.click(nextButton)

    const secondImage = screen.getByAltText(`${mockTitle} - Image 2`)
    expect(secondImage).toBeInTheDocument()
    expect(secondImage).toHaveAttribute('src', mockImages[1])
  })

  it('wraps around to the first image when clicking "Next" on the last image', () => {
    render(<ImageGallery images={mockImages} title={mockTitle} />)
    const nextButton = screen.getByLabelText('Next image')

    // Go to 2nd
    fireEvent.click(nextButton)
    // Go to 3rd
    fireEvent.click(nextButton)
    // Wrap to 1st
    fireEvent.click(nextButton)

    const firstImage = screen.getByAltText(`${mockTitle} - Image 1`)
    expect(firstImage).toBeInTheDocument()
  })

  it('renders thumbnails and allow selection', () => {
    render(<ImageGallery images={mockImages} title={mockTitle} />)
    const thumbnails = screen.getAllByRole('button', { name: /View image/i })
    expect(thumbnails).toHaveLength(3)

    fireEvent.click(thumbnails[2]!)
    const thirdImage = screen.getByAltText(`${mockTitle} - Image 3`)
    expect(thirdImage).toBeInTheDocument()
  })

  it('shows no images message when list is empty', () => {
    render(<ImageGallery images={[]} title={mockTitle} />)
    expect(screen.getByText('No images available')).toBeInTheDocument()
  })
})

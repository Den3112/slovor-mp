// Storage API
// Centralized API layer for Supabase Storage operations

import type { ApiResponse } from '@/shared/lib/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface UploadedFile {
  path: string
  url: string
  size: number
  mimeType: string
}

/**
 * Storage API for file uploads and management
 * Bucket: listings-images (must be created in Supabase Dashboard)
 */
export const storageApi = {
  /**
   * @param file - File object to upload
   * @param userId - User ID for organizing uploads
   * @param bucket - Storage bucket name (default: 'listings-images')
   * @returns Public URL or error
   */
  async uploadImage(
    client: SupabaseClient,
    file: File,
    userId: string,
    bucket: string = 'listings-images'
  ): Promise<ApiResponse<UploadedFile>> {
    try {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
      ]
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
        )
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit.')
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()
      const fileName = `${userId}/${timestamp}-${randomStr}.${extension}`

      // Upload file
      const { data, error: uploadError } = await client.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = client.storage.from(bucket).getPublicUrl(fileName)

      const uploadedFile: UploadedFile = {
        path: data.path,
        url: publicUrl,
        size: file.size,
        mimeType: file.type,
      }

      return { data: uploadedFile, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Uploads multiple images
   * @param files - Array of File objects
   * @param userId - User ID
   * @returns Array of uploaded files or error
   */
  async uploadImages(
    client: SupabaseClient,
    files: File[],
    userId: string,
    onProgress?: (current: number, total: number, fileName?: string) => void
  ): Promise<ApiResponse<UploadedFile[]>> {
    try {
      const uploadedFiles: UploadedFile[] = []
      const errors: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file) {
          continue
        }

        if (onProgress) {
          onProgress(i, files.length, file.name)
        }

        const result = await this.uploadImage(client, file, userId)

        if (result.error) {
          errors.push(`File ${file.name}: ${result.error}`)
        } else if (result.data) {
          uploadedFiles.push(result.data)
        }

        if (onProgress) {
          onProgress(i + 1, files.length, file.name)
        }
      }

      if (errors.length > 0 && uploadedFiles.length === 0) {
        throw new Error(errors.join(', '))
      }

      if (errors.length > 0) {
        // Partial success - some files failed
        console.warn('Some files failed to upload:', errors)
      }

      // By contract ApiResponse<T> either returns data or error, but not both
      return { data: uploadedFiles, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Deletes an image from Supabase Storage
   * @param path - File path in storage
   */
  async deleteImage(
    client: SupabaseClient,
    path: string
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await client.storage
        .from('listings-images')
        .remove([path])

      if (error) {
        throw error
      }

      return { data: undefined, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Deletes multiple images
   * @param paths - Array of file paths
   */
  async deleteImages(
    client: SupabaseClient,
    paths: string[]
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await client.storage
        .from('listings-images')
        .remove(paths)

      if (error) {
        throw error
      }

      return { data: undefined, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },
}

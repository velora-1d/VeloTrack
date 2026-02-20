import { createClient } from '@/utils/supabase/server'

const BUCKET_NAME = 'documents'

/**
 * Upload file PDF ke Supabase Storage
 * Path: documents/{type}/{year}/{filename}.pdf
 */
export async function uploadDocumentPDF(
    fileBuffer: Buffer | Uint8Array,
    fileName: string,
    type: string
): Promise<string | null> {
    const supabase = await createClient()
    const year = new Date().getFullYear()
    const path = `${type}/${year}/${fileName}`

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, fileBuffer, {
            contentType: 'application/pdf',
            upsert: true,
        })

    if (error) {
        console.error('Upload error:', error)
        return null
    }

    // Dapatkan public URL
    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path)

    return urlData.publicUrl
}

/**
 * Hapus file PDF dari Supabase Storage
 */
export async function deleteDocumentPDF(fileUrl: string): Promise<boolean> {
    const supabase = await createClient()

    // Ekstrak path dari URL
    const urlParts = fileUrl.split(`${BUCKET_NAME}/`)
    if (urlParts.length < 2) return false

    const path = urlParts[1]
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path])

    if (error) {
        console.error('Delete error:', error)
        return false
    }

    return true
}

/**
 * Dapatkan signed URL untuk download (berlaku 1 jam)
 */
export async function getDocumentDownloadUrl(fileUrl: string): Promise<string | null> {
    const supabase = await createClient()

    const urlParts = fileUrl.split(`${BUCKET_NAME}/`)
    if (urlParts.length < 2) return null

    const path = urlParts[1]
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(path, 3600) // 1 jam

    if (error) {
        console.error('Signed URL error:', error)
        return null
    }

    return data.signedUrl
}

import { createAdminClient } from './admin'

export async function ensureAvatarsBucket() {
    const adminSupabase = createAdminClient()

    try {
        // Check if avatars bucket exists
        const { data: buckets, error: bucketsError } = await adminSupabase.storage.listBuckets()
        if (bucketsError) {
            console.error('Error listing buckets:', bucketsError)
            throw new Error('Failed to access storage buckets')
        }

        const avatarsBucket = buckets?.find(bucket => bucket.name === 'avatars')
        if (!avatarsBucket) {
            console.log('Avatars bucket not found, creating it...')

            // Create the avatars bucket using admin client
            const { data: newBucket, error: createError } = await adminSupabase.storage.createBucket('avatars', {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
                fileSizeLimit: 5 * 1024 * 1024 // 5MB
            })

            if (createError) {
                console.error('Error creating avatars bucket:', createError)
                // Check if the error is because the bucket already exists
                if (createError.message?.includes('already exists') || createError.message?.includes('duplicate')) {
                    console.log('Bucket already exists, continuing...')
                    return true
                } else {
                    throw new Error(`Failed to create storage bucket: ${createError.message}`)
                }
            } else {
                console.log('Avatars bucket created successfully')
                return true
            }
        } else {
            console.log('Avatars bucket already exists')
            return true
        }
    } catch (error) {
        console.error('Error ensuring avatars bucket:', error)
        throw error
    }
}

#!/usr/bin/env node

/**
 * Script to set up Supabase storage buckets and policies
 * Run this script to create the avatars bucket if it doesn't exist
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase configuration')
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
    try {
        console.log('🔍 Checking existing buckets...')

        // List existing buckets
        const { data: buckets, error: listError } = await supabase.storage.listBuckets()

        if (listError) {
            console.error('❌ Error listing buckets:', listError.message)
            return
        }

        console.log('📦 Existing buckets:', buckets?.map(b => b.name).join(', ') || 'None')

        // Check if avatars bucket exists
        const avatarsBucket = buckets?.find(bucket => bucket.name === 'avatars')

        if (avatarsBucket) {
            console.log('✅ Avatars bucket already exists')
            console.log('📋 Bucket details:', JSON.stringify(avatarsBucket, null, 2))
        } else {
            console.log('🔨 Creating avatars bucket...')

            // Create avatars bucket
            const { data: bucketData, error: createError } = await supabase.storage.createBucket('avatars', {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
                fileSizeLimit: 5242880 // 5MB
            })

            if (createError) {
                console.error('❌ Error creating bucket:', createError.message)
                return
            }

            console.log('✅ Avatars bucket created successfully')
            console.log('📋 Bucket details:', JSON.stringify(bucketData, null, 2))
        }

        // Test upload a small file
        console.log('🧪 Testing file upload...')
        const testFile = new File(['test'], 'test.txt', { type: 'text/plain' })
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(`test-${Date.now()}.txt`, testFile)

        if (uploadError) {
            console.error('❌ Test upload failed:', uploadError.message)
        } else {
            console.log('✅ Test upload successful')
            console.log('📋 Upload details:', JSON.stringify(uploadData, null, 2))

            // Clean up test file
            await supabase.storage.from('avatars').remove([uploadData.path])
            console.log('🧹 Test file cleaned up')
        }

        console.log('🎉 Storage setup completed!')

    } catch (error) {
        console.error('❌ Unexpected error:', error.message)
    }
}

setupStorage()

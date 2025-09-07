-- More Specific Supabase Storage RLS Policies for Avatars Bucket
-- This version includes user-specific file access control

-- First, drop any existing policies for the avatars bucket
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;

-- Policy 1: Allow authenticated users to upload files to avatars bucket
-- File naming pattern: avatars/{user_id}-{timestamp}.{ext}
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = split_part(split_part(name, '/', 2), '-', 1)
);

-- Policy 2: Allow users to view their own avatar files
CREATE POLICY "Users can view their own avatars" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = split_part(split_part(name, '/', 2), '-', 1)
);

-- Policy 3: Allow users to update their own avatar files
CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = split_part(split_part(name, '/', 2), '-', 1)
);

-- Policy 4: Allow users to delete their own avatar files
CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = split_part(split_part(name, '/', 2), '-', 1)
);

-- Policy 5: Allow public access to view avatar files (for public URLs)
-- This allows anyone to view avatar files via public URLs
CREATE POLICY "Public can view avatars" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'avatars'
);

-- Alternative simpler policies (if the above don't work)
-- Uncomment these if you want simpler, less restrictive policies:

/*
-- Simple policy: Allow all authenticated users to manage avatars
CREATE POLICY "Authenticated users can manage avatars" ON storage.objects
FOR ALL USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- Simple policy: Allow public read access to avatars
CREATE POLICY "Public can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
*/

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

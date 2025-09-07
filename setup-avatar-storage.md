# Avatar Storage Setup Guide

## Environment Variables ✅
Your environment variables are already properly configured:
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅  
- `SUPABASE_SERVICE_ROLE_KEY` ✅
- `DATABASE_URL` ✅

## Required Supabase Configuration

### Step 1: Configure Storage Policies

You need to run SQL policies in your Supabase dashboard to allow file uploads. Choose one of these options:

#### Option A: Simple Policies (Recommended for testing)
```sql
-- Allow all authenticated users to manage avatars
CREATE POLICY "Authenticated users can manage avatars" ON storage.objects
FOR ALL USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access to avatars
CREATE POLICY "Public can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

#### Option B: User-Specific Policies (More secure)
Use the content from `supabase-storage-policies-detailed.sql` file.

### Step 2: How to Apply the Policies

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `kpznrvcsgsnjtxquulzs`
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the SQL from Option A above
5. Click **Run** to execute the policies

### Step 3: Verify the Setup

1. The avatars bucket should already exist (created by our code)
2. The RLS policies should now allow file uploads
3. Test the avatar upload functionality

## Troubleshooting

If you still get RLS errors:

1. **Check if policies exist:**
   ```sql
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
   FROM pg_policies 
   WHERE tablename = 'objects' AND schemaname = 'storage';
   ```

2. **Check bucket permissions:**
   ```sql
   SELECT * FROM storage.buckets WHERE name = 'avatars';
   ```

3. **Test with a simple policy:**
   ```sql
   -- Temporarily disable RLS for testing
   ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
   -- Test upload, then re-enable:
   ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
   ```

## Files Created
- `supabase-storage-policies.sql` - Basic policies
- `supabase-storage-policies-detailed.sql` - User-specific policies
- `setup-avatar-storage.md` - This guide

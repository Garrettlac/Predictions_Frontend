# Supabase Database Setup

## Quick Setup Instructions

### 1. Run the SQL Schema

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project: `odnyszmbyglgqleryupx`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase_schema.sql`
6. Paste into the SQL editor
7. Click **Run** (or press `Ctrl+Enter`)

### 2. Verify the Setup

After running the SQL, verify that:

1. **Table Created**: Go to **Table Editor** → You should see a `profiles` table
2. **Columns**: The table should have:
   - `id` (uuid, primary key)
   - `email` (text, unique)
   - `username` (text, unique)
   - `first_name` (text)
   - `last_name` (text)
   - `birthday` (date)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

3. **Policies**: Go to **Authentication** → **Policies** → `profiles` table should have RLS enabled with 3 policies:
   - Users can read own profile
   - Users can insert own profile
   - Users can update own profile

### 3. Test the Integration

1. Start your Next.js dev server: `npm run dev`
2. Navigate to the signup page
3. Fill in all fields (first name, last name, email, username, birthday, password)
4. Submit the form
5. Check Supabase:
   - **Authentication** → **Users** should show the new user
   - **Table Editor** → **profiles** should show the user's profile data

## Database Schema Details

### Profiles Table

```sql
profiles (
  id UUID PRIMARY KEY,           -- References auth.users(id)
  email TEXT UNIQUE NOT NULL,    -- User's email
  username TEXT UNIQUE NOT NULL, -- Unique username
  first_name TEXT NOT NULL,      -- First name
  last_name TEXT NOT NULL,       -- Last name
  birthday DATE NOT NULL,        -- Date of birth
  created_at TIMESTAMPTZ,        -- Account creation timestamp
  updated_at TIMESTAMPTZ         -- Last update timestamp
)
```

### Security

- **Row Level Security (RLS)** is enabled
- Users can only access their own profile data
- Automatic `updated_at` timestamp on profile updates
- Foreign key constraint ensures profiles are deleted when auth users are deleted

### Indexes

- `username` - For fast username lookups
- `email` - For fast email lookups

## Troubleshooting

### "relation already exists" error
- This means the table is already created. You can skip the schema setup or drop the existing table first.

### "permission denied" error
- Make sure you're running the SQL as the project owner in Supabase dashboard

### Profile creation fails during signup
- Check the **Logs** section in Supabase dashboard
- Verify the `profiles` table exists
- Ensure RLS policies are correctly set up

## Next Steps

After successful setup:
1. Users can sign up with complete profile information
2. Profile data is stored securely in Supabase
3. Authentication and profile management are handled automatically
4. You can query profile data using the Supabase client:

```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
```

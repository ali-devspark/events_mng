# Supabase Setup Guide

This guide will walk you through setting up Supabase authentication for this project.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in your project details:
   - **Name**: Choose a name for your project
   - **Database Password**: Create a strong password
   - **Region**: Select the closest region to your users
4. Click **"Create new project"**
5. Wait for the project to be provisioned (1-2 minutes)

## 2. Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")
3. Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Configure Email Authentication

### Enable Email Provider

1. Go to **Authentication** → **Providers**
2. Find **Email** in the list
3. Toggle **"Enable Email provider"** to ON
4. Click **"Save"**

### Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. You can customize the following templates:
   - **Confirm signup**: Sent when users register
   - **Reset password**: Sent for password reset requests
   - **Magic Link**: For passwordless login (optional)

#### Customize Confirmation Email (Optional)

```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

#### Customize Reset Password Email (Optional)

```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

### Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your redirect URLs:
   - **Site URL**: `http://localhost:3000` (development) or your production URL
   - **Redirect URLs**: Add the following URLs (one per line):
     ```
     http://localhost:3000/**
     http://localhost:3000/verify-email
     http://localhost:3000/reset-password
     http://localhost:3000/dashboard
     ```
3. For production, add your production URLs:
     ```
     https://yourdomain.com/**
     https://yourdomain.com/verify-email
     https://yourdomain.com/reset-password
     https://yourdomain.com/dashboard
     ```

### Email Settings

1. Go to **Authentication** → **Settings**
2. Configure the following:
   - **Enable email confirmations**: Toggle ON (users must verify email)
   - **Secure email change**: Toggle ON (recommended)
   - **Double confirm email changes**: Toggle ON (recommended)

## 4. Configure Phone Authentication

> [!WARNING]
> Phone authentication requires an SMS provider and may incur costs.

### Enable Phone Provider

1. Go to **Authentication** → **Providers**
2. Find **Phone** in the list
3. Toggle **"Enable Phone provider"** to ON

### Configure SMS Provider

Supabase supports multiple SMS providers. Choose one:

#### Option A: Twilio (Recommended)

1. Create a [Twilio account](https://www.twilio.com/try-twilio)
2. Get your Twilio credentials:
   - Account SID
   - Auth Token
   - Phone Number
3. In Supabase, go to **Authentication** → **Providers** → **Phone**
4. Select **Twilio** as your provider
5. Enter your Twilio credentials
6. Click **"Save"**

#### Option B: MessageBird

1. Create a [MessageBird account](https://messagebird.com)
2. Get your API key
3. In Supabase, select **MessageBird** as your provider
4. Enter your API key
5. Click **"Save"**

#### Option C: Vonage (Nexmo)

1. Create a [Vonage account](https://www.vonage.com)
2. Get your API credentials
3. In Supabase, select **Vonage** as your provider
4. Enter your credentials
5. Click **"Save"**

### Phone Authentication Settings

1. Go to **Authentication** → **Settings**
2. Configure:
   - **Minimum password length**: 6 characters (default)
   - **OTP expiry**: 60 seconds (default)
   - **OTP length**: 6 digits (default)

## 5. Security Settings

### Rate Limiting

1. Go to **Authentication** → **Rate Limits**
2. Configure rate limits to prevent abuse:
   - **Email/Password**: 5 attempts per hour (recommended)
   - **Phone OTP**: 3 attempts per hour (recommended)
   - **Password Reset**: 3 attempts per hour (recommended)

### Session Settings

1. Go to **Authentication** → **Settings**
2. Configure session settings:
   - **JWT expiry**: 3600 seconds (1 hour)
   - **Refresh token rotation**: Toggle ON (recommended)
   - **Reuse interval**: 10 seconds

## 6. Testing Your Setup

### Test Email Authentication

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/register`
3. Register with a test email
4. Check your email for verification link
5. Click the link to verify
6. Try logging in at `http://localhost:3000/login`

### Test Phone Authentication

1. Go to `http://localhost:3000/phone-auth`
2. Enter a phone number with country code (e.g., +1234567890)
3. Check your phone for the OTP
4. Enter the code to verify

### Test Password Reset

1. Go to `http://localhost:3000/forgot-password`
2. Enter your email
3. Check your email for reset link
4. Click the link and set a new password

## 7. Production Deployment

### Update Environment Variables

When deploying to production, update your environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Update Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your production URLs to the redirect URLs list
3. Update the Site URL to your production domain

### Enable Additional Security

1. Go to **Authentication** → **Settings**
2. Consider enabling:
   - **CAPTCHA protection** (for production)
   - **Email rate limiting**
   - **Advanced security features**

## 8. Monitoring & Logs

### View Authentication Logs

1. Go to **Authentication** → **Users**
2. View all registered users
3. Check user metadata and authentication methods

### Monitor Usage

1. Go to **Settings** → **Usage**
2. Monitor:
   - Monthly Active Users (MAU)
   - API requests
   - Storage usage

## Troubleshooting

### Email Verification Not Working

- Check spam/junk folder
- Verify email templates are configured
- Check redirect URLs are correct
- Ensure email confirmations are enabled

### Phone OTP Not Received

- Verify SMS provider credentials
- Check phone number format (must include country code)
- Verify SMS provider has sufficient credits
- Check Supabase logs for errors

### "Invalid API key" Error

- Verify you're using the **anon/public** key, not the service role key
- Check that credentials in `.env.local` match your Supabase dashboard
- Restart your development server after changing environment variables

### Users Can't Access Protected Routes

- Check middleware configuration in `middleware.ts`
- Verify session is being created on login
- Check browser cookies are enabled
- Clear browser cookies and try again

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase Phone Auth](https://supabase.com/docs/guides/auth/phone-login)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

## Support

If you encounter issues:
1. Check the [Supabase Discord](https://discord.supabase.com)
2. Review [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
3. Check the project's README.md for common issues

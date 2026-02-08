'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An authentication error occurred.';
  let explanation = 'Please try signing in again.';

  if (error === 'Configuration') {
    errorMessage = 'Configuration Error';
    explanation = 'There is a problem with the server configuration. This usually means the database table is missing or the connection failed.';
  } else if (error === 'AccessDenied') {
    errorMessage = 'Access Denied';
    explanation = 'You do not have permission to sign in.';
  } else if (error === 'Verification') {
    errorMessage = 'Verification Error';
    explanation = 'The sign in link is no longer valid. It may have been used already or it may have expired.';
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#000',
      color: '#fff',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ff4d4d' }}>{errorMessage}</h1>
      <p style={{ marginBottom: '2rem', color: '#ccc' }}>{explanation}</p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/login" style={{
          padding: '0.75rem 1.5rem',
          background: '#fff',
          color: '#000',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Try Again
        </Link>
        <Link href="/" style={{
          padding: '0.75rem 1.5rem',
          border: '1px solid #333',
          color: '#fff',
          borderRadius: '0.5rem',
          textDecoration: 'none'
        }}>
          Go Home
        </Link>
      </div>
      
      {error === 'Configuration' && (
        <div style={{ marginTop: '3rem', padding: '1rem', background: '#111', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#666', maxWidth: '400px' }}>
          <p><strong>Developer Note:</strong> If you are the owner, check your Vercel logs. Ensure your Database is connected and Schema is pushed.</p>
        </div>
      )}
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading error...</div>}>
      <ErrorContent />
    </Suspense>
  );
}

'use client';

import axios from 'axios';
import { isAxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, Suspense } from 'react';
import { Loader2 } from "lucide-react";

function SilentRefreshContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const refreshLock = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 2;
  
  useEffect(() => {
    async function refreshTokens() {
      if (refreshLock.current) {
        console.log('[RefreshToken] Refresh already in progress, skipping duplicate call');
        return;
      }
      
      if (retryCount.current >= maxRetries) {
        console.log('[RefreshToken] Max retries reached, redirecting to sign-in');
        router.replace('/sign-in');
        return;
      }
      
      refreshLock.current = true;
      retryCount.current += 1;
      console.log('[RefreshToken] Starting token refresh, attempt:', retryCount.current);

      try {
        console.log('[RefreshToken] document.cookie:', document.cookie);

        const res = await axios.post('/api/auth/refresh-token', null, {
          withCredentials: true,
        });

        console.log('[RefreshToken] Refresh token response status:', res.status);

        if (res.status === 200) {
          console.log('[RefreshToken] Token refresh successful, redirecting...');
          refreshLock.current = false;
          router.replace(from);
          return;
        } else {
          console.warn('[RefreshToken] Token refresh returned unexpected status:', res.status);
          refreshLock.current = false;
          router.replace('/sign-in');
          return;
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          console.error('[RefreshToken] Refresh token request failed:', error.response?.status || error.message);
          
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('[RefreshToken] Refresh token invalid/expired, redirecting to sign-in');
            refreshLock.current = false;
            router.replace('/sign-in');
            return;
          }
        } else if (error instanceof Error) {
          console.error('[RefreshToken] Refresh token request failed:', error.message);
        } else {
          console.error('[RefreshToken] Refresh token request failed:', error);
        }
        
        if (retryCount.current < maxRetries) {
          console.log('[RefreshToken] Retrying...');
          setTimeout(() => {
            refreshLock.current = false;
            refreshTokens();
          }, 1000 * retryCount.current);
        } else {
          refreshLock.current = false;
          router.replace('/sign-in');
        }
      }
    }

    refreshTokens();

    return () => {
      refreshLock.current = false;
    };
  }, [from, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
    </div>
  );
}

export default function SilentRefreshPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-10 w-10 text-primary animate-spin" /></div>}>
      <SilentRefreshContent />
    </Suspense>
  );
}

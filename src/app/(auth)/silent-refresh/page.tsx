'use client';

import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Loader2 } from "lucide-react";

export default function SilentRefreshPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const refreshLock = useRef(false);

  useEffect(() => {
    async function refreshTokens() {
      if (refreshLock.current) {
        console.log('[RefreshToken] Refresh already in progress, skipping duplicate call');
        return;
      }
      refreshLock.current = true;
      console.log('[RefreshToken] Starting token refresh');

      try {
        console.log('[RefreshToken] document.cookie:', document.cookie);

        const res = await axios.post('/api/auth/refresh-token', null, {
          withCredentials: true,
        });

        console.log('[RefreshToken] Refresh token response status:', res.status);

        if (res.status === 200) {
          console.log('[RefreshToken] Token refresh successful, redirecting...');
          router.replace(from);
        } else {
          console.warn('[RefreshToken] Token refresh returned unexpected status:', res.status);
          router.replace('/sign-in');
        }
      } catch (error: any) {
        console.error('[RefreshToken] Refresh token request failed:', error.response?.status || error.message);
        router.replace('/sign-in');
      } finally {
        refreshLock.current = false;
      }
    }

    refreshTokens();
  }, [from, router]);

  return <div className="flex items-center justify-center min-h-screen">
  <Loader2 className="h-10 w-10 text-primary animate-spin" />
</div>

}

'use client';

import { useEffect } from 'react';
import ErrorPage from '@/components/paper/ErrorPage';
import Button from '@/components/ui/Button';
import { errorCopy } from '@/content/site';

type Props = { error: Error & { digest?: string }; retry: () => void };

/** Runtime errors under the root layout. The message stays in the console, never on the page. */
export default function Error({ error, retry }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <ErrorPage
      title={errorCopy.error.title}
      line={errorCopy.error.line}
      action={
        <Button variant="secondary" onClick={retry}>
          {errorCopy.error.retry}
        </Button>
      }
    />
  );
}

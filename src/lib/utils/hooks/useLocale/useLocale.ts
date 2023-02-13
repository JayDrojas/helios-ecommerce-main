import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import getLangCode from '../../get-lang-code';

export default function useLocale() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState(router.locale);
  useEffect(() => {
    setCurrentLocale(router.locale);
  }, [router]);

  return {
    locale: currentLocale ?? 'en',
    languageCode: getLangCode(currentLocale ?? 'en')
  };
}

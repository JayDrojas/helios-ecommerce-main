import { useEffect } from 'react';
import type { EffectCallback } from 'react';

export default function useMountEffect(callback: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
}

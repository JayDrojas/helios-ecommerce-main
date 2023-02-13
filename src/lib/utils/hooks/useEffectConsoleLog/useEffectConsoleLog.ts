import { useEffect } from 'react';

export default function useEffectConsoleLog(label: string, state: any) {
  return useEffect(() => console.log(label, state), [label, state]);
}

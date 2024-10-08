import { CoinbaseWalletSDK, Preference } from '@coinbase/wallet-sdk';
import { useEffect, useMemo, useState } from 'react';
import { EIP1193Provider } from '@/types';

const defaultPreference: Preference = { options: 'eoaOnly' };

export const appChainIds = [1, 137, 42161, 10, 8453];

export default function useCoinbaseWalletSignerProvider(
  preference: Preference = defaultPreference,
): {
  provider?: EIP1193Provider;
} {
  const [coinbaseWallet, setCoinbaseWallet] = useState<CoinbaseWalletSDK | null>(null);

  useEffect(() => {
    console.log('setCoinbaseWallet');
    setCoinbaseWallet(
      new CoinbaseWalletSDK({
        appName: 'L1',
        appLogoUrl: 'https://l1.co/logo512.png',
        appChainIds,
      }),
    );
  }, []);

  const provider = useMemo(() => {
    const provider = coinbaseWallet?.makeWeb3Provider(preference);

    console.log('makeWeb3Provider', provider);

    return provider;
  }, [coinbaseWallet, preference]);

  return { provider };
}

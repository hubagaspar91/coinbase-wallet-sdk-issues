import { useCallback, useState } from 'react';
import { numberToHex } from 'viem';
import {EIP1193Provider} from "@/types";

export const switchChainRequestIgnoredError = new Error('Switch chain request ignored');

export default function useSafeSignerAccount() {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [chainId, setChainId] = useState<number | undefined>();
  const [provider, setProvider] = useState<EIP1193Provider | undefined>();

  const getChainId = useCallback(
    async (_provider?: EIP1193Provider) => {
      const provider_ = _provider || provider;

      if (!provider_) {
        throw new Error('Provider not found');
      }

      const chainId: string = await provider_.request({
        method: 'eth_chainId',
        params: [],
      });

      const chainIdInt = parseInt(chainId, 16);

      setChainId(chainIdInt);

      return chainIdInt;
    },
    [provider],
  );

  const disconnect = useCallback(async () => {
    if (!provider) {
      throw new Error('Provider not found');
    }

    try {
     await (provider as any).disconnect();
    } catch (e) {
      console.log('error disconnecting', e);
    }

    console.log('disconnected');

    setAddresses([]);
    setChainId(undefined);
    setProvider(undefined);
  }, [provider]);

  const connect = useCallback(
    async (_provider?: EIP1193Provider) => {
      if (!_provider) {
        throw new Error('Provider not found');
      }

      // disabling events so wagmi doesn't pick this up
      const events = (_provider as any)._events || (_provider as any).events;
      let onAccountsChanged = events?.accountsChanged;
      if (onAccountsChanged) {
        delete events.accountsChanged;
      }

      const addresses: string[] = await _provider.request({
        method: 'eth_requestAccounts',
        params: [],
      });

      // after connecting, re-enable events
      if (onAccountsChanged) {
        events.accountsChanged = onAccountsChanged;
      }

      const chainId = await getChainId(_provider);

      console.log('connected with addresses and chainId', addresses, chainId);

      setProvider(_provider);
      setAddresses(addresses);

      return {
        addresses,
        chainId,
      };
    },
    [getChainId],
  );

  const switchChain = useCallback(
    async (_chainId: number) => {
      console.log('switching chain to', _chainId);
      if (!provider) {
        throw new Error('Provider not found');
      }

      console.log('switching chain with', provider);

      const resp = await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: numberToHex(_chainId) }],
      });

      console.log('switch chain resp', resp);

      // checking if the switch actually occurred
      // getChainId also sets the chainId, so no need for an additional set
      const newChainId = await getChainId();

      if (newChainId !== _chainId) {
        // with coinbase wallet connected through mobile, the switch chain request is sometimes simply ignored
        // no way to retry or fix, it seems, only refreshing the page works
        throw switchChainRequestIgnoredError;
      }
    },
    [getChainId, provider],
  );

  return {
    connect,
    disconnect,
    getChainId,
    switchChain,
    addresses,
    chainId,
    provider,
  };
}

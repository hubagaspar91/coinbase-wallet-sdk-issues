'use client';

import useCoinbaseWalletSignerProvider, {appChainIds} from "@/hooks/useCoinbaseWalletSignerProvider";
import useSafeSignerAccount from "@/hooks/useSafeSignerAccount";
import {useEffect} from "react";

export default function Home() {
  const { provider } = useCoinbaseWalletSignerProvider();
  const { connect, disconnect, switchChain, addresses, chainId, getChainId } = useSafeSignerAccount();

  useEffect(() => {
    console.log('provider', provider);
  }, [provider]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button disabled={!provider} onClick={() => connect(provider)}>Connect Wallet</button>
      <button disabled={!addresses.length} onClick={disconnect}>Disconnect Wallet</button>
      <button disabled={!addresses.length} onClick={() => getChainId()}>Refresh ChainId</button>
      <h2>Connected to chainId: {chainId}</h2>
      {appChainIds.map((chainId) => (
        <button key={chainId} disabled={!addresses.length} onClick={() => switchChain(chainId)}>
          Switch to {chainId}
        </button>
      ))}
    </main>
  );
}

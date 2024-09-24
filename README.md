## Minimal repo for reproducing issues with Coinbase Wallet SDK

### Environment
- OS: MacOS 13.4 (22F66) (Ventura)
- Browser: Chrome 128.0.6613.84
- Mobile OS: iOS 17.5.1
- Coinbase Wallet Mobile App: v29.9
- Built with: Node v20.10.0
- Coinbase Wallet SDK: v4.0.4
- Next.js v14.1.0

### Description
Due to the nature of our product, in some instances, I have to connect wallets temporarily outside of Wagmi, using wallet RPC providers, such as what is returned by the `makeWeb3Provider` method of the `CoinbaseWalletSDK`.

The code in this repo is the base hooks handling wallet connections over EIP1193 providers.

There is an issue that I am experiencing, or rather, a set of different issues which are related, and have to do with unreliable behavior of the provider after calling `disconnect`.

`wallet_switchEthereumChain` calls sometimes get simply ignored, but they throw no errors - I basically call `eth_chainId` right after the `wallet_switchEthereumChain` call, and the chainId is still the same as before the call. 

This mainly 
### Steps to reproduce
1. Disable the Coinbase Wallet browser extension if it's installed.
2. Click `Connect Wallet`.
3. Connect with a wallet hosted in the Coinbase Wallet mobile app, by reading the QR code.
4. Start switching chains by clicking the buttons in the UI.
5. At this point, you might already get a `switchChainRequestIgnoredError` error, after 5-10 switches, but if not, proceed to the next step.
6. Disconnect the wallet by clicking the `Disconnect Wallet` button.
7. Try to connect it again by reading the QR code from your app.
8. At this step, the connection process fails, after reading the QR either the mobile app does not receive the connection request, or the browser connection popup doesn't close after accepting in the app.
9. This issue is fixed after refreshing the page, however, if you connect again, and try switching chains again a few times, it will throw `switchChainRequestIgnoredError`s after a few tries intermittently.

The `switchChainRequestIgnoredError` is shown, when I call `eth_chainId` right after the `wallet_switchEthereumChain` call succeeds, and the chainId returned by `eth_chainId` is still the previous one and not the one I just switched to.

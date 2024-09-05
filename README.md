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

There are 2, easily reproducible & connected issues when connecting to a wallet hosted in the Coinbase Wallet mobile app, without having the browser extension installed.

`wallet_switchEthereumChain` calls sometimes get simply ignored, but they throw no errors - I basically call `eth_chainId` right after the `wallet_switchEthereumChain` call, and the chainId is still the same as before the call. 

Also, after this happens, and I disconnect and try to connect again, the browser popup is never closed and the connection is never established.

### Steps to reproduce
1. Disable the Coinbase Wallet browser extension if it's installed.
2. Click `Connect Wallet`.
3. Connect with a wallet hosted in the Coinbase Wallet mobile app, by reading the QR code.
4. Start switching chains by clicking the buttons in the UI.
5. After 3-10 clicks, you'll see one of the calls failing silently, the rpc method resolving successfully with `null`, but not actually switching chains.
6. If you keep switching chains, you'll likely see the call sometimes failing and sometimes succeeding (you can see the chainId in the UI and the errors in the console, or if in next dev mode, on the UI as toasts).
7. After one of the `wallet_switchEthereumChain` calls fail, click "Disconnect Wallet" (this calls the `disconnect` method of the provider).
8. After this, click `Connect Wallet` again, and read the QR code again with the Coinbase Wallet app on your phone. 
9. You'll see that the connection popup never closes, even after accepting the connection on your phone, and the connection is never established.

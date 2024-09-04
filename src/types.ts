import { EIP712TypedData, MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { Address, Hash } from 'viem';

export type SafeInfo = {
  safeAddress: string;
  chainId: number;
  owners: string[];
  threshold: number;
};

export type AppInfo = {
  appName: string;
  logoUrl: string;
};

export type SafeSettings = {
  offChainSigning?: boolean;
};

export type GetCapabilitiesResult = Record<`0x${string}`, Record<string, any>>;

export interface RpcRequest {
  method: string;
  params?: Array<any> | Record<string, any>;
}

export enum RpcErrorCode {
  INVALID_PARAMS = -32602,
  USER_REJECTED = 4001,
  UNSUPPORTED_METHOD = 4200,
  UNSUPPORTED_CHAIN = 4901,
}

export enum BundleStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
}

export class RpcError extends Error {
  code: RpcErrorCode;

  constructor(code: RpcErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

export type SafeSignature = {
  message: string | EIP712TypedData;
  safeMessageHash: string;
  safeInfo: SafeInfo;
  signatures: string[];
  preparedSignature?: string;
  createdAtMs: number;
};

export type SafeSignatures = {
  [safeAddress: string]: {
    [chainId: string]: SafeSignature[];
  };
};

export type SafeTransaction = {
  safeInfo: SafeInfo;
  transactions: MetaTransactionData[];
  safeTxHash: string;
  transactionHash?: string;
  isSuccess: boolean;
  isExecuted: boolean;
  confirmations: string[];
  nonce: number;
  createdAtMs: number;
  isRejection?: boolean;
};

export type SafeTransactions = {
  [safeAddress: string]: {
    [chainId: string]: SafeTransaction[];
  };
};

export type TransactionData = {
  from: Address;
  hash: Hash;
  gas: number;
  gasPrice: string;
  nonce: number;
  input: Hash;
  value: string;
  to: Address;
  blockHash: Hash | null;
  blockNumber: number | null;
  transactionIndex: number | null;
};

export type TransactionParam = {
  from?: Address;
  to: Address;
  gas?: string;
  gasPrice?: string;
  value?: string;
  data?: string;
};

export type OverridesParam = {
  balance?: string;
  nonce?: string;
  code?: string;
  state?: any;
  stateDiff?: number;
};

export type LogFilter = {
  fromBlock?: string;
  toBlock?: string;
  address?: Address;
  topics?: string;
  blockHash?: string;
};

export type Caveat = {
  type: string;
  value: any;
};

export type Permission = {
  invoker: string;
  parentCapability: string;
  caveats: Caveat[];
};

export type PermissionRequest = {
  [methodName: string]: {
    [caveatName: string]: any;
  };
};

export type RequestedPermission = {
  parentCapability: string;
  date?: number;
};

export type EIP1193Provider = {
  request: (options: { method: string; params?: readonly unknown[] | object }) => Promise<any>;
};

export type SendCallsParams = {
  version: '1.0';
  chainId: string;
  from: string;
  calls: {
    to: string;
    value?: string;
    data: string;
  }[];
};

export type SafeSignerProviderType = 'metaMask' | 'coinbaseWallet' | 'walletConnect';

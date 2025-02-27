import { WalletClient, WalletClientError } from '@vegaprotocol/wallet-client';
import { clearConfig, getConfig, setConfig } from '../storage';
import type { Transaction, VegaConnector } from './vega-connector';
import { WalletError } from './vega-connector';

const VERSION = 'v2';

export const ClientErrors = {
  NO_SERVICE: new WalletError('No service', 100),
  INVALID_WALLET: new WalletError('Wallet version invalid', 103),
  WRONG_NETWORK: new WalletError(
    'Wrong network',
    104,
    'App is configured to work with a different chain'
  ),
  UNKNOWN: new WalletError(
    'Something went wrong',
    105,
    'Unknown error occurred'
  ),
  NO_CLIENT: new WalletError('No client found.', 106),
} as const;

export class JsonRpcConnector implements VegaConnector {
  version = VERSION;
  private _url: string | null = null;
  token: string | null = null;
  reqId = 0;
  client?: WalletClient;

  constructor() {
    const cfg = getConfig();

    this.token = cfg?.token ?? null;

    if (cfg && cfg.url) {
      this.url = cfg.url;
      this.client = new WalletClient({
        address: cfg.url,
        token: cfg.token ?? undefined,
        onTokenChange: (token) => {
          this.token = token;
          setConfig({
            token,
            connector: 'jsonRpc',
            url: this._url,
          });
        },
      });
    }
  }

  set url(url: string) {
    this._url = url;
    this.client = new WalletClient({
      address: url,
      token: this.token ?? undefined,
      onTokenChange: (token) => {
        this.token = token;
        setConfig({
          token,
          url,
          connector: 'jsonRpc',
        });
      },
    });
  }
  get url() {
    return this._url || '';
  }
  async getChainId() {
    if (!this.client) {
      throw ClientErrors.NO_CLIENT;
    }
    try {
      const { result } = await this.client.GetChainId();
      return result;
    } catch (err) {
      const {
        code = ClientErrors.UNKNOWN.code,
        message = ClientErrors.UNKNOWN.message,
        title,
      } = err as WalletClientError;
      throw new WalletError(title, code, message);
    }
  }

  async connectWallet() {
    if (!this.client) {
      throw ClientErrors.NO_CLIENT;
    }

    try {
      await this.client.ConnectWallet();
      return null;
    } catch (err) {
      const {
        code = ClientErrors.UNKNOWN.code,
        message = ClientErrors.UNKNOWN.message,
        title,
      } = err as WalletClientError;
      throw new WalletError(title, code, message);
    }
  }

  // connect actually calling list_keys here, not to be confused with connect_wallet
  // which retrieves the session token
  async connect() {
    if (!this.client) {
      throw ClientErrors.NO_CLIENT;
    }

    try {
      const { result } = await this.client.ListKeys();
      return result.keys;
    } catch (err) {
      const {
        code = ClientErrors.UNKNOWN.code,
        message = ClientErrors.UNKNOWN.message,
        title,
      } = err as WalletClientError;
      throw new WalletError(title, code, message);
    }
  }

  async isAlive() {
    if (this.client) {
      try {
        const keys = await this.client.ListKeys();
        if (keys.result.keys.length > 0) {
          return true;
        }
      } catch (err) {
        return false;
      }
    }

    return false;
  }

  async disconnect() {
    if (!this.client) {
      throw ClientErrors.NO_CLIENT;
    }

    try {
      await this.client.DisconnectWallet();
    } catch (err) {
      // NOOP
    }
    clearConfig();
  }

  async sendTx(pubKey: string, transaction: Transaction) {
    if (!this.client) {
      throw ClientErrors.NO_CLIENT;
    }

    const { result } = await this.client.SendTransaction({
      publicKey: pubKey,
      sendingMode: 'TYPE_SYNC',
      transaction,
    });

    return {
      transactionHash: result.transactionHash,
      sentAt: result.sentAt,
      receivedAt: result.receivedAt,
      signature: result.transaction.signature.value,
    };
  }

  async checkCompat() {
    try {
      const result = await fetch(`${this._url}/api/${this.version}/methods`);
      if (!result.ok) {
        const sent1 = `The version of the wallet service running at ${this._url} is not supported.`;
        const sent2 = `Update the wallet software to a version that expose the API ${this.version}.`;
        const data = `${sent1}\n ${sent2}`;
        const title = 'Wallet version invalid';
        throw new WalletError(title, ClientErrors.INVALID_WALLET.code, data);
      }
      return true;
    } catch (err) {
      if (err instanceof WalletClientError) {
        throw err;
      }

      throw ClientErrors.NO_SERVICE;
    }
  }
}

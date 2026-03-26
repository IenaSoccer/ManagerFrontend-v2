import { defineStore } from 'pinia';
import axios from 'axios';
import type { ApiTokenEndpoints } from '../interfaces/endpoints';
import type { ServerResponse } from 'src/interfaces/response';
import type { Capabilities, TokenType } from '../interfaces/token';
import type { UpdateTokenPayload } from 'src/modules/auth/interfaces/payloads';

interface State {
  capabilities: Capabilities | null;
  tokenList: TokenType[] | null;
}

export const useTokenStore = defineStore('TokenStore', {
  state: (): State => ({
    capabilities: null,
    tokenList: null,
  }),
  getters: {
    pageInfo(): ApiTokenEndpoints {
      const base = String(process.env.API_URL ?? '#');
      return {
        STORE_LISTTOKENS: (tokenId: string | null) =>
          `${base}/token${tokenId ? `/${tokenId}` : ''}`,
        STORE_LISTCAPABILITIES: base + '/token/capabilities',
        STORE_ADDTOKEN: `${base}/token`,
        STORE_DELETETOKEN: (tokenId: string) => `${base}/token/${tokenId}`,
      };
    },
  },

  actions: {
    async listTokens(tokenId: string | null = null): Promise<TokenType[] | null> {
      const response = axios.get<ServerResponse>(this.pageInfo.STORE_LISTTOKENS(tokenId));

      return response
        .then((res) => {
          const content = res.data?.body?.content as TokenType[] | undefined;
          this.tokenList = content ?? null;
          return this.tokenList;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async listCapabilities(): Promise<Capabilities | null> {
      const response = axios.get<ServerResponse>(this.pageInfo.STORE_LISTCAPABILITIES);

      return response
        .then((res) => {
          const content = res.data?.body?.content as Capabilities | undefined;
          this.capabilities = content ?? null;
          return this.capabilities;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async addToken(token: UpdateTokenPayload): Promise<TokenType | null> {
      const response = axios.put<ServerResponse>(this.pageInfo.STORE_ADDTOKEN, token);

      return response
        .then((res) => {
          const content = res.data?.body?.content as TokenType | undefined;
          this.tokenList?.push(content!);
          return content ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async deleteToken(tokenId: string): Promise<void> {
      const response = axios.delete<ServerResponse>(this.pageInfo.STORE_DELETETOKEN(tokenId));

      return response
        .then(() => {
          this.tokenList = this.tokenList?.filter((token) => token.id !== tokenId) ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
  },
});

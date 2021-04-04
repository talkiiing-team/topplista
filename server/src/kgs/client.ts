/* eslint-disable no-await-in-loop */

import axios, { AxiosInstance } from 'axios';
import { parse, serialize } from 'cookie';
import ContentDeliverer from './ContentDeliverer';

class KGSClient {
  /**
   * Map username to GameDetailed
   */
  public readonly gameDeliverer = new ContentDeliverer<string, GameDetailed>();

  /**
   * Map username to Game[]
   */
  public readonly gamesDeliverer = new ContentDeliverer<string, Game[]>();

  private readonly instance: AxiosInstance;

  private readonly username: string | undefined;

  private readonly password: string | undefined;

  constructor(username?: string, password?: string) {
    this.instance = axios.create({
      baseURL: 'https://www.gokgs.com/json-cors/access',
    });
    this.username = username;
    this.password = password;
  }

  public async listen(callback?: () => void) {
    await this.signIn();
    if (callback) {
      callback();
    }
    console.log('[KGS] Start long polling...');
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const { messages } = await this.getResponse() || {};

        // games:
        await Promise.all(messages?.filter(({ type }) => type === 'ARCHIVE_JOIN').map(async (joinResult) => {
          if (joinResult) {
            // parse games and put them in gamesDeliver
            const { user: { name }, games, channelId } = joinResult;
            this.gamesDeliverer.deliver(name, games);

            // do unjoin
            await this.request({
              type: 'UNJOIN_REQUEST',
              channelId,
            });
          }
        }) || []);

        // game:
        messages?.filter(({ type }) => type === 'GAME_JOIN').forEach(({ sgfEvents, gameSummary }) => {
          const moves = sgfEvents
            .map(({ type, props, nodeId }: any) => {
              if (type === 'PROP_GROUP_ADDED') {
                const move = props.find((val: any) => val.name === 'MOVE');
                if (move) {
                  const { color: player, loc: location } = move;
                  return {
                    player,
                    location,
                    nodeId,
                  };
                }
                return undefined;
              }
              return undefined;
            })
            .filter((v: any) => v);
          // We hardcore an orderKey here because KGS responds without
          // an unique ID for the game. So we just keep a single instance
          // of a game in cache
          this.gameDeliverer.deliver('GAME', {
            ...gameSummary,
            players: {
              white: gameSummary.players.white,
              black: gameSummary.players.black,
            },
            moves,
          });
        });
      } catch (e) {
        if (e.message === 'TIMEOUT') {
          // eslint-disable-next-line no-continue
          continue;
        } else {
          console.log('[KGS] Stop long polling due to error below:');
          console.error(e);
          break;
        }
      }
    }
  }

  private async getResponse(): Promise<KGSResponse | undefined> {
    try {
      const { data } = await this.instance.get('');
      return data;
    } catch (e) {
      if (e.response.status === 408) {
        throw new Error('TIMEOUT');
      }
      return undefined;
    }
  }

  private async signIn() {
    this.instance.defaults.headers.Cookie = '';
    const result = await this.instance.post('', {
      type: 'LOGIN',
      name: this.username,
      password: this.password,
      locale: 'en_US',
    });
    let sessionId: string = '';
    const cookies = result.headers['set-cookie'];
    if (cookies) {
      cookies.every((cookie: string) => {
        const { JSESSIONID } = parse(cookie);
        if (JSESSIONID) {
          sessionId = JSESSIONID;
          return false;
        }
        return true;
      });
    }
    if (!sessionId) {
      throw new Error('Unable to login: no session id');
    }
    this.instance.defaults.headers.Cookie = serialize('JSESSIONID', sessionId);
    const { status, data } = await this.instance.get('');
    if (status !== 200) {
      throw new Error(`Unable to login: status code is ${status}`);
    }
  }

  private async request(request: KGSRequest) {
    try {
      await this.instance.post('', request);
    } catch (e) {
      // For some reason 404 means logout lmao
      if (e?.response?.status === 404) {
        await this.signIn();
        await this.request(request);
        return;
      }
      throw e;
    }
  }

  public async getGames(name: string): Promise<number> {
    const orderId = this.gamesDeliverer.order(name);
    try {
      await this.request({
        type: 'JOIN_ARCHIVE_REQUEST',
        name,
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
    return orderId;
  }

  public async getGame(timestamp: string): Promise<number> {
    // We hardcore an orderKey here because KGS responds without
    // an unique ID for the game. So we just keep a single instance
    // of a game in cache
    const orderId = this.gameDeliverer.order('GAME');
    try {
      await this.request({
        type: 'ROOM_LOAD_GAME',
        timestamp,
        private: true,
        channelId: 22,
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
    return orderId;
  }
}

const client = new KGSClient(process.env.KGS_USERNAME, process.env.KGS_PASSWORD);

export default client;

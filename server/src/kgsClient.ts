import axios, { AxiosInstance } from 'axios';
import { parse, serialize } from 'cookie';
import {
  Game, GameDetailed, KGSMessage, KGSRequest, KGSResponse,
} from './kgsClient.d';

class KGSClient {
  public instance: AxiosInstance;

  private readonly username: string | undefined;

  private readonly password: string | undefined;

  constructor(username?: string, password?: string) {
    this.username = username;
    this.password = password;
    this.instance = axios.create({
      baseURL: 'https://www.gokgs.com/json-cors/access',
    });
  }

  private async request(request: KGSRequest, attempts = 0): Promise<KGSResponse> {
    try {
      await this.instance.post('', request);
      const { data } = await this.instance.get('');

      if (data.messages.find((v: KGSMessage) => v.type === 'LOGOUT')) {
        throw new Error('Logged out with 200');
      }

      return data;
    } catch (e) {
      console.log(e.response);
      await this.signIn();
      if (attempts < 1) {
        return this.request(request, attempts + 1);
      }
      throw new Error('Too many bad requests');
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
    const { status } = await this.instance.get('');
    if (status !== 200) {
      throw new Error(`Unable to login: status code is ${status}`);
    }
  }

  public async getGames(name: string): Promise<Game[]> {
    console.log('attempting to get games of', name);
    const rawData = await this.request({
      type: 'JOIN_ARCHIVE_REQUEST',
      name,
    });
    const joinResult = rawData.messages.find((v) => v.type === 'ARCHIVE_JOIN');
    if (joinResult) {
      await this.request({
        type: 'UNJOIN_REQUEST',
        channelId: joinResult?.channelId,
      });
      console.log('unjoined');
    }
    return joinResult?.games;
  }

  // FIXME: Check channel id
  public async getGame(timestamp: string): Promise<GameDetailed> {
    const rawData = await this.request({
      type: 'ROOM_LOAD_GAME',
      timestamp,
      private: true,
      channelId: 22,
    });

    // TODO: Maybe add more types for this stuff?
    const moves = rawData.messages.find((v) => v.type === 'GAME_JOIN')?.sgfEvents
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

    const { games } = rawData.messages.find((v) => v.type === 'GAME_LIST') as any;
    const {
      players: { white, black }, moveNum, global, channelId, roomId, handicap,
    } = games[0];

    return {
      players: {
        white,
        black,
      },
      moveNum,
      global,
      channelId,
      roomId,
      handicap,
      moves,
    } as GameDetailed;
  }
}

const kgsClient = new KGSClient(process.env.KGS_USERNAME, process.env.KGS_PASSWORD);

export default kgsClient;

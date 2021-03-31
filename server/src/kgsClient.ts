import axios, { AxiosInstance } from 'axios';
import { parse, serialize } from 'cookie';

interface KGSRequest {
  type: string;
  [key: string]: any;
}

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

  async request(request: KGSRequest): Promise<any> {
    try {
      await this.instance.post('', request);
      const { data } = await this.instance.get('');
      return data;
    } catch (e) {
      await this.signIn();
      return this.request(request);
    }
  }

  async signIn() {
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
      throw new Error('Unable to login');
    }
    this.instance.defaults.headers.Cookie = serialize('JSESSIONID', sessionId);
    const { status } = await this.instance.get('');
    if (status !== 200) {
      throw new Error('Unable to login');
    }
  }
}

const kgsClient = new KGSClient(process.env.KGS_USERNAME, process.env.KGS_PASSWORD);

export default kgsClient;

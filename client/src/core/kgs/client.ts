import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { Game } from './kgsClient'

export interface IPlace {
  place: number
  name: string
  rank: string
  games?: Game[]
}

export default class KGSClient {
  private readonly instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'https://walfz.cloud.nstu.ru/kgs/api/',
    })
  }

  private extractData(dataStore: AxiosResponse) {
    return dataStore.data || []
  }

  private async request(query: string) {
    return this.extractData(await this.instance.get(query))
  }

  async getLeaderboard(extended?: boolean) {
    console.log('lb')
    return this.request('leaderboard' + (extended ? '?extended' : ''))
  }

  async getGames(name: string, extended?: boolean) {
    return this.request('games/' + name + (extended ? '/?extended' : ''))
  }

  async getGame(timestamp: string) {
    return await this.request('game/' + timestamp)
  }
}

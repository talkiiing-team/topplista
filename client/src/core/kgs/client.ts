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

  private cache: Map<string, any> = new Map()

  constructor() {
    this.instance = axios.create({
      baseURL: 'https://walfz.cloud.nstu.ru/kgs/api/',
    })
  }

  private extractData(dataStore: AxiosResponse) {
    return dataStore.data || []
  }

  private async request(query: string) {
    if (this.cache.has(query)) {
      return this.cache.get(query)
    }
    const res = this.extractData(await this.instance.get(query))
    this.cache.set(query, res)
    return res
  }

  async getLeaderboard(extended?: boolean) {
    return this.request('leaderboard' + (extended ? '?extended' : ''))
  }

  async getGames(name: string, extended?: boolean) {
    return this.request('games/' + name + (extended ? '/?extended' : ''))
  }

  async getGame(timestamp: string) {
    return await this.request('game/' + timestamp)
  }
}

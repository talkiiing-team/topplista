/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { Game, GameDetailed, Place } from './types'



export default class KGSClient {
  private readonly instance: AxiosInstance

  private cache: Map<string, any> = new Map()

  constructor() {
    this.instance = axios.create({
      // baseURL: 'https://walfz.cloud.nstu.ru/kgs/api/',
      baseURL: 'http://localhost:8080/api/',
    })
  }

  private extractData(dataStore: AxiosResponse): any {
    return dataStore.data || []
  }

  private async request(query: string): Promise<any> {
    if (this.cache.has(query)) {
      return this.cache.get(query)
    }
    const res = this.extractData(await this.instance.get(query))
    this.cache.set(query, res)
    return res
  }

  async getLeaderboard(extended?: boolean): Promise<Place[]> {
    return this.request('leaderboard' + (extended ? '?extended' : ''))
  }

  async getGames(name: string, extended?: boolean): Promise<Game[]> {
    return this.request('games/' + name + (extended ? '/?extended' : ''))
  }

  async getGame(timestamp: string): Promise<GameDetailed> {
    return await this.request('game/' + timestamp)
  }
}

import { Fetcher } from './fetchers/ClassicFetcher'

export interface IFetcherConstructor {
  baseUrl: string
}

export interface ICrudConstructor {
  fetcher: Fetcher
}


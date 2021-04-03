import { IFetcherConstructor } from '../crudTypes'

class Fetcher {
  baseUrl = ''
  constructor(props: IFetcherConstructor) {
    this.baseUrl = props.baseUrl
  }

  read(path?: string) {

  }
}

export { Fetcher }

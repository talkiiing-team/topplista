import { ICrudConstructor, IFetcherConstructor } from './crudTypes'

class Crud {
  fetcher: IFetcherConstructor
  constructor(props: ICrudConstructor) {
    this.fetcher = props.fetcher
  }
  
}

export { Crud }


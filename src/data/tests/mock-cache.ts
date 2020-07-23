import { CacheStore } from '@/data/protocols/cache'
import { SavePurchases } from '@/domain/usecases'

export class CacheStoreSpy implements CacheStore {
  actions: Array<CacheStoreSpy.Actions> = []
  deleteKey: string
  insertKey: string
  insertValue: Array<SavePurchases.Params> = []

  delete(key: string) {
    this.actions.push(CacheStoreSpy.Actions.delete)
    this.deleteKey = key
  }

  insert(key: string, value: any) {
    this.actions.push(CacheStoreSpy.Actions.insert)
    this.insertKey = key
    this.insertValue = value
  }

  simulateDeleteError() {
    jest.spyOn(CacheStoreSpy.prototype, 'delete')
      .mockImplementationOnce(
        () => {
          this.actions.push(CacheStoreSpy.Actions.delete)
          throw new Error()
        }
      )
  }

  simulateInsertError() {
    jest.spyOn(CacheStoreSpy.prototype, 'insert')
      .mockImplementationOnce(
        () => {
          this.actions.push(CacheStoreSpy.Actions.insert)
          throw new Error()
        }
      )
  }
}

export namespace CacheStoreSpy {
  export enum Actions {
    delete,
    insert
  }
}

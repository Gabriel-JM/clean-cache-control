import { CacheStore } from '@/data/protocols/cache'
import { SavePurchases } from '@/domain/usecases'

export class CacheStoreSpy implements CacheStore {
  messages: Array<CacheStoreSpy.Messages> = []
  deleteKey: string
  insertKey: string
  insertValue: Array<SavePurchases.Params> = []

  delete(key: string) {
    this.messages.push(CacheStoreSpy.Messages.delete)
    this.deleteKey = key
  }

  insert(key: string, value: any) {
    this.messages.push(CacheStoreSpy.Messages.insert)
    this.insertKey = key
    this.insertValue = value
  }

  simulateDeleteError() {
    jest.spyOn(CacheStoreSpy.prototype, 'delete')
      .mockImplementationOnce(
        () => {
          this.messages.push(CacheStoreSpy.Messages.delete)
          throw new Error()
        }
      )
  }

  simulateInsertError() {
    jest.spyOn(CacheStoreSpy.prototype, 'insert')
      .mockImplementationOnce(
        () => {
          this.messages.push(CacheStoreSpy.Messages.insert)
          throw new Error()
        }
      )
  }
}

export namespace CacheStoreSpy {
  export enum Messages {
    delete,
    insert
  }
}

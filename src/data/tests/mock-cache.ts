import { CacheStore } from '@/data/protocols/cache'
import { SavePurchases } from '@/domain/usecases'

export class CacheStoreSpy implements CacheStore {
  deleteKey: string
  insertKey: string
  insertValue: Array<SavePurchases.Params> = []
  deleteCallsCount = 0
  insertCallsCount = 0

  delete(key: string) {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert(key: string, value: any) {
    this.insertCallsCount++
    this.insertKey = key
    this.insertValue = value
  }

  simulateDeleteError() {
    jest.spyOn(CacheStoreSpy.prototype, 'delete')
      .mockImplementationOnce(
        () => { throw new Error() }
      )
  }

  simulateInsertError() {
    jest.spyOn(CacheStoreSpy.prototype, 'insert')
      .mockImplementationOnce(
        () => { throw new Error() }
      )
  }
}
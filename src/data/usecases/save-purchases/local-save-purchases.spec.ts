import { LocalSavePurchases } from '@/data/usecases'
import { CacheStore } from '@/data/protocols/cache'
import { SavePurchases } from '@/domain'

class CacheStoreSpy implements CacheStore {
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
}

type SutTypes = {
  sut: LocalSavePurchases,
  cacheStore: CacheStoreSpy
}

function makeSut(): SutTypes {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore)

  return {
    sut,
    cacheStore
  }
}

const mockPurchases = (): SavePurchases.Params[] => [
  {
    id: '1',
    date: new Date(),
    value: 10
  },
  {
    id: '2',
    date: new Date(),
    value: 20
  }
]

describe('LocalSavePurchases', () => {
  test('should not delete cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.deleteCallsCount).toBe(0)
  })

  test('should delete old cache before save', async () => {
    const { sut, cacheStore } = makeSut()
    await sut.save(mockPurchases())
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  test('should not insert new cache if delete fails', async () => {
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateDeleteError()
    const promise = sut.save(mockPurchases())
    expect(cacheStore.insertCallsCount).toBe(0)
    await expect(promise).rejects.toThrow()
  })

  test('should insert new cache if delete succeeds', async () => {
    const { sut, cacheStore } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)

    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValue).toEqual(purchases)
  })
})

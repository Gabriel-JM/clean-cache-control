import { LocalLoadPurchases } from '@/data/usecases'
import { mockPurchases, CacheStoreSpy } from '@/data/tests'

type SutTypes = {
  sut: LocalLoadPurchases,
  cacheStore: CacheStoreSpy
}

function makeSut(timestamp = new Date()): SutTypes {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalLoadPurchases(cacheStore, timestamp)

  return {
    sut,
    cacheStore
  }
}

describe('LocalLoadPurchases', () => {
  test('should not insert or delete cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.actions).toEqual([])
  })

  test('should return empty list if load fails', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateFetchError()
    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Actions.fetch, CacheStoreSpy.Actions.delete])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(purchases).toEqual([])
  })

  test('should return list of purchases if cache is less then 3 days old', async () => {
    const timestamp = new Date()
    const { cacheStore, sut } = makeSut(timestamp)
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    }
    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Actions.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(purchases).toEqual(cacheStore.fetchResult.value)
  })
})

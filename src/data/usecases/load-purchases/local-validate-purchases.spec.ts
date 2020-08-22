import { LocalLoadPurchases } from '@/data/usecases'
import { CacheStoreSpy } from '@/data/tests'

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

  test('should delete cache if load fails', () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateFetchError()
    sut.validate()

    expect(cacheStore.actions)
      .toEqual([CacheStoreSpy.Actions.fetch, CacheStoreSpy.Actions.delete])
    expect(cacheStore.deleteKey).toBe('purchases')
  })
})

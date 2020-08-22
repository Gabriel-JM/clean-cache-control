import { LocalLoadPurchases } from '@/data/usecases'
import { CacheStoreSpy, getCacheExpirationDate } from '@/data/tests'

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

  test('should has no side effect if load succeeds', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() + 1)

    const { cacheStore, sut } = makeSut(currentDate)
    cacheStore.fetchResult = { timestamp }

    sut.validate()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Actions.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
  })

  test('should delete cache if its expired', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() - 1)

    const { cacheStore, sut } = makeSut(currentDate)
    cacheStore.fetchResult = { timestamp }

    sut.validate()

    expect(cacheStore.actions)
      .toEqual([CacheStoreSpy.Actions.fetch, CacheStoreSpy.Actions.delete])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  test('should delete cache if its on expiration date', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)

    const { cacheStore, sut } = makeSut(currentDate)
    cacheStore.fetchResult = { timestamp }

    sut.validate()

    expect(cacheStore.actions)
      .toEqual([CacheStoreSpy.Actions.fetch, CacheStoreSpy.Actions.delete])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deleteKey).toBe('purchases')
  })
})

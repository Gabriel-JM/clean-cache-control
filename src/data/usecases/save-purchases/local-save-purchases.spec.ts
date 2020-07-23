import { LocalSavePurchases } from '@/data/usecases'
import { mockPurchases, CacheStoreSpy } from '@/data/tests'

type SutTypes = {
  sut: LocalSavePurchases,
  cacheStore: CacheStoreSpy
}

function makeSut(timestamp = new Date()): SutTypes {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore, timestamp)

  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchases', () => {
  test('should not insert or delete cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.messages).toEqual([])
  })

  test('should not insert new cache if delete fails', async () => {
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateDeleteError()
    const promise = sut.save(mockPurchases())

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Messages.delete])
    await expect(promise).rejects.toThrow()
  })

  test('should insert new cache if delete succeeds', async () => {
    const timestamp = new Date()
    const { sut, cacheStore } = makeSut(timestamp)
    const purchases = mockPurchases()
    const promise = sut.save(purchases)

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Messages.delete, CacheStoreSpy.Messages.insert])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValue).toEqual({
      timestamp,
      value: purchases
    })
    await expect(promise).resolves.toBeFalsy()
  })

  test('should throw if insert throws', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateInsertError()
    const promise = sut.save(mockPurchases())

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Messages.delete, CacheStoreSpy.Messages.insert])
    await expect(promise).rejects.toThrow()
  })
})

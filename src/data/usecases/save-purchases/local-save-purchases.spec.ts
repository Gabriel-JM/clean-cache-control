import { LocalSavePurchases } from '@/data/usecases'
import { CacheStore } from '@/data/protocols/cache'

class CacheStoreSpy implements CacheStore {
  deleteKey: string
  insertKey: string
  deleteCallsCount = 0
  insertCallsCount = 0

  delete(key: string) {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert(key: string) {
    this.insertCallsCount++
    this.insertKey = key
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

describe('LocalSavePurchases', () => {
  test('should not delete cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.deleteCallsCount).toBe(0)
  })

  test('should delete old cache before save', async () => {
    const { sut, cacheStore } = makeSut()
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  test('should not insert new cache if delete fails', async () => {
    const { sut, cacheStore } = makeSut()
    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.save()
    expect(cacheStore.insertCallsCount).toBe(0)
    await expect(promise).rejects.toThrow()
  })

  test('should insert new cache if delete succeeds', async () => {
    const { sut, cacheStore } = makeSut()
    await sut.save()

    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchases')
  })
})

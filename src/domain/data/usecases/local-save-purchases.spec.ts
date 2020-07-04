class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}

  async save() {
    this.cacheStore.delete()
  }
}

interface CacheStore {
  delete(): void
}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0

  delete () {
    this.deleteCallsCount++
  }
}

describe('LocalSavePurchases', () => {
  test('should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy()
    new LocalSavePurchases(cacheStore)

    expect(cacheStore.deleteCallsCount).toBe(0)
  })

  test('should delete old cache before save', async () => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore)
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
  })
})

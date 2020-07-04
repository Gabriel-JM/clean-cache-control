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
  })
})

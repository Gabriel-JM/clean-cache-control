import { CacheStore } from '@/data/protocols/cache'
import { SavePurchases, LoadPurchases } from '@/domain/usecases'

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  private readonly key = 'purchases'

  constructor(
    private readonly cacheStore: CacheStore,
    private readonly timestamp: Date
  ) {}

  async save(purchases: SavePurchases.Params[]) {
    this.cacheStore.replace(this.key, {
      timestamp: this.timestamp,
      value: purchases
    })
  }

  async loadAll() {
    try {
      const cache = this.cacheStore.fetch(this.key)

      return cache.value
    } catch (error) {
      this.cacheStore.delete(this.key)
      return []
    }
  }
}

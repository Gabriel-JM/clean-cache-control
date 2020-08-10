import { CacheStore } from '@/data/protocols/cache'
import { SavePurchases, LoadPurchases } from '@/domain/usecases'
import CachePolicy from '@/data/protocols/cache/cache-policy'

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  private readonly key = 'purchases'

  constructor(
    private readonly cacheStore: CacheStore,
    private readonly currentDate: Date
  ) {}

  async save(purchases: SavePurchases.Params[]) {
    this.cacheStore.replace(this.key, {
      timestamp: this.currentDate,
      value: purchases
    })
  }

  async loadAll() {
    try {
      const cache = this.cacheStore.fetch(this.key)
    
      if (CachePolicy.validate(cache.timestamp, this.currentDate)) {
        return cache.value
      }

      throw new Error()
    } catch (error) {
      this.cacheStore.delete(this.key)
      return []
    }
  }
}

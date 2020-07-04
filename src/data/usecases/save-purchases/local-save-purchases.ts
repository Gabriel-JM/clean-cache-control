import { CacheStore } from "@/data/protocols/cache";

export class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}

  async save() {
    this.cacheStore.delete('purchases')
  }
}

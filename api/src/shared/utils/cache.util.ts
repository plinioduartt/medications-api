type CacheValue = { data: any; expiresAt: number }

export class SimpleCache {
  private store = new Map<string, CacheValue>()

  set(key: string, value: any, ttlMs: number) {
    const expiresAt = Date.now() + ttlMs
    this.store.set(key, { data: value, expiresAt })
  }

  get(key: string) {
    const cached = this.store.get(key)
    if (!cached) return null
    if (cached.expiresAt < Date.now()) {
      this.store.delete(key)
      return null
    }
    return cached.data
  }
}

export const customNodeCache = new SimpleCache()

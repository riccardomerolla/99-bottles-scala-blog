declare module 'lru-cache' {
  export interface LRUCache<K, V> extends Map<K, V> {
    // Add any necessary overrides here
  }
  
  export default function LRU<K, V>(options?: any): LRUCache<K, V>;
}

import { getCollection, type CollectionEntry } from 'astro:content';

type SingletonCollection = 'siteSettings' | 'home' | 'founder' | 'seoDefaults';

export async function getSingleton<K extends SingletonCollection>(
  collection: K,
): Promise<CollectionEntry<K>> {
  const entries = await getCollection(collection);
  const [entry] = entries;

  if (!entry) {
    throw new Error(`Missing required content entry for ${collection}.`);
  }

  return entry;
}

export function sortByOrder<T extends { data: { order?: number } }>(entries: T[]): T[] {
  return [...entries].sort((left, right) => {
    const leftOrder = left.data.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.data.order ?? Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

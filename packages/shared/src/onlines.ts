import type { Status, StatusMap } from './domain.js';

export function onlinesFromMap(map: StatusMap): Set<string> {
  return new Set(
    Object.entries(map)
      .filter(([, s]) => s === 'online')
      .map(([id]) => id),
  );
}

export function onlinesFromChange(current: Set<string>, id: string, status: Status): Set<string> {
  const next = new Set(current);
  if (status === 'online') {
    next.add(id);
  } else {
    next.delete(id);
  }
  return next;
}

export type ZoneId = string;

export const ZONE_IDS = [
  'LW-B', 'CD', 'RW-B',
  'LW-M', 'CM', 'RW-M',
  'LW-F', 'CF', 'RW-F',
] as const satisfies readonly ZoneId[];

export function isCentralZone(zoneId: ZoneId): boolean {
  return zoneId === 'CD' || zoneId === 'CM' || zoneId === 'CF';
}

export function zoneSection(zoneId: ZoneId): string {
  if (zoneId.startsWith('LW')) return 'LW';
  if (zoneId.startsWith('RW')) return 'RW';
  return zoneId;
}

export const ZONE_CAP = (zoneId: ZoneId) => (isCentralZone(zoneId) ? 3 : 1);

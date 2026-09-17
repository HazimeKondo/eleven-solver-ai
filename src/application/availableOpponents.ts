import type { OpponentCard } from '../domain/types';
import { OPPONENT_POOL } from '../domain/opponents';

export function availableOpponents(): OpponentCard[] {
  return OPPONENT_POOL;
}

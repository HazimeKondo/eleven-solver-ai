import type { OpponentCard } from './types';
import { parseOpponentCards } from './parseCards';
// Vite inlines the CSV as a raw string so the data ships with the bundle.
import cardsCsv from '../../data/opponent-cards.csv?raw';

/**
 * The pool of opponent cards the user can select to match against,
 * loaded from the data/opponent-cards.csv dictionary and filtered by (clubName, division).
 */
export const OPPONENT_POOL: OpponentCard[] = parseOpponentCards(cardsCsv);

import { describe, expect, it } from 'vitest';
import { applyGoalkeeper } from './goalkeeper';
import { player } from './helpers';

describe('applyGoalkeeper', () => {
  it('blocks a shot when GK is at least as strong and has gloves', () => {
    const blocked = applyGoalkeeper({ gloves: 2, strength: 5 }, [player(1, 'offensive', 4)]);
    expect(blocked).toBe(1);
  });

  it('cannot block a shot stronger than the GK', () => {
    const blocked = applyGoalkeeper({ gloves: 3, strength: 3 }, [player(1, 'offensive', 5)]);
    expect(blocked).toBe(0);
  });

  it('blocks up to the glove count only', () => {
    const shots = [player(1, 'offensive', 2), player(2, 'offensive', 2), player(3, 'offensive', 2)];
    const blocked = applyGoalkeeper({ gloves: 2, strength: 5 }, shots);
    expect(blocked).toBe(2);
  });

  it('blocks zero when no gloves remain', () => {
    const blocked = applyGoalkeeper({ gloves: 0, strength: 9 }, [player(1, 'offensive', 1)]);
    expect(blocked).toBe(0);
  });
});

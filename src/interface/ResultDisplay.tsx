import type { MatchResult } from '../domain/match';

export function ResultDisplay({ result, error }: { result: MatchResult | null; error: string | null }) {
  if (error) {
    return (
      <div className="panel result result--error">
        <h2>Result</h2>
        <p className="result__error">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="panel result">
        <h2>Result</h2>
        <p className="result__placeholder">Place all 10 players, then resolve the match.</p>
      </div>
    );
  }

  return (
    <div className="panel result">
      <h2>Result</h2>
      <div className="result__score">
        <span className="result__goals you">{result.userGoals.length}</span>
        <span className="result__dash">–</span>
        <span className="result__goals opp">{result.opponentGoals}</span>
      </div>
      {result.userGoals.length > 0 && (
        <p className="result__detail">
          Scored by: {result.userGoals.map((n) => `#${n}`).join(', ')}
        </p>
      )}
    </div>
  );
}

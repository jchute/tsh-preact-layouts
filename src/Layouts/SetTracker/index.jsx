import styles from "./set-tracker.module.scss";
import { Screen } from "@Components/Elements/Screen";
import { useSelector } from "@Components/TSH/createField";
import {
  DisplayName,
  Games,
  If,
  RoundName,
  Score,
  Scope,
  SetLength,
  StageImage,
  StageName,
  useTeam,
} from "@Components/TSH";
import { getGame, getGames } from "@State/selectors";
import { cx } from "@Utils/cx";

/**
 * One game of the set. Played games are tinted for the winner and name them; games not played
 * yet show a placeholder.
 *
 * @param {object} props
 * @param {number} props.game Which game of the set, starting at 1.
 */
const Card = ({ game }) => {
  const { tie, winner } = useSelector(
    (tsh, props) => {
      const entry = getGame(tsh, props);

      return {
        tie: Boolean(entry?.tie),
        winner: entry?.t1_win ? 1 : entry?.t2_win ? 2 : null,
      };
    },
    { game },
  );
  const color = useTeam({ team: winner ?? 1 })?.color;
  const played = winner != null || tie;

  return (
    <li
      className={cx(
        styles.card,
        winner === 1 && styles.one,
        winner === 2 && styles.two,
        tie && styles.tie,
        !played && styles.pending,
      )}
      style={{ "--team-color": winner ? color : undefined }}
    >
      <span className={styles.number}>Game {game}</span>
      <div className={styles.picture}>
        <StageImage fill game={game} height="100%" hide width="100%" />
      </div>
      <StageName className={styles.stageName} fallback="Stage TBD" game={game} />
      <span className={styles.outcome}>
        {winner ? (
          <Scope team={winner}>
            <DisplayName className={styles.winnerName} />
          </Scope>
        ) : tie ? (
          "Tie"
        ) : (
          "To be played"
        )}
      </span>
    </li>
  );
};

/**
 * Set tracker: one card per game of the set with the stage played, and who won it. Needs TSH's
 * game tracker turned on, and says so when it isn't.
 */
export const SetTracker = () => {
  const count = Object.keys(useSelector(getGames)).length;

  return (
    <Screen className={styles.screen} padding="3vw">
      <header className={styles.header}>
        <DisplayName className={styles.name} team={1} />
        <div className={styles.summary}>
          <div className={styles.scores}>
            <Score className={styles.score} team={1} />
            <span className={styles.dash}>-</span>
            <Score className={styles.score} team={2} />
          </div>
          <RoundName className={styles.round} hide />
          <SetLength className={styles.length} hide setLengthTextVariant="text" />
        </div>
        <DisplayName className={cx(styles.name, styles.right)} team={2} />
      </header>

      <ol className={styles.cards} style={{ "--count": Math.max(count, 1) }}>
        <Games>{(game) => <Card game={game} />}</Games>
      </ol>
      <If not of={Games}>
        <p className={styles.notice}>Turn on the game tracker in TSH to see games.</p>
      </If>
    </Screen>
  );
};

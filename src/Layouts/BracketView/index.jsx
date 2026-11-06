import styles from "./bracket-view.module.scss";
import { Screen } from "@Components/Elements/Screen";
import { useSelector } from "@Components/TSH/createField";
import {
  BracketPhase,
  BracketPhaseGroup,
  BracketRoundName,
  BracketRounds,
  BracketSetName,
  BracketSets,
  BracketSetScore,
  EventName,
  If,
} from "@Components/TSH";
import { getBracketSet, getBracketSets } from "@State/selectors";
import { cx } from "@Utils/cx";

/**
 * One set: both sides with their scores. Completed sets are dimmed and the winning side is bold.
 *
 * @param {object} props
 * @param {number} props.bracketRound Which round the set is in.
 * @param {number} props.bracketSet Which set in the round.
 * @param {boolean} props.losers Whether the round is on the losers side.
 */
const Match = ({ bracketRound, bracketSet, losers }) => {
  const set = useSelector(getBracketSet, { bracketRound, bracketSet, losers });
  const [first, second] = (set?.score ?? []).map(Number);
  const completed = Boolean(set?.completed);
  const winner = completed && first !== second ? (first > second ? 1 : 2) : null;
  const side = (bracketSide) => (
    <div className={cx(styles.side, winner === bracketSide && styles.winner)}>
      <BracketSetName
        bracketRound={bracketRound}
        bracketSet={bracketSet}
        bracketSide={bracketSide}
        className={styles.name}
        fallback="TBD"
        losers={losers}
      />
      <BracketSetScore
        bracketRound={bracketRound}
        bracketSet={bracketSet}
        bracketSide={bracketSide}
        className={styles.score}
        fallback=""
        losers={losers}
      />
    </div>
  );

  return (
    <div className={cx(styles.match, completed && styles.completed)}>
      {side(1)}
      {side(2)}
    </div>
  );
};

/**
 * One round's column of sets. How the sets connect to the neighbouring rounds depends on how many
 * each round has: pairs of sets that feed one set get an elbow connector, equal counts get a
 * straight line, and anything else gets none rather than a connector that points at the wrong set.
 *
 * @param {object} props
 * @param {number} props.bracketRound Which round.
 * @param {boolean} props.losers Whether the round is on the losers side.
 */
const Round = ({ bracketRound, losers }) => {
  const { count, next, previous } = useSelector(
    (tsh, props) => {
      const countSets = (round) =>
        Object.keys(getBracketSets(tsh, { ...props, bracketRound: round })).length;

      return {
        count: countSets(props.bracketRound),
        next: countSets(props.bracketRound + 1),
        previous: countSets(props.bracketRound - 1),
      };
    },
    { bracketRound, losers },
  );
  const connector = next > 0 && next * 2 === count ? "pairs" : next === count ? "straight" : "none";
  const incoming = previous > 0 && (previous === count || previous === count * 2);

  return (
    <div className={cx(styles.round, styles[connector], incoming && styles.incoming)}>
      <BracketRoundName
        bracketRound={bracketRound}
        className={styles.roundName}
        fallback={`Round ${bracketRound}`}
        losers={losers}
      />
      <div className={styles.sets}>
        <BracketSets bracketRound={bracketRound} losers={losers}>
          {(bracketSet) => (
            <div className={styles.slot}>
              <Match bracketRound={bracketRound} bracketSet={bracketSet} losers={losers} />
            </div>
          )}
        </BracketSets>
      </div>
    </div>
  );
};

/**
 * One side of the bracket as a row of round columns.
 *
 * @param {object} props
 * @param {boolean} [props.losers] Show the losers side.
 * @param {string} props.title Heading for the side.
 */
const Half = ({ losers = false, title }) => {
  return (
    <section className={styles.half}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.rounds}>
        <BracketRounds losers={losers}>
          {(bracketRound) => <Round bracketRound={bracketRound} losers={losers} />}
        </BracketRounds>
      </div>
    </section>
  );
};

/**
 * Bracket view: the winners side across the top and the losers side below it, with each set
 * showing both players and scores. The losers side is left out for single elimination brackets.
 */
export const BracketView = () => {
  return (
    <Screen className={styles.screen} padding="2vw">
      <header className={styles.header}>
        <EventName className={styles.event} hide />
        <BracketPhase className={styles.phase} hide />
        <BracketPhaseGroup className={styles.group} hide />
      </header>
      <Half title="Winners" />
      <If losers of={BracketRounds}>
        <Half losers title="Losers" />
      </If>
    </Screen>
  );
};

import styles from "./road-to-here.module.scss";
import { Screen } from "@Components/Elements/Screen";
import { useSelector } from "@Components/TSH/createField";
import {
  CharacterImage,
  Characters,
  DisplayName,
  DisplayTag,
  LastSetName,
  LastSetPhase,
  LastSetRound,
  LastSets,
  LastSetScore,
  Record,
  RoundName,
  Scope,
  Seed,
  useTeam,
} from "@Components/TSH";
import { getLastSet, getLastSets } from "@State/selectors";
import { cx } from "@Utils/cx";

/** Which TSH image pack to use for character icons. Check which packs your game provides. */
const ICON_ASSET = "base_files/icon";

/** How many of each player's previous sets to list. */
const MAX_SETS = 5;

/**
 * One stop on a player's run: result badge, round, opponent and the characters they played.
 *
 * @param {object} props
 * @param {number} props.lastSet Which of the team's sets (1 is the most recent).
 * @param {number} props.team Whose run this is (1 or 2).
 */
const Stop = ({ lastSet, team }) => {
  const result = useSelector(
    (tsh, props) => {
      const set = getLastSet(tsh, props);
      const own = Number(set?.player_score);
      const other = Number(set?.oponent_score);

      if (set?.player_score == null || set?.oponent_score == null || own === other) {
        return "pending";
      }

      return own > other ? "win" : "loss";
    },
    { lastSet, team },
  );

  return (
    <li className={cx(styles.stop, styles[result])}>
      <span className={styles.badge}>{{ win: "W", loss: "L", pending: "-" }[result]}</span>
      <div className={styles.info}>
        <LastSetRound className={styles.round} hide lastSet={lastSet} team={team} />
        <span className={styles.versus}>
          vs <LastSetName lastSet={lastSet} opponent team={team} />
        </span>
        <LastSetPhase className={styles.phase} hide lastSet={lastSet} team={team} />
      </div>
      <span className={styles.chars}>
        <Characters lastSet={lastSet} limit={2} opponent team={team}>
          {(character) => (
            <CharacterImage
              asset={ICON_ASSET}
              character={character}
              height="1.5em"
              hide
              lastSet={lastSet}
              opponent
              team={team}
            />
          )}
        </Characters>
      </span>
      <LastSetScore className={styles.score} hide lastSet={lastSet} team={team} />
    </li>
  );
};

/**
 * One player's column: who they are, their record, then their run as a vertical timeline.
 *
 * @param {object} props
 * @param {number} props.team Which side to show (1 or 2).
 */
const Run = ({ team }) => {
  const color = useTeam({ team })?.color;
  const count = Object.keys(useSelector(getLastSets, { team })).length;

  return (
    <Scope team={team}>
      <section
        className={cx(styles.run, team === 2 ? styles.two : styles.one)}
        style={{ "--team-color": color }}
      >
        <header className={styles.header}>
          <DisplayTag className={styles.tag} hide />
          <DisplayName className={styles.name} />
          <div className={styles.stats}>
            <Seed format={(seed) => `Seed ${seed}`} hide />
            <Record format={(record) => `Record ${record}`} hide />
          </div>
        </header>
        <ol className={styles.timeline}>
          <LastSets limit={MAX_SETS}>
            {(lastSet) => <Stop lastSet={lastSet} team={team} />}
          </LastSets>
        </ol>
        {count === 0 && <p className={styles.empty}>No sets played yet</p>}
      </section>
    </Scope>
  );
};

/**
 * "Road to here": each player's previous sets at this tournament as a timeline, newest first, with
 * W/L badges, opponents, scores and the characters their opponents played.
 */
export const RoadToHere = () => {
  return (
    <Screen className={styles.screen} gutter="3vw" padding="3vw">
      <Run team={1} />
      <div className={styles.divider}>
        <RoundName className={styles.title} hide />
        <span className={styles.vs}>vs</span>
      </div>
      <Run team={2} />
    </Screen>
  );
};

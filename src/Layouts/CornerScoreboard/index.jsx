import styles from "./corner-scoreboard.module.scss";
import { Screen } from "@Components/Elements/Screen";
import { useSelector } from "@Components/TSH/createField";
import {
  CountryFlag,
  DisplayName,
  DisplayTag,
  IfLosers,
  RoundName,
  SetLength,
  useTeam,
} from "@Components/TSH";
import { getScore, getScoreboard } from "@State/selectors";
import { cx } from "@Utils/cx";

/**
 * One pip per game needed to win the set, filled for every game the team has won. Shows nothing
 * when TSH doesn't say how many games a set needs.
 *
 * @param {object} props
 * @param {number} props.team Which side to show (1 or 2).
 */
const Pips = ({ team }) => {
  const { firstTo, score } = useSelector(
    (tsh, props) => ({
      firstTo: Number(getScoreboard(tsh, props)?.first_to) || 0,
      score: getScore(tsh, props),
    }),
    { team },
  );

  return (
    <div className={styles.pips}>
      {Array.from({ length: firstTo }, (_, index) => (
        <span className={cx(styles.pip, index < score && styles.won)} key={index} />
      ))}
    </div>
  );
};

/**
 * An angled plate pinned to one top corner.
 *
 * @param {object} props
 * @param {number} props.team Which side to show (1 or 2).
 */
const Plate = ({ team }) => {
  const color = useTeam({ team })?.color;

  return (
    <div
      className={cx(styles.plate, team === 2 ? styles.right : styles.left)}
      style={{ "--team-color": color }}
    >
      <CountryFlag className={styles.flag} height="1.4em" hide team={team} width="2em" />
      <div className={styles.names}>
        <DisplayTag className={styles.tag} hide team={team} />
        <DisplayName className={styles.name} team={team} />
      </div>
      <IfLosers team={team}>
        <span className={styles.losers}>L</span>
      </IfLosers>
      <Pips team={team} />
    </div>
  );
};

/**
 * In-game overlay with each side on an angled plate in its own top corner and the score shown as
 * game pips. The round sits as a small tab in the top center.
 */
export const CornerScoreboard = () => {
  return (
    <Screen className={styles.screen} padding="0">
      <Plate team={1} />
      <div className={styles.tab}>
        <RoundName className={styles.round} hide />
        <SetLength className={styles.length} hide setLengthTextVariant="short" />
      </div>
      <Plate team={2} />
    </Screen>
  );
};

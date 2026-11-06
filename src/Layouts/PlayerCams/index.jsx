import styles from "./player-cams.module.scss";
import { Screen } from "@Components/Elements/Screen";
import {
  DisplayName,
  DisplayTag,
  Pronoun,
  RoundName,
  Score,
  SetLength,
  useTeam,
} from "@Components/TSH";
import { cx } from "@Utils/cx";

/**
 * A big transparent camera slot with a name plate beneath it. Place the OBS camera source behind
 * the browser source so it shows through the slot.
 *
 * @param {object} props
 * @param {number} props.team Which side to show (1 or 2).
 */
const Cam = ({ team }) => {
  const color = useTeam({ team })?.color;

  return (
    <figure
      className={cx(styles.cam, team === 2 ? styles.two : styles.one)}
      style={{ "--team-color": color }}
    >
      <div className={styles.slot} />
      <figcaption className={styles.plate}>
        <div className={styles.names}>
          <DisplayTag className={styles.tag} hide team={team} />
          <DisplayName className={styles.name} team={team} />
        </div>
        <Pronoun className={styles.pronoun} hide team={team} />
        <Score className={styles.score} team={team} />
      </figcaption>
    </figure>
  );
};

/**
 * Between-games screen: both players' cameras side by side with name plates and scores, and the
 * round name in a small bar above.
 */
export const PlayerCams = () => {
  return (
    <Screen className={styles.screen} gutter="2vw" padding="3vw">
      <header className={styles.header}>
        <RoundName className={styles.round} hide />
        <SetLength className={styles.length} hide setLengthTextVariant="text" />
      </header>
      <div className={styles.cams}>
        <Cam team={1} />
        <Cam team={2} />
      </div>
    </Screen>
  );
};

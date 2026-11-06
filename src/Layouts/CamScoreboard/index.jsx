import styles from "./cam-scoreboard.module.scss";
import { Screen } from "@Components/Elements/Screen";
import {
  CharacterImage,
  Characters,
  DisplayName,
  Pronoun,
  RoundName,
  Score,
  SetLength,
  useTeam,
} from "@Components/TSH";
import { cx } from "@Utils/cx";

/** Which TSH image pack to use for character icons. Check which packs your game provides. */
const ICON_ASSET = "base_files/icon";

/**
 * A transparent camera slot with a name plate under it. Place the OBS camera source behind the
 * browser source so it shows through the slot.
 *
 * @param {object} props
 * @param {boolean} [props.flip] Mirror the plate, for the right-hand side.
 * @param {number} props.team Which side to show (1 or 2).
 */
const Cam = ({ flip = false, team }) => {
  const color = useTeam({ team })?.color;

  return (
    <figure
      className={cx(styles.cam, team === 2 ? styles.two : styles.one, flip && styles.flip)}
      style={{ "--team-color": color }}
    >
      <div className={styles.slot} />
      <figcaption className={styles.plate}>
        <Characters limit={1} team={team}>
          {(character) => (
            <CharacterImage
              asset={ICON_ASSET}
              character={character}
              height="1.7em"
              hide
              team={team}
            />
          )}
        </Characters>
        <DisplayName className={styles.name} team={team} />
        <Pronoun className={styles.pronoun} hide team={team} />
      </figcaption>
    </figure>
  );
};

/**
 * In-game overlay with a compact scoreboard at the top center and a camera slot for each player in
 * the bottom corners.
 */
export const CamScoreboard = () => {
  return (
    <Screen className={styles.screen}>
      <div className={styles.board}>
        <Score className={cx(styles.score, styles.one)} team={1} />
        <div className={styles.info}>
          <RoundName className={styles.round} hide />
          <SetLength className={styles.length} hide setLengthTextVariant="short" />
        </div>
        <Score className={cx(styles.score, styles.two)} team={2} />
      </div>
      <div className={styles.cams}>
        <Cam team={1} />
        <Cam flip team={2} />
      </div>
    </Screen>
  );
};

import styles from "./versus.module.scss";
import { Screen } from "@Components/Elements/Screen";
import {
  CharacterImage,
  Characters,
  CountryFlag,
  DisplayName,
  DisplayTag,
  HeadToHead,
  Record,
  RoundName,
  Seed,
  SetLength,
  useTeam,
} from "@Components/TSH";
import { cx } from "@Utils/cx";

/** Which TSH image pack to use for the big character art. Check which packs your game provides. */
const ART_ASSET = "full";

/**
 * One half of the splash: character art behind the name, with seed, flag and record underneath.
 *
 * @param {object} props
 * @param {boolean} [props.flip] Mirror the half, for the right-hand side.
 * @param {number} props.team Which side to show (1 or 2).
 */
const Half = ({ flip = false, team }) => {
  const color = useTeam({ team })?.color;

  return (
    <section
      className={cx(styles.half, team === 2 ? styles.two : styles.one, flip && styles.flip)}
      style={{ "--team-color": color }}
    >
      <div className={styles.art}>
        <Characters limit={1} team={team}>
          {(character) => (
            <CharacterImage
              asset={ART_ASSET}
              character={character}
              height="100%"
              hide
              team={team}
              width="100%"
            />
          )}
        </Characters>
      </div>
      <div className={styles.details}>
        <DisplayTag className={styles.tag} hide team={team} />
        <DisplayName className={styles.name} team={team} />
        <div className={styles.facts}>
          <CountryFlag height="1.3em" hide team={team} width="1.9em" />
          <Seed className={styles.fact} format={(seed) => `Seed ${seed}`} hide team={team} />
          <Record
            className={styles.fact}
            format={(record) => `Record ${record}`}
            hide
            team={team}
          />
        </div>
      </div>
    </section>
  );
};

/**
 * Full-screen versus splash, split on a diagonal. Each half shows its character art, name, seed
 * and record, with the head-to-head and round in the middle. Panels slide in when the page loads.
 */
export const Versus = () => {
  return (
    <Screen className={styles.screen} gutter="0" padding="0">
      <Half team={1} />
      <Half flip team={2} />
      <div className={styles.center}>
        <RoundName className={styles.round} hide />
        <span className={styles.vs}>VS</span>
        <HeadToHead className={styles.h2h} format={(record) => `H2H ${record}`} hide team={1} />
        <SetLength className={styles.length} hide setLengthTextVariant="text" />
      </div>
    </Screen>
  );
};

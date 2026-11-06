import styles from "./doubles-scoreboard.module.scss";
import { Screen } from "@Components/Elements/Screen";
import {
  CharacterImage,
  Characters,
  DisplayName,
  Gamertag,
  IfSingles,
  Players,
  RoundName,
  Score,
  Scope,
  SetLength,
  Sponsor,
  TeamLogo,
  useTeam,
} from "@Components/TSH";
import { cx } from "@Utils/cx";

/** Which TSH image pack to use for character icons. Check which packs your game provides. */
const ICON_ASSET = "base_files/icon";

/**
 * A character icon for the current player in scope, showing only their first character.
 */
const Icon = () => (
  <Characters limit={1}>
    {(character) => <CharacterImage asset={ICON_ASSET} character={character} height="1.8em" hide />}
  </Characters>
);

/**
 * One team's panel: score, logo, team name and a row for each player. A single player gets just
 * the header, with their character next to the name.
 *
 * @param {object} props
 * @param {boolean} [props.flip] Mirror the panel, for the right-hand team.
 * @param {number} props.team Which side to show (1 or 2).
 */
const Panel = ({ flip = false, team }) => {
  const color = useTeam({ team })?.color;

  return (
    <Scope team={team}>
      <section
        className={cx(styles.panel, team === 2 ? styles.two : styles.one, flip && styles.flip)}
        style={{ "--team-color": color }}
      >
        <Score className={styles.score} />
        <div className={styles.body}>
          <header className={styles.header}>
            <TeamLogo className={styles.logo} hide height="2.6em" />
            <DisplayName className={styles.team} />
            <IfSingles>
              <Icon />
            </IfSingles>
          </header>
          <IfSingles not>
            <ul className={styles.roster}>
              <Players>
                {(player) => (
                  <li className={styles.player}>
                    <Scope player={player}>
                      <Sponsor className={styles.sponsor} hide />
                      <Gamertag className={styles.gamertag} />
                      <Icon />
                    </Scope>
                  </li>
                )}
              </Players>
            </ul>
          </IfSingles>
        </div>
      </section>
    </Scope>
  );
};

/**
 * Scoreboard for doubles and bigger teams: each team gets a panel listing every player with their
 * character. Singles teams still work, collapsing to a header.
 */
export const DoublesScoreboard = () => {
  return (
    <Screen className={styles.screen}>
      <Panel team={1} />
      <div className={styles.center}>
        <RoundName className={styles.round} hide />
        <SetLength className={styles.length} hide setLengthTextVariant="text" />
      </div>
      <Panel flip team={2} />
    </Screen>
  );
};

import styles from "./crew-battle.module.scss";
import { Screen } from "@Components/Elements/Screen";
import { useSelector } from "@Components/TSH/createField";
import {
  BattleCounter,
  CharacterImage,
  Gamertag,
  Players,
  Scope,
  TeamBattleCounterTotal,
  TeamBattleMode,
  TeamBattlePhase,
  TeamBattleRoundName,
  TeamBattleScore,
  TeamName,
  Characters,
} from "@Components/TSH";
import { getPerson } from "@State/selectors";
import { cx } from "@Utils/cx";

/** Which TSH image pack to use for character icons. Check which packs your game provides. */
const ICON_ASSET = "base_files/icon";

/**
 * One fighter in a crew. The one playing now is highlighted and eliminated fighters are crossed
 * out and dimmed.
 *
 * @param {object} props
 * @param {number} props.player Which fighter on the team.
 * @param {number} props.team Which crew (1 or 2).
 */
const Fighter = ({ player, team }) => {
  const { active, dead } = useSelector(
    (tsh, props) => {
      const person = getPerson(tsh, props);

      return { active: Boolean(person?.active), dead: Boolean(person?.dead) };
    },
    { player, source: "teamBattle", team },
  );

  return (
    <li className={cx(styles.fighter, active && styles.active, dead && styles.dead)}>
      <Scope player={player}>
        <span className={styles.icon}>
          <Characters limit={1}>
            {(character) => (
              <CharacterImage asset={ICON_ASSET} character={character} height="2.4em" hide />
            )}
          </Characters>
        </span>
        <Gamertag className={styles.name} />
        <BattleCounter className={styles.counter} fallback="-" />
      </Scope>
    </li>
  );
};

/**
 * One crew: its name and totals, then every fighter.
 *
 * @param {object} props
 * @param {boolean} [props.flip] Mirror the crew, for the right-hand side.
 * @param {number} props.team Which crew (1 or 2).
 */
const Crew = ({ flip = false, team }) => {
  return (
    <Scope team={team}>
      <section
        className={cx(styles.crew, team === 2 ? styles.two : styles.one, flip && styles.flip)}
      >
        <header className={styles.header}>
          <TeamName className={styles.team} fallback={`Team ${team}`} />
          <div className={styles.totals}>
            <span className={styles.label}>Score</span>
            <TeamBattleScore className={styles.total} fallback="0" team={team} />
            <span className={styles.label}>Left</span>
            <TeamBattleCounterTotal className={styles.total} fallback="-" team={team} />
          </div>
        </header>
        <ul className={styles.roster}>
          <Players>{(player) => <Fighter player={player} team={team} />}</Players>
        </ul>
      </section>
    </Scope>
  );
};

/**
 * Crew battle overlay: both crews' fighters side by side with a counter for each, the fighter
 * playing now highlighted and eliminated fighters crossed out. Reads TSH's team battle.
 */
export const CrewBattle = () => {
  return (
    <Screen className={styles.screen} padding="2vw">
      <Scope source="teamBattle">
        <Crew team={1} />
        <div className={styles.center}>
          <TeamBattleRoundName className={styles.round} hide />
          <TeamBattlePhase className={styles.phase} hide />
          <TeamBattleMode className={styles.mode} hide format={(mode) => mode.replace(/_/g, " ")} />
        </div>
        <Crew flip team={2} />
      </Scope>
    </Screen>
  );
};

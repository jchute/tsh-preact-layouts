import styles from "./victory.module.scss";
import { Screen } from "@Components/Elements/Screen";
import { useSelector } from "@Components/TSH/createField";
import {
  CharacterImage,
  Characters,
  CountryFlag,
  DisplayName,
  DisplayTag,
  RoundName,
  Score,
  Scope,
  useTeam,
} from "@Components/TSH";
import { getScore, getScoreboard } from "@State/selectors";

/** Which TSH image pack to use for the big character art. Check which packs your game provides. */
const ART_ASSET = "full";

/**
 * Works out who won the set from the scores, once a side has reached the games needed. Without a
 * known set length, the side ahead is used. Returns the leading side while the set is undecided so
 * the screen can still preview.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} props Scope props, such as `scoreboard`.
 * @returns {{ winner?: 1|2, decided: boolean }} The winning side, and whether the set is over.
 */
const findWinner = (tsh, props) => {
  const first = getScore(tsh, { ...props, team: 1 });
  const second = getScore(tsh, { ...props, team: 2 });
  const needed = Number(getScoreboard(tsh, props)?.first_to) || 0;

  if (first === second) {
    return { decided: false };
  }

  const winner = first > second ? 1 : 2;

  return { decided: needed > 0 && Math.max(first, second) >= needed, winner };
};

/**
 * Set winner screen: a spotlight on the winner with their character, the final score and who they
 * beat. Scales in when it loads.
 */
export const Victory = () => {
  const { decided, winner } = useSelector(findWinner);
  const color = useTeam({ team: winner })?.color;

  if (!winner) {
    return (
      <Screen className={styles.screen}>
        <p className={styles.waiting}>Waiting for a result…</p>
      </Screen>
    );
  }

  const loser = winner === 1 ? 2 : 1;

  return (
    <Screen className={styles.screen} gutter="0" padding="0">
      <div className={styles.stage} style={{ "--team-color": color }}>
        <Scope team={winner}>
          <div className={styles.art}>
            <Characters limit={1}>
              {(character) => (
                <CharacterImage
                  asset={ART_ASSET}
                  character={character}
                  height="100%"
                  hide
                  width="100%"
                />
              )}
            </Characters>
          </div>
          <div className={styles.card}>
            <span className={styles.label}>{decided ? "Winner" : "Leading"}</span>
            <DisplayTag className={styles.tag} hide />
            <DisplayName className={styles.name} />
            <CountryFlag className={styles.flag} height="2em" hide width="3em" />
          </div>
        </Scope>

        <div className={styles.result}>
          <Scope team={winner}>
            <Score className={styles.score} />
          </Scope>
          <span className={styles.dash}>-</span>
          <Scope team={loser}>
            <Score className={styles.score} />
          </Scope>
          <div className={styles.beat}>
            <span>over</span>
            <Scope team={loser}>
              <DisplayName className={styles.loser} />
            </Scope>
          </div>
          <RoundName className={styles.round} hide />
        </div>
      </div>
    </Screen>
  );
};

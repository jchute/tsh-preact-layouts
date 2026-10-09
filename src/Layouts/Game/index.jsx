import styles from "./styles.module.scss";
import { Player } from "./Player";
import { Round } from "./Round";
import { Screen } from "@Components/Elements/Screen";
import { MergedName } from "@Components/TSH";

/**
 * Overlay shown during gameplay: a scoreboard with both sides and the round between them, plus the
 * casters' names. Casters without a name are left out.
 */
export const Game = () => {
  return (
    <Screen className={styles.screen}>
      <div className={styles.scoreboard}>
        <Player className={styles.red} team={1} />
        <Round />
        <Player className={styles.blue} team={2} flip />
      </div>

      <div className={styles.casters}>
        {[1, 2].map((caster) => (
          <MergedName key={caster} caster={caster} hide />
        ))}
      </div>
    </Screen>
  );
};

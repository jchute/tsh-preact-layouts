import styles from "./game.module.scss";
import { Player } from "./Player";
import { Round } from "./Round";
import { Screen } from "@Components/Elements/Screen";
import { Commentators, MergedName } from "@Components/TSH";

/**
 * Overlay shown during gameplay: a scoreboard with both sides and the round between them, plus the
 * commentators' names. Commentators without a name are left out.
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
        <Commentators>
          {(commentator) => <MergedName source="commentary" commentator={commentator} />}
        </Commentators>
      </div>
    </Screen>
  );
};

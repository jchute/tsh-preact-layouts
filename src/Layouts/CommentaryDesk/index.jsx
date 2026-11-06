import styles from "./commentary-desk.module.scss";
import { Screen } from "@Components/Elements/Screen";
import { useSelector } from "@Components/TSH/createField";
import {
  Commentators,
  Gamertag,
  Pronoun,
  Scope,
  Sponsor,
  Twitter,
  TournamentName,
} from "@Components/TSH";
import { getCommentators } from "@State/selectors";

/** The most casters shown side by side; the rest are left out. */
const MAX_CASTERS = 4;

/**
 * Commentary desk: one camera slot per caster with their name, pronouns and Twitter handle.
 * Casters without a name are left out and the grid adapts to however many remain, up to four.
 */
export const CommentaryDesk = () => {
  const count = Math.min(
    MAX_CASTERS,
    Object.values(useSelector(getCommentators)).filter((caster) => caster?.name).length,
  );

  return (
    <Screen className={styles.screen} gutter="2vw" padding="3vw">
      <header className={styles.header}>
        <span className={styles.kicker}>On commentary</span>
        <TournamentName className={styles.tournament} hide />
      </header>

      <div className={styles.desk} style={{ "--count": Math.max(count, 1) }}>
        <Commentators limit={MAX_CASTERS}>
          {(commentator) => (
            <Scope commentator={commentator} source="commentary">
              <figure className={styles.caster}>
                {/* Transparent so the camera behind the browser source shows through */}
                <div className={styles.slot} />
                <figcaption className={styles.plate}>
                  <Sponsor className={styles.sponsor} hide />
                  <Gamertag className={styles.name} />
                  <div className={styles.meta}>
                    <Pronoun hide />
                    <Twitter format={(handle) => `@${String(handle).replace(/^@/, "")}`} hide />
                  </div>
                </figcaption>
              </figure>
            </Scope>
          )}
        </Commentators>
      </div>
    </Screen>
  );
};

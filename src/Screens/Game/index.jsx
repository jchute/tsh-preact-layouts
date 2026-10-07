import styles from "./styles.module.scss";
import { Player } from "./Player";
import { Round } from "./Round";
import { Screen } from "@Components/Elements/Screen";
import { CasterName } from "@Components/TSH";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

export const Game = () => {
  return (
    <Screen className={styles.screen}>
      <div className={styles.scoreboard}>
        <Player className={styles.red} team={1} />
        <Round />
        <Player className={styles.blue} team={2} flip />
      </div>

      <div className={styles.casters}>
        <CasterName
          caster={1}
          suffix={<FontAwesomeIcon className={styles.icon} icon={faMicrophone} />}
          hide
        />
        <CasterName
          caster={2}
          suffix={<FontAwesomeIcon className={styles.icon} icon={faMicrophone} />}
          hide
        />
      </div>
    </Screen>
  );
};

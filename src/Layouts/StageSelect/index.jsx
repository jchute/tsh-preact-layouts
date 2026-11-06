import styles from "./stage-select.module.scss";
import { Image } from "@Components/Elements/Image";
import { Screen } from "@Components/Elements/Screen";
import { useSelector } from "@Components/TSH/createField";
import {
  DisplayName,
  RulesetName,
  Scope,
  Stages,
  StageName,
  StageStrikeGame,
} from "@Components/TSH";
import {
  getStage,
  getStageStrike,
  getStageStrikeTurn,
  getStageStruckBy,
  isStageBanned,
  isStageSelected,
  isStageStrikePicking,
  isStageStruck,
} from "@State/selectors";
import { resolveAsset } from "@State/tsh";
import { cx } from "@Utils/cx";

/**
 * One stage in the grid: struck stages are crossed out and say who struck them, banned stages are
 * greyed out, and the picked stage is highlighted.
 *
 * @param {object} props
 * @param {number} props.stage Which stage in the ruleset's list (starters, then counterpicks).
 */
const StageCard = ({ stage }) => {
  const { banned, image, selected, struck, struckBy } = useSelector(
    (tsh, props) => ({
      banned: isStageBanned(tsh, props),
      image: resolveAsset(getStage(tsh, props)?.path),
      selected: isStageSelected(tsh, props),
      struck: isStageStruck(tsh, props),
      struckBy: getStageStruckBy(tsh, props),
    }),
    { all: true, stage },
  );

  return (
    <li
      className={cx(
        styles.stage,
        struck && styles.struck,
        banned && styles.banned,
        selected && styles.selected,
      )}
    >
      <div className={styles.picture}>
        <Image height="100%" hide src={image} width="100%" />
        {struck && (
          <div className={cx(styles.stamp, struckBy === 2 ? styles.two : styles.one)}>
            <span>Struck</span>
            <Scope team={struckBy}>
              <DisplayName className={styles.striker} />
            </Scope>
          </div>
        )}
        {!struck && banned && <div className={styles.stamp}>Banned</div>}
        {selected && <div className={cx(styles.stamp, styles.pick)}>Selected</div>}
      </div>
      <StageName all className={styles.stageName} stage={stage} />
    </li>
  );
};

/**
 * Stage select: every starter and counterpick stage in a grid, with a banner for whose turn it is
 * and whether they are striking or picking. Follows TSH's stage strike.
 */
export const StageSelect = () => {
  const { gentlemans, picking, turn } = useSelector((tsh, props) => ({
    gentlemans: Boolean(getStageStrike(tsh, props)?.gentlemans),
    picking: isStageStrikePicking(tsh, props),
    turn: getStageStrikeTurn(tsh, props),
  }));
  const action = picking ? "pick a stage" : "strike a stage";

  return (
    <Screen className={styles.screen} padding="3vw">
      <header className={styles.header}>
        <RulesetName className={styles.ruleset} hide />
        <StageStrikeGame className={styles.game} format={(game) => `Game ${game}`} hide />
      </header>

      <div className={cx(styles.banner, turn === 2 ? styles.two : styles.one)}>
        {gentlemans ? (
          "Gentleman's agreement"
        ) : turn ? (
          <>
            <Scope team={turn}>
              <DisplayName className={styles.turnName} />
            </Scope>
            <span>to {action}</span>
          </>
        ) : (
          "Waiting for rock-paper-scissors"
        )}
      </div>

      <ul className={styles.grid}>
        <Stages all>{(stage) => <StageCard stage={stage} />}</Stages>
      </ul>
    </Screen>
  );
};

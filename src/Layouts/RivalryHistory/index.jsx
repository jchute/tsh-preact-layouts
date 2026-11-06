import styles from "./rivalry-history.module.scss";
import { Screen } from "@Components/Elements/Screen";
import { useSelector } from "@Components/TSH/createField";
import {
  CharacterImage,
  Characters,
  DisplayName,
  HeadToHead,
  RecentSetDate,
  RecentSetEvent,
  RecentSetRound,
  RecentSets,
  RecentSetScore,
  RecentSetTournament,
  IfRecentSetOnline,
  RoundName,
} from "@Components/TSH";
import { getRecentSet, getRecentSets, getScoreboard } from "@State/selectors";
import { cx } from "@Utils/cx";

/** Which TSH image pack to use for character icons. Check which packs your game provides. */
const ICON_ASSET = "base_files/icon";

/** How many previous meetings to list. */
const MAX_ROWS = 6;

/**
 * Characters one team played in a past set.
 *
 * @param {object} props
 * @param {number} props.recentSet Which past set.
 * @param {number} props.team Which side's characters (1 or 2).
 */
const Played = ({ recentSet, team }) => (
  <span className={styles.played}>
    <Characters recentSet={recentSet} team={team}>
      {(character) => (
        <CharacterImage
          asset={ICON_ASSET}
          character={character}
          height="1.5em"
          hide
          recentSet={recentSet}
          team={team}
        />
      )}
    </Characters>
  </span>
);

/**
 * One previous meeting. The winner's side is highlighted.
 *
 * @param {object} props
 * @param {number} props.recentSet Which past set.
 */
const Meeting = ({ recentSet }) => {
  // TSH marks the winner as 0 for team 1 and 1 for team 2
  const winner = useSelector((tsh, props) => getRecentSet(tsh, props)?.winner, { recentSet });

  return (
    <li className={styles.row}>
      <div className={styles.when}>
        <RecentSetDate className={styles.date} hide />
        <IfRecentSetOnline recentSet={recentSet}>
          <span className={styles.online}>Online</span>
        </IfRecentSetOnline>
      </div>
      <div className={styles.what}>
        <RecentSetTournament className={styles.tournament} recentSet={recentSet} />
        <span className={styles.event}>
          <RecentSetEvent hide recentSet={recentSet} />
          <RecentSetRound hide recentSet={recentSet} />
        </span>
      </div>
      <div className={cx(styles.side, winner === 0 && styles.winner)}>
        <Played recentSet={recentSet} team={1} />
      </div>
      <RecentSetScore className={styles.score} hide recentSet={recentSet} team={1} />
      <div className={cx(styles.side, styles.right, winner === 1 && styles.winner)}>
        <Played recentSet={recentSet} team={2} />
      </div>
    </li>
  );
};

/**
 * Head-to-head history between the two players: their overall record, then every previous meeting
 * with date, tournament, round, score and the characters each one played. Handles TSH still
 * loading the history, and players who haven't met.
 */
export const RivalryHistory = () => {
  const { loading, count } = useSelector((tsh, props) => ({
    count: Object.keys(getRecentSets(tsh, props)).length,
    loading: getScoreboard(tsh, props)?.recent_sets?.state === "loading",
  }));

  return (
    <Screen className={styles.screen} padding="3vw">
      <header className={styles.header}>
        <DisplayName className={styles.name} team={1} />
        <div className={styles.record}>
          <span className={styles.label}>Head to head</span>
          <HeadToHead className={styles.h2h} fallback="0 - 0" team={1} />
          <RoundName className={styles.round} hide />
        </div>
        <DisplayName className={cx(styles.name, styles.right)} team={2} />
      </header>

      <ol className={styles.list}>
        <RecentSets limit={MAX_ROWS}>{(recentSet) => <Meeting recentSet={recentSet} />}</RecentSets>
      </ol>

      {loading && <p className={styles.notice}>Loading previous meetings…</p>}
      {!loading && count === 0 && <p className={styles.notice}>First time these two have met.</p>}
    </Screen>
  );
};

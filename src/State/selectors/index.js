/**
 * Selectors: functions that find a piece of TSH's program_state.json.
 *
 * They all share one shape, `(tsh, props) => value`, so a component can pass its own props.
 *
 * Selectors find objects (a player, a set, the tournament). Components read the individual fields.
 */
export * from "./bracket";
export * from "./characters";
export * from "./general";
export * from "./people";
export * from "./score";
export * from "./sets";

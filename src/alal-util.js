/**
 * Utility methods and constants for the Alchemy Almanac application
 *
 * @module alal5e/util
 *
 * @author Draico Dorath
 * @copyright 2018
 * @license MIT
 */

const Skills = {
    ARCANA: "-L67hi92iZC9Mk9QirM-",
    NATURE: "-L67hi92iZC9Mk9QirM7",
    RELIGION: "-L67hi92iZC9Mk9QirMB",
    SURVIVAL: "-L67hi92iZC9Mk9QirME"
};

const Abilities = {
    INT: "intelligence_mod",
    WIS: "wisdom_mod"
};

const prefix = "alal-";
const commandPrefix = `!${prefix}`;
const skillPrefix = "repeating_skill";

export {
    Abilities,
    Skills,
    prefix,
    commandPrefix,
    skillPrefix
}
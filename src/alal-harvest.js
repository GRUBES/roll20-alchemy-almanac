/**
 * Core module for creature harvesting logic in Alchemy Almanac
 *
 * @module alal5e/harvest/core
 *
 * @author Eric T Grubaugh
 * @copyright 2018 Zone & Co
 * @license MIT
 */

import * as AlchemyUtil from "./alal-util";

const SPEAKING_AS = "Harvester";

/**
 * Enumerates Creature Types and maps each to the appropriate Skill check for harvesting
 *
 * @enum {AlchemyUtil.Skills}
 * @readonly
 */
const CreatureTypes = {
    BEAST: 0,
    DRAGON: 1,
    MONSTROSITY: 2,
    PLANT: 3,
    GIANT: 4,
    HUMANOID: 5,
    CELESTIAL: 6,
    FEY: 7,
    FIEND: 8,
    UNDEAD: 9,
    ABERRATION: 10,
    CONSTRUCT: 11,
    ELEMENTAL: 12,
    OOZE: 13,
    NONE: 99
};

function harvest(characterId, targetId) {
    let character = getObj("character", characterId);
    let target = getObj("character", targetId);

    if (!isHarvestable(target)) {
        sendChat(SPEAKING_AS, "Nothing useful can be obtained from this creature.", {noarchive: true});
    }

    let roll = generateHarvestRoll(character, target);
    sendChat(SPEAKING_AS, roll, null, {noarchive: true});
}

// Determines whether the given character object can be harvested
function isHarvestable(character) {
    return (creatureType(character) !== CreatureTypes.NONE);
}

function generateHarvestRoll(character, target) {
    let skill = skillByCreatureType(creatureType(target));
    let dice = hasAdvantage(character, skill) ? "2d20kh1" : "1d20";
    let rollDC = dc(challengeRating(target));

    return `/r {${dice}${ShapedUtil.skillModifier(character, skill)}}>${rollDC}`;
}

// Retrieves Challenge Rating of given Character
function challengeRating(character) {
    return (parseInt(getAttrByName(character.id, "challenge"), 10) || 0);
}

// Gives Harvesting DC based on given Challenge Rating
function dc(challenge) {
    if (challenge < 6) { return 12; }
    if (challenge < 11) { return 15; }
    if (challenge < 16) { return 18; }
    return 21;
}

function isAlchemyProficient(character) {
    let proficiencies = getAttrByName(character.id, "proficiencies");
    return /\balchemist's supplies\b/i.test(proficiencies);
}

function hasAdvantage(character, skill) {
    return (ShapedUtil.isProficient(character, skill) && isAlchemyProficient(character, skill));
}

function creatureType(character) {
    let type = getAttrByName(character.id, "type");
    return (type ? CreatureTypes[type.toUpperCase()] : CreatureTypes.NONE);
}

function skillByCreatureType(type) {
    if (_.contains([
        CreatureTypes.BEAST,
        CreatureTypes.DRAGON,
        CreatureTypes.MONSTROSITY,
        CreatureTypes.PLANT
    ], type)) {
        return ShapedUtil.Skills.NATURE;
    }

    if (_.contains([
        CreatureTypes.GIANT,
        CreatureTypes.HUMANOID
    ], type)) {
        return ShapedUtil.Skills.SURVIVAL
    }

    if (_.contains([
        CreatureTypes.CELESTIAL,
        CreatureTypes.FEY,
        CreatureTypes.FIEND,
        CreatureTypes.UNDEAD
    ], type)) {
        return ShapedUtil.Skills.RELIGION;
    }

    if (_.contains([
        CreatureTypes.ABERRATION,
        CreatureTypes.CONSTRUCT,
        CreatureTypes.ELEMENTAL,
        CreatureTypes.OOZE
    ], type)) {
        return ShapedUtil.Skills.ARCANA
    }

    throw {
        name: "ALAL_HARVEST_NO_SKILL_FOUND",
        message: `No matching skill was found for creature type ${type}`
    }
}

on("ready", () => { log("[AA] Harvesting module loaded."); });

export { harvest }
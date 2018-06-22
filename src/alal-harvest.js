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
    BEAST: AlchemyUtil.Skills.NATURE,
    DRAGON: AlchemyUtil.Skills.NATURE,
    MONSTROSITY: AlchemyUtil.Skills.NATURE,
    PLANT: AlchemyUtil.Skills.NATURE,
    GIANT: AlchemyUtil.Skills.SURVIVAL,
    HUMANOID: AlchemyUtil.Skills.SURVIVAL,
    CELESTIAL: AlchemyUtil.Skills.RELIGION,
    FEY: AlchemyUtil.Skills.RELIGION,
    FIEND: AlchemyUtil.Skills.RELIGION,
    UNDEAD: AlchemyUtil.Skills.RELIGION,
    ABERRATION: AlchemyUtil.Skills.ARCANA,
    CONSTRUCT: AlchemyUtil.Skills.ARCANA,
    ELEMENTAL: AlchemyUtil.Skills.ARCANA,
    OOZE: AlchemyUtil.Skills.ARCANA,
    NONE: 0
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
    let skill = creatureType(target);
    let dice = hasAdvantage(character, skill) ? "2d20kh1" : "1d20";
    let rollDC = dc(challengeRating(target));

    return `/r {${dice}${skillMod(character, skill)}}>${rollDC}`;
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

function isSkillProficient(character, skill) {
    let attribute = "proficiency";
    let proficiency = getAttrByName(character.id, `${AlchemyUtil.skillPrefix}_${skill}_${attribute}`);
    return (_.contains(["proficient", "expertise"], proficiency));
}

function isAlchemyProficient(character) {
    let proficiencies = getAttrByName(character.id, "proficiencies");
    return /\balchemist's supplies\b/i.test(proficiencies);
}

function hasAdvantage(character, skill) {
    return (isSkillProficient(character, skill) && isAlchemyProficient(character, skill));
}

function skillMod(character, skill) {
    let attribute = "total_with_sign";
    return getAttrByName(character.id, `${AlchemyUtil.skillPrefix}_${skill}_${attribute}`);
}

function creatureType(character) {
    let type = getAttrByName(character.id, "type");
    return (type ? CreatureTypes[type.toUpperCase()] : CreatureTypes.NONE);
}

on("ready", () => { log("[AA] Harvesting module loaded."); });

export { harvest }
/**
 * Core module containing gathering logic for Alchemy Almanac
 *
 * @module alal5e/gather/core
 *
 * @requires module:alal5e/util
 *
 * @author Draico Dorath
 * @copyright 2018
 * @license MIT
 */

import * as AlchemyUtils from "./alal-util";

const SPEAKING_AS = "Gatherer";
const CRIT_SUCCESS_MOD = 10;
const ROLL_TEMPLATE = "5e-shaped";

// FIXME Hate storing state like this
var tableName = "";

function gather(characterId, dc, env) {
    let character = getObj("character", characterId);
    tableName = tableByEnv(env);

    dc = parseInt(dc, 10);

    let roll = generateNatureRoll(character, dc);
    sendChat(SPEAKING_AS, roll, onRoll, {noarchive: true});
}

function tableByEnv(env) {
    return AlchemyUtils.prefix + env.toLowerCase();
}

function generateNatureRoll(character, dc) {
    let dice = hasAdvantage(character) ? "2d20kh1" : "1d20";
    return `/r {${dice}${ShapedUtil.skillModifier(character, ShapedUtil.Skills.NATURE)}}>${dc}`;
}

function hasAdvantage(character) {
    return (
        ShapedUtil.isProficient(character, ShapedUtil.Skills.NATURE) &&
        isHerbalismProficient(character)
    );
}

function isHerbalismProficient(character) {
    let proficiencies = getAttrByName(character.id, "proficiencies");
    return /\bherbalism kit\b/i.test(proficiencies);
}

function onRoll(ops) {
    let op = _.head(ops);
    let roll = JSON.parse(op.content);

    (isSuccess(roll)) ?
        onSuccess(roll, op.origRoll) :
        onFailure(roll);
}

function getDc(roll) {
    return _.head(roll.rolls).mods.success.point;
}

function isSuccess(roll) {
    return Boolean(roll.total);
}

function getTotal(roll) {
    return _.head(roll.rolls).results[0].v;
}

function onSuccess(roll, origRoll) {
    let dc = getDc(roll);
    let crit = dc + CRIT_SUCCESS_MOD;
    let rollCount = (getTotal(roll) >= crit) ? 3 : 1;
    let tableRolls = _.times(rollCount, tableRoll, tableName).join(",");
    let withAdvantage = /2d20kh1/.test(origRoll) ? 1 : 0;

    let msg = [
        `&{template:${ROLL_TEMPLATE}}`,
        "{{title=Gathering Herbs}}",
        `{{2d20kh1=${withAdvantage}}}`,
        `{{roll1=[[${getTotal(roll)}]]}}`,
        `{{content=vs [[${dc}]]}}`,
        "{{text_center=Success!}}",
        `{{text={${tableRolls}}}}`,
        "{{action=1}}"
    ].join(" ");

    sendChat(SPEAKING_AS, msg, null, {noarchive: true});

}

function onFailure(roll, origRoll) {
    let withAdvantage = /2d20kh1/.test(origRoll) ? 1 : 0;

    let msg = [
        `&{template:${ROLL_TEMPLATE}}`,
        "{{title=Gathering Herbs}}",
        `{{2d20kh1=${withAdvantage}}}`,
        `{{roll1=[[${getTotal(roll)}]]}}`,
        `{{content=vs [[${getDc(roll)}]]}}`,
        "{{text_center=Unsuccessful}}",
        "{{action=1}}"
    ].join(" ");

    sendChat(SPEAKING_AS, msg, null, {noarchive: true});
}

function tableRoll() {
    return `[[1t[${this}]]]`;
}

on("ready", () => { log("[AA] Gathering module loaded."); });

export { gather }
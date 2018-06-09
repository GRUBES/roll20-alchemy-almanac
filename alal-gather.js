var AlchemyGatherer = (() => {
    'use strict';    
    
    const SPEAKING_AS = "Gatherer";
    const SKILL_PREFIX = "repeating_skill";
    const NATURE_PREFIX = `${SKILL_PREFIX}_${AlchemyUtils.skills.NATURE}`;
    const CRIT_SUCCESS_MOD = 10;
    const ROLL_TEMPLATE = "5e-shaped";
    
    // FIXME Hate storing state like this
    var tableName = "";
    
    function gather(content) {
        let [characterId, dc, env] = _.tail(content.split(/\s+/));
        let character = getObj("character", characterId);
        tableName = tableByEnv(env);
        
        dc = parseInt(dc, 10);

        let roll = generateNatureRoll(character, dc);
        log(`[AA:gather] ${roll}`);
        sendChat(SPEAKING_AS, roll, onRoll, {noarchive: true});
    }
    
    function tableByEnv(env) {
        return AlchemyUtils.prefix + env.toLowerCase();
    }
    
    function generateNatureRoll(character, dc) {
        let dice = hasAdvantage(character) ? "2d20kh1" : "1d20";
        return `/r {${dice}${natureMod(character)}}>${dc}`;
    }

    function natureMod(character) {
        let attribute = "total_with_sign";
        return (
            getAttrByName(character.id, `${NATURE_PREFIX}_${attribute}`) ||
            getAttrByName(character.id, AlchemyUtils.abilities.INT)
        );
    }
    
    function hasAdvantage(character) {
        return (
            isNatureProficient(character) &&
            isHerbalismProficient(character)
        );
    }
    
    function isNatureProficient(character) {
        let attribute = "proficiency"
        return (getAttrByName(character.id, `${NATURE_PREFIX}_${attribute}`));
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
        log("[AA:gather] Gathering succeeded");
        
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
        log("[AA:gather] Gathering failed");
        
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
    
    return {
        gather: gather
    };
})();
var AlchemyUtils = (() => {
    'use strict';
    
    const prefix = "alal-";
    const namespace = `!${prefix}`;
    const skills = {
        NATURE: "-L67hi92iZC9Mk9QirM7"
    };
    const abilities = {
        INT: "intelligence_mod"
    };
    
    function isCommand(msg) {
        return (
            (msg.type === "api") &&
            msg.content.startsWith(namespace)
        );
    }
    
    function parseCommand(msg) {
        return msg.content
            .split(" ")[0]
            .toLowerCase()
            .replace(namespace, "");
    }
    
    return {
        prefix: prefix,
        abilities: abilities,
        skills: skills,
        isCommand: isCommand,
        parseCommand: parseCommand
    };
})();
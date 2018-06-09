(() => {
    'use strict';
    
    on("ready", () => { log("[AA] Loaded."); });
    on("chat:message", routeApiCall);
    
    function routeApiCall(msg) {
        const router = {
            "gather": AlchemyGatherer.gather
        };
        
        if (!AlchemyUtils.isCommand(msg)) { return; }
        
        let command = AlchemyUtils.parseCommand(msg);
        
        if (typeof router[command] === "function") {
            router[command](msg.content);
        };
    }
})();
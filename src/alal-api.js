/**
 * Entry point module for the Alchemy Almanac
 *
 * @module alal5e/alchemy/api
 *
 * @author Draico Dorath
 * @copyright 2018
 * @license MIT
 */

import { version } from "../package.json";

import * as AlchemyUtils from "./alal-util";
import * as AlchemyGatherer from "./alal-gather";
import * as AlchemyHarvester from "./alal-harvest";

on("ready", () => {
    const routes = {
        "gather": AlchemyGatherer.gather,
        "harvest": AlchemyHarvester.harvest
    };

    on("chat:message", ApiRouter(AlchemyUtils.commandPrefix, routes));

    log(`[AA] v${version} loaded.`);
});
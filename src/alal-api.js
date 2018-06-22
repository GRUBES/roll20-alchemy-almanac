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

/**
 * Handler method for chat messages
 *
 * @param msg {Object} Roll20 chat message data
 *
 * @returns {void}
 *
 * @private
 * @function route
 */
function route(msg) {
    if (!isCommand(msg)) { return; }

    execute(parseCommand(msg), parseInput(msg));
}

/**
 * Determines whether the given chat message is an Alchemy command
 *
 * @param msg {Object} Roll20 chat message data
 *
 * @returns {Boolean} true if the message is a Alchemy command; false otherwise
 *
 * @private
 * @function isCommand
 */
function isCommand(msg) {
    return (
        (msg.type === "api") &&
        msg.content.startsWith(AlchemyUtils.commandPrefix)
    );
}

/**
 * Parses the API command out of the given Roll20 chat message
 *
 * @param msg {Object} Roll20 chat message data
 *
 * @returns {string} The name of the command to execute
 *
 * @private
 * @function parseCommand
 */
function parseCommand(msg) {
    return msg.content
        .split(" ")[0]
        .toLowerCase()
        .replace(AlchemyUtils.commandPrefix, "");
}

/**
 * Strips the command out of the chat message and returns the rest of the input parameters as an Array
 *
 * @param msg {Object} Roll20 chat message
 *
 * @returns {String[]} List of input parameters provided in chat message
 *
 * @private
 * @function parseInput
 */
function parseInput(msg) {
    // Dumb implementation; will break if e.g. needs to accept text strings with spaces in them
    return _.tail(msg.content.split(/\s+/));
}

/**
 * Invokes the given command with the given input on the corresponding route
 *
 * @param command {String} The command to execute
 * @param input {String[]} The raw input parameters to pass to the command
 *
 * @returns {void}
 *
 * @private
 * @function execute
 */
function execute(command, input) {
    const routes = {
        "gather": AlchemyGatherer.gather,
        "harvest": AlchemyHarvester.harvest
    };

    if (!(routes[command] && (typeof routes[command] === "function"))) {
        return;
    }

    routes[command](...input);
}

on("ready", () => { log(`[AA] v${version} loaded.`); });
on("chat:message", route);
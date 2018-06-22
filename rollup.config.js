import json from "rollup-plugin-json";

export default {
    input: "src/alal-api.js",
    output: [{
        file: "dist/alchemy-almanac-5e.js",
        format: "iife",
        globals: {
            "shaped5e-util": "ShapedUtil"
        }
    }],
    plugins: [json()]
}
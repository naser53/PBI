import tseslint from "@typescript-eslint/eslint-plugin";
import pbiVisuals from "eslint-plugin-powerbi-visuals";

export default [
    {
        plugins: { "@typescript-eslint": tseslint, "powerbi-visuals": pbiVisuals }
    }
];

import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var buttonSliderF1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6: IVisualPlugin = {
    name: 'buttonSliderF1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6',
    displayName: 'Button Slider',
    class: 'Visual',
    apiVersion: '5.11.0',
    create: (options?: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = (<any>globalThis).dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["buttonSliderF1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6"] = buttonSliderF1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6;
}
export default buttonSliderF1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6;
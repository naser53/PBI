import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;
import FilterAction = powerbi.FilterAction;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import VisualObjectInstance = powerbi.VisualObjectInstance;

import "./../style/visual.less";

// ─── Embedded Icons (base64) ────────────────────────────────────────────────────
const ICONS: Record<string, string> = {
    filterBW16: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACLSURBVDiNzY+5CYBAEAAH7csKDIy0BjMbMNHE3MwWBFuwBrENwVjwS+7gxG/PyIENbmHmWPgLETACm3BGIDQDjYWspzYDHjBZyJNyDgTALJAXdfIlsSCQ3Mma/EHO3mRNeSFXUhnABXpD7tXuhHMTWIDBeA9qJw6IkQa6L/EWWIHC4qMDKeB/Ea3YASvCUSfyYo3nAAAAAElFTkSuQmCC",
    filterBW24: "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADnSURBVEiJ7dE9SkNBFIbhh6sk/oDYCNYWdjauwMYtWAT3kV3oEoQUKays0+gGbOwsrDWKSAoNIYg2d4qEGzNz7wgWvnCa4Zz3mznDPwmcYoivhjVEZ16+iY8M8lDvWIeiDGihnWMNJe3SOcN5xhecVaUWuMwgv8LKoqe1MGggv8baInlgC7c15HfYXiYP7OA+Qf6A3Vh5YA+PEfJn7KfKAwd4+0E+wmFdeeAI4wr5BMdN5YFeRUAvZrBY3gI+I89qB9TmTwc8ZbsFLsx+cB8bvxEwRTdlcDWy7xUvOMFNSkDKRbKuJBvfnmyfIEkPgGcAAAAASUVORK5CYII=",
    filterBW32: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEkSURBVFiF7dYxSgNBGIbhh6gIgoWNvYWIYOMJbKxEFNErWOkR9Ax2FgF7O4s0VjZ2Qup4ABFsFBHUqESL3QEjMdnsziYQ8sKwMPuz78f87MwwZkw7O7hFC9+RRwsNbP8nX8ZnCeK/4wNLQVr5FWATk1mXqgBT2OgU4HEA8sBTp8kZSf/LbkEjdXVkAfclyh+w2Gt5ViTtiC1/xmoveWANbxHlTaxnlQe2xPktv7DXrzywHyHAYV554LiA/KioPHCSQ34aS06yYZ33Ib/ARMwAJFvoZQb5FaZjywOzqHeR19OazFR6l7TxglqX97W0prQA0RkHGLkA78MMcI3qsAJUJcdt39e6opfQJg5wlvcDeQK8ps877OImrzwvc5Izfn7Q4tHkB1Fo+fC8vTWRAAAAAElFTkSuQmCC",
    filterColored16: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAE9SURBVDiN1ZC/SsNwFIW/m1/+2MQ0Cq2I2PYNBB07O/kAIrq7ODno4FTI4OquDs6+giLiVnDxCRwyFHEp0tamMT+HYLVtStHNA3e5fPecwxUA/bSfoFPFl0QgWGaGIqmFFQMArdUMOE8lABOA3tuAJLYAsAvgFKDdyj8zDPCXAGkCZA1sfwsEdApxF7SePrYH0EIZe0MD2Ti/wVs4RSSDPuL8dNMG24sRtmW1EX03AGT98oQ5/w6AuD95LAJuAHAg1fBhuB7ndHP3hX63zPwiGD9+WwjAcc+kFh6OvGQiKRnUsOyYwftodce9paqOxvEJA6lf93CLdZJEg86qe0GEpXZEGslMAwBZu3ikWL5COeCXwLCOZaXxmseaeUsAlPmcRZiQpu1pWG6D3+i/GCjp/MWggxCBbEolvJ8GfQLlYFcBFoFO9gAAAABJRU5ErkJggg==",
    filterColored24: "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHqSURBVEiJ7ZS/ixNBHMU/39nJJpu9TVQEG3NR4UCwOA/Pv8DCVg6xsBCbs1GwFbQ4yEUbO9uoB5YWh2AnXC3XisdhL2rhkSMYk93NjkVyMTG77vijEXzV7vfNe2/nu98ZATA7txtEX+6RBqWgciyV+gkiMCtSX3+pAJDB2V91yEEBI6cB1F82noEG4Gt3j257mnFLUCxDksD+RwsrgVIw1ABgdkbV0ev21Tb9bnVKM3cYlGP/ucFRcAqAeSb19Wsw2SLfO4V24ylB2LM3LwVDc5HXhPurB+VxgJx5vIdbuYia+C2xZYBTgNIcwAdkcFkWHvVnAgDkXGuL8pG7484lBqIwP6B8CKCHSi5Jrfl+kpqZIllq3cerbo0LUc4uvAo4Ggw3pdbc/pFOHVNZ3rhA0f8EQBxCMkg3d1xwfRAeyonGk7Ql2efg/MI8heKwP3F/lheBchWEV9R272TZZAaIrIVobxFHG8KUAC8Apd+ROFdEnmdsMecky/LGLn5wA5PAIPpOaBdcv4OwIifX2tkOFleFLD5t4Vc2iUcBSg+nxpjrUm+8zdXnLQAwBsWb1ZhiIJR8gA7zjaoIJk9rddmJkBw8jBDbmFsH/An+B/y7AVYT9LsBHYSm7WJtbSu6h+EFTnxLjj/4bCv7Bhzcd2fDMfYoAAAAAElFTkSuQmCC",
    filterColored32: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJ3SURBVFiF7ZY7aBRRFIa/M6/d2ZmsK4JabTZFSsVoWrGx9gWCBARRQYgWlikslk2a1BaKkKwW2tiIYGElgoiYQhCVSPoE0mi2yGNn916Lyb4ym92ZjfiA/HBh5txz//Ofe+5L2Ib+MrlCvXqUXjBMyB7u6RILmhdSmL4IYDSNKjiyd+aYEM40Po1efn8CCQXo3y7Aan6tVzT1QDq7BSwH0l74qxRUVkN7EhgC/qH2cSvNrqZTynuIUnS2OlQ3IKi2yFQdVC1hU6CbwWtouRMRIGPzt8lkP3XNINhIlvFOZHKt5LW+K4XSm2bcnb7648QPttZzERL/YLgNkyLlgZttsD+R4Zlr7d3RRWj4BSy7FrHXtpIHNyxIN4LLe6prtyIuOw0y/mgNzz8byba6mSy40D71y4hxWUbvR7Loug3lePktbm6qo0JKQT2IL8DxwbIBNhEuSL643M1t13NATs7Nksm97DDGnQXDBtcH0GhuSH56YVfXXjxyqnyetNdSHmyBVn2iC3gH2J69WSlMP+uptQ8bjI+O4KRatQv6LMa0D6YN8Jr84r1+9H0FiBSrOO4xTCs8h3uVwbRDAfAdZV4ReV7fswAAGXu8RObATUTCk3C3xZjJAVTAvCQjxZ9xuGNfRnJibh4vVwag2qUMbhZMS6FlQoaL3+LyJroNZax8HXdoMVyMbTej5YDjgdZTUii9SsSZxLkBvXB1E9tJYafCuqc8MKx3Mlw6nZRrsAdJZmgJkfCYdbPhHaH150GoBhMgRvRlYshAr5X/7Um2L2BfwL6Af1qA+vp3BIh8ADkn+ZkHgwy3+rt0jbqKZVdATUq+9HQwjhC/AO6atqJQwHffAAAAAElFTkSuQmCC"
};

// ─── Interfaces ─────────────────────────────────────────────────────────────────
interface IFilterColumnTarget {
    table: string;
    column: string;
}

interface IBasicFilter {
    $schema: string;
    target: IFilterColumnTarget;
    filterType: number;
    operator: string;
    values: (string | number | boolean)[];
}

interface ICollapseSettings {
    enabled: boolean;
    iconStyle: string;
    customIconBase64: string;
    iconSize: number;
    iconPosition: string;
}

interface ITileSettings {
    orientation: string;
    maxTileWidth: number;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontBold: boolean;
    alignment: string;
    defaultBackground: string;
    selectedBackground: string;
    selectedFontColor: string;
    borderRadius: number;
    tileGap: number;
    tilePadding: number;
}

interface ISliderSettings {
    orientation: string;
    trackColor: string;
    selectedTrackColor: string;
    handleColor: string;
    handleSize: number;
    trackHeight: number;
    handleShape: string;
    grabColor: string;
}

interface ILabelSettings {
    labelPosition: string;
    labelOrientation: string;
    labelDensity: string;
    showSelectedRange: boolean;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    maxLabelWidth: number;
}

// ─── Defaults ───────────────────────────────────────────────────────────────────
const DEFAULT_COLLAPSE: ICollapseSettings = {
    enabled: false,
    iconStyle: "filterBW24",
    customIconBase64: "",
    iconSize: 24,
    iconPosition: "topLeft"
};

const DEFAULT_TILE: ITileSettings = {
    orientation: "horizontal",
    maxTileWidth: 0,
    fontFamily: "Segoe UI, sans-serif",
    fontSize: 10,
    fontColor: "#333333",
    fontBold: true,
    alignment: "center",
    defaultBackground: "#ffffff",
    selectedBackground: "#000000",
    selectedFontColor: "#ffffff",
    borderRadius: 3,
    tileGap: 2,
    tilePadding: 3
};

const DEFAULT_SLIDER: ISliderSettings = {
    orientation: "horizontal",
    trackColor: "#605E5C",
    selectedTrackColor: "#605E5C",
    handleColor: "#605E5C",
    handleSize: 10,
    trackHeight: 3,
    handleShape: "line",
    grabColor: "#605E5C"
};

const DEFAULT_LABEL: ILabelSettings = {
    labelPosition: "bottom",
    labelOrientation: "auto",
    labelDensity: "smart",
    showSelectedRange: true,
    fontFamily: "Segoe UI, sans-serif",
    fontSize: 10,
    fontColor: "#666666",
    maxLabelWidth: 60
};

// ─── Visual Class ───────────────────────────────────────────────────────────────
export class Visual implements IVisual {
    private host: IVisualHost;
    private hostElement: HTMLElement;
    private rootElement: HTMLElement;
    private container: HTMLElement;
    private iconElement: HTMLElement | null = null;
    private categories: string[] = [];
    private slicerType: string = "button";

    // ── Button mode state ──
    private selectedIndices: Set<number> = new Set();
    private isDragging: boolean = false;
    private dragStartIndex: number = -1;
    private dragEndIndex: number = -1;

    // ── Slider mode state ──
    private sliderStartIndex: number = 0;
    private sliderEndIndex: number = 0;
    private draggingHandle: "start" | "end" | "range" | null = null;
    private trackElement: HTMLElement | null = null;
    private selectedRangeElement: HTMLElement | null = null;
    private dragStartMousePos: number = 0;
    private dragRangeStartIdx: number = 0;
    private dragRangeEndIdx: number = 0;

    // Settings
    private tileSettings: ITileSettings = { ...DEFAULT_TILE };
    private collapseSettings: ICollapseSettings = { ...DEFAULT_COLLAPSE };
    private sliderSettings: ISliderSettings = { ...DEFAULT_SLIDER };
    private labelSettings: ILabelSettings = { ...DEFAULT_LABEL };
    private isCollapsed: boolean = false;

    // Data model
    private columnTarget: IFilterColumnTarget | null = null;

    // Bound handlers
    private documentMouseUpHandler: () => void;
    private documentMoveHandler: (e: MouseEvent) => void;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.hostElement = options.element;

        // Root wrapper
        this.rootElement = document.createElement("div");
        this.rootElement.className = "bss-root";
        this.hostElement.appendChild(this.rootElement);

        // Content container
        this.container = document.createElement("div");
        this.container.className = "bss-container";
        this.rootElement.appendChild(this.container);

        // Prevent text selection during drag
        this.container.addEventListener("selectstart", (e) => e.preventDefault());

        // Bind document-level handlers
        this.documentMouseUpHandler = () => this.onMouseUp();
        this.documentMoveHandler = (e: MouseEvent) => this.onMouseMove(e);
        document.addEventListener("mouseup", this.documentMouseUpHandler);
        document.addEventListener("mousemove", this.documentMoveHandler);
    }

    public update(options: VisualUpdateOptions): void {
        const dataView: DataView | undefined = options.dataViews?.[0];
        if (!dataView?.categorical?.categories?.[0]) {
            this.clearContainer();
            const placeholder = document.createElement("p");
            placeholder.className = "bss-placeholder";
            placeholder.textContent = "Drop a field here";
            this.container.appendChild(placeholder);
            this.removeIcon();
            return;
        }

        // Read slicer type
        const generalObj = dataView.metadata?.objects?.["general"] || {};
        this.slicerType = this.getStr(generalObj, "slicerType", "button");

        // Read all settings
        this.collapseSettings = this.parseCollapseSettings(dataView);
        this.collapseSettings.enabled = this.getBool(generalObj, "showFilterIcon", false);
        this.tileSettings = this.parseTileSettings(dataView);
        this.sliderSettings = this.parseSliderSettings(dataView);
        this.labelSettings = this.parseLabelSettings(dataView);

        const category = dataView.categorical.categories[0];
        const newCategories = category.values.map((v) => String(v));

        // Keep slider selection valid on data change
        if (JSON.stringify(newCategories) !== JSON.stringify(this.categories)) {
            this.categories = newCategories;
            this.sliderStartIndex = 0;
            this.sliderEndIndex = this.categories.length - 1;
        } else {
            this.categories = newCategories;
        }

        // Column target for filtering
        const queryName = category.source.queryName || "";
        const tableName = queryName.includes(".") ? queryName.split(".")[0] : "";
        this.columnTarget = {
            table: tableName,
            column: category.source.displayName || ""
        };

        this.render();
        this.renderIcon();
        this.applyCollapseState();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SETTINGS PARSING
    // ═══════════════════════════════════════════════════════════════════════════════
    private parseTileSettings(dv: DataView): ITileSettings {
        const o = dv.metadata?.objects?.["tileFormatting"];
        if (!o) return { ...DEFAULT_TILE };
        return {
            orientation: this.getStr(o, "orientation", DEFAULT_TILE.orientation),
            maxTileWidth: this.getNum(o, "maxTileWidth", DEFAULT_TILE.maxTileWidth),
            fontFamily: this.getStr(o, "fontFamily", DEFAULT_TILE.fontFamily),
            fontSize: this.getNum(o, "fontSize", DEFAULT_TILE.fontSize),
            fontColor: this.getFill(o, "fontColor", DEFAULT_TILE.fontColor),
            fontBold: this.getBool(o, "fontBold", DEFAULT_TILE.fontBold),
            alignment: this.getStr(o, "alignment", DEFAULT_TILE.alignment),
            defaultBackground: this.getFill(o, "defaultBackground", DEFAULT_TILE.defaultBackground),
            selectedBackground: this.getFill(o, "selectedBackground", DEFAULT_TILE.selectedBackground),
            selectedFontColor: this.getFill(o, "selectedFontColor", DEFAULT_TILE.selectedFontColor),
            borderRadius: this.getNum(o, "borderRadius", DEFAULT_TILE.borderRadius),
            tileGap: this.getNum(o, "tileGap", DEFAULT_TILE.tileGap),
            tilePadding: this.getNum(o, "tilePadding", DEFAULT_TILE.tilePadding)
        };
    }

    private parseCollapseSettings(dv: DataView): ICollapseSettings {
        const o = dv.metadata?.objects?.["collapseIcon"];
        if (!o) return { ...DEFAULT_COLLAPSE };
        return {
            enabled: false, // will be overridden from general.showFilterIcon
            iconStyle: this.getStr(o, "iconStyle", DEFAULT_COLLAPSE.iconStyle),
            customIconBase64: this.getStr(o, "customIconBase64", DEFAULT_COLLAPSE.customIconBase64),
            iconSize: this.getNum(o, "iconSize", DEFAULT_COLLAPSE.iconSize),
            iconPosition: this.getStr(o, "iconPosition", DEFAULT_COLLAPSE.iconPosition)
        };
    }

    private parseSliderSettings(dv: DataView): ISliderSettings {
        const o = dv.metadata?.objects?.["sliderSettings"];
        if (!o) return { ...DEFAULT_SLIDER };
        return {
            orientation: this.getStr(o, "orientation", DEFAULT_SLIDER.orientation),
            trackColor: this.getFill(o, "trackColor", DEFAULT_SLIDER.trackColor),
            selectedTrackColor: this.getFill(o, "selectedTrackColor", DEFAULT_SLIDER.selectedTrackColor),
            handleColor: this.getFill(o, "handleColor", DEFAULT_SLIDER.handleColor),
            handleSize: this.getNum(o, "handleSize", DEFAULT_SLIDER.handleSize),
            trackHeight: this.getNum(o, "trackHeight", DEFAULT_SLIDER.trackHeight),
            handleShape: this.getStr(o, "handleShape", DEFAULT_SLIDER.handleShape),
            grabColor: this.getFill(o, "grabColor", DEFAULT_SLIDER.grabColor)
        };
    }

    private parseLabelSettings(dv: DataView): ILabelSettings {
        const o = dv.metadata?.objects?.["labelSettings"];
        if (!o) return { ...DEFAULT_LABEL };
        return {
            labelPosition: this.getStr(o, "labelPosition", DEFAULT_LABEL.labelPosition),
            labelOrientation: this.getStr(o, "labelOrientation", DEFAULT_LABEL.labelOrientation),
            labelDensity: this.getStr(o, "labelDensity", DEFAULT_LABEL.labelDensity),
            showSelectedRange: this.getBool(o, "showSelectedRange", DEFAULT_LABEL.showSelectedRange),
            fontFamily: this.getStr(o, "fontFamily", DEFAULT_LABEL.fontFamily),
            fontSize: this.getNum(o, "fontSize", DEFAULT_LABEL.fontSize),
            fontColor: this.getFill(o, "fontColor", DEFAULT_LABEL.fontColor),
            maxLabelWidth: this.getNum(o, "maxLabelWidth", DEFAULT_LABEL.maxLabelWidth)
        };
    }

    // Helpers
    private getStr(o: any, p: string, d: string): string {
        const v = o[p]; return (v == null) ? d : String(v);
    }
    private getNum(o: any, p: string, d: number): number {
        const v = o[p]; if (v == null) return d; const n = Number(v); return isNaN(n) ? d : n;
    }
    private getBool(o: any, p: string, d: boolean): boolean {
        const v = o[p]; return (v == null) ? d : Boolean(v);
    }
    private getFill(o: any, p: string, d: string): string {
        const v = o[p]; if (!v) return d;
        if (typeof v === "object" && v.solid && v.solid.color) return v.solid.color;
        if (typeof v === "string") return v; return d;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // ICON / COLLAPSE
    // ═══════════════════════════════════════════════════════════════════════════════
    private getIconDataUrl(): string {
        const cs = this.collapseSettings;
        if (cs.iconStyle === "custom" && cs.customIconBase64) {
            const b64 = cs.customIconBase64.trim();
            return b64.startsWith("data:") ? b64 : "data:image/png;base64," + b64;
        }
        const iconData = ICONS[cs.iconStyle] || ICONS["filterBW24"];
        return "data:image/png;base64," + iconData;
    }

    private removeIcon(): void {
        if (this.iconElement && this.iconElement.parentNode) {
            this.iconElement.parentNode.removeChild(this.iconElement);
            this.iconElement = null;
        }
    }

    private renderIcon(): void {
        const cs = this.collapseSettings;
        this.removeIcon();
        if (!cs.enabled) return;

        this.iconElement = document.createElement("div");
        this.iconElement.className = "bss-collapse-icon";

        const img = document.createElement("img");
        img.src = this.getIconDataUrl();
        img.width = cs.iconSize;
        img.height = cs.iconSize;
        img.alt = "Toggle Slicer";
        img.draggable = false;
        this.iconElement.appendChild(img);

        this.iconElement.style.width = cs.iconSize + "px";
        this.iconElement.style.height = cs.iconSize + "px";
        this.iconElement.classList.add("pos-" + cs.iconPosition);

        this.iconElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this.isCollapsed = !this.isCollapsed;
            this.applyCollapseState();
        });

        this.rootElement.appendChild(this.iconElement);
    }

    private applyCollapseState(): void {
        if (!this.collapseSettings.enabled) {
            this.container.classList.remove("collapsed");
            this.rootElement.classList.remove("collapsed-root");
            this.hostElement.style.width = "";
            this.hostElement.style.height = "";
            this.hostElement.style.minWidth = "";
            this.hostElement.style.minHeight = "";
            this.hostElement.style.overflow = "";
            return;
        }

        const iconSizePx = this.collapseSettings.iconSize + 4;
        if (this.isCollapsed) {
            this.container.classList.add("collapsed");
            this.rootElement.classList.add("collapsed-root");
            this.hostElement.style.width = iconSizePx + "px";
            this.hostElement.style.height = iconSizePx + "px";
            this.hostElement.style.minWidth = iconSizePx + "px";
            this.hostElement.style.minHeight = iconSizePx + "px";
            this.hostElement.style.overflow = "visible";
        } else {
            this.container.classList.remove("collapsed");
            this.rootElement.classList.remove("collapsed-root");
            this.hostElement.style.width = "";
            this.hostElement.style.height = "";
            this.hostElement.style.minWidth = "";
            this.hostElement.style.minHeight = "";
            this.hostElement.style.overflow = "";
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // RENDERING (Dispatcher)
    // ═══════════════════════════════════════════════════════════════════════════════
    private clearContainer(): void {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }

    private render(): void {
        this.clearContainer();

        if (this.slicerType === "slider") {
            const orientationClass = this.isVerticalSlider() ? " vertical" : " horizontal";
            this.container.className = "bss-container bss-slider-mode" + orientationClass;
            this.renderSlider();
        } else {
            this.container.className = "bss-container bss-button-mode";
            this.renderButtons();
        }
    }

    /** True when the slider should be laid out top-to-bottom instead of left-to-right. */
    private isVerticalSlider(): boolean {
        return this.sliderSettings.orientation === "vertical";
    }

    /**
     * Whether labels are placed before the track in DOM/visual order.
     * Horizontal slider: "top" (or "left") => above the track.
     * Vertical slider:   "left" (or "top")  => left of the track.
     */
    private labelsComeFirst(): boolean {
        const p = this.labelSettings.labelPosition;
        return p === "top" || p === "left";
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // BUTTON MODE
    // ═══════════════════════════════════════════════════════════════════════════════
    private renderButtons(): void {
        const s = this.tileSettings;
        const cs = this.collapseSettings;

        // Orientation
        if (s.orientation === "vertical") {
            this.container.classList.add("vertical");
            this.container.classList.remove("horizontal");
        } else {
            this.container.classList.add("horizontal");
            this.container.classList.remove("vertical");
        }

        this.container.style.gap = s.tileGap + "px";

        // Padding to avoid overlap with collapse icon
        if (cs.enabled) {
            const iconSpace = (cs.iconSize + 6) + "px";
            if (s.orientation === "vertical") {
                this.container.style.paddingTop = iconSpace;
                this.container.style.paddingBottom = "5px";
                this.container.style.paddingLeft = "5px";
                this.container.style.paddingRight = "5px";
            } else {
                this.container.style.paddingTop = "5px";
                this.container.style.paddingBottom = "5px";
                if (cs.iconPosition === "topLeft" || cs.iconPosition === "bottomLeft") {
                    this.container.style.paddingLeft = iconSpace;
                    this.container.style.paddingRight = "5px";
                } else {
                    this.container.style.paddingRight = iconSpace;
                    this.container.style.paddingLeft = "5px";
                }
            }
        } else {
            this.container.style.padding = "5px";
        }

        this.categories.forEach((label, index) => {
            const tile = document.createElement("div");
            tile.className = "bss-tile";

            const isSelected = this.selectedIndices.has(index);
            if (isSelected) tile.classList.add("selected");

            tile.textContent = label;
            tile.title = label;
            tile.dataset.index = String(index);

            this.applyTileStyles(tile, isSelected);

            tile.addEventListener("mousedown", (e) => this.onTileMouseDown(e, index));
            tile.addEventListener("mouseenter", () => this.onTileMouseEnter(index));

            this.container.appendChild(tile);
        });
    }

    private applyTileStyles(tile: HTMLElement, isSelected: boolean): void {
        const s = this.tileSettings;
        tile.style.fontFamily = s.fontFamily;
        tile.style.fontSize = s.fontSize + "px";
        tile.style.fontWeight = s.fontBold ? "700" : "400";
        tile.style.borderRadius = s.borderRadius + "px";
        tile.style.padding = "2px " + s.tilePadding + "px";

        if (s.maxTileWidth > 0) {
            tile.style.maxWidth = s.maxTileWidth + "px";
            tile.style.overflow = "hidden";
            tile.style.textOverflow = "ellipsis";
            tile.style.whiteSpace = "nowrap";
        } else {
            tile.style.maxWidth = "";
            tile.style.overflow = "";
            tile.style.textOverflow = "";
        }

        if (s.alignment === "left") {
            tile.style.justifyContent = "flex-start";
            tile.style.textAlign = "left";
        } else if (s.alignment === "right") {
            tile.style.justifyContent = "flex-end";
            tile.style.textAlign = "right";
        } else {
            tile.style.justifyContent = "center";
            tile.style.textAlign = "center";
        }

        if (isSelected) {
            tile.style.backgroundColor = s.selectedBackground;
            tile.style.color = s.selectedFontColor;
            tile.style.borderColor = s.selectedBackground;
        } else {
            tile.style.backgroundColor = s.defaultBackground;
            tile.style.color = s.fontColor;
            tile.style.borderColor = "#ccc";
        }
    }

    // Button drag selection
    private onTileMouseDown(e: MouseEvent, index: number): void {
        e.preventDefault();

        // Ctrl (Windows/Linux) or Cmd (Mac) + Click → multi-select toggle.
        // This adds/removes individual buttons without starting a drag-range.
        if (e.ctrlKey || e.metaKey) {
            if (this.selectedIndices.has(index)) {
                this.selectedIndices.delete(index);
            } else {
                this.selectedIndices.add(index);
            }
            // Not a drag operation.
            this.isDragging = false;
            this.dragStartIndex = -1;
            this.dragEndIndex = -1;
            this.updateButtonHighlight();
            this.applyFilter();
            return;
        }

        // Plain click / drag → range selection (single item if no drag occurs).
        this.isDragging = true;
        this.dragStartIndex = index;
        this.dragEndIndex = index;
        this.updateButtonHighlight();
    }

    private onTileMouseEnter(index: number): void {
        if (!this.isDragging) return;
        this.dragEndIndex = index;
        this.updateButtonHighlight();
    }

    private updateButtonHighlight(): void {
        const start = Math.min(this.dragStartIndex, this.dragEndIndex);
        const end = Math.max(this.dragStartIndex, this.dragEndIndex);
        const s = this.tileSettings;

        const tiles = this.container.querySelectorAll(".bss-tile") as NodeListOf<HTMLElement>;
        tiles.forEach((tile, i) => {
            let isSelected: boolean;
            if (this.isDragging) {
                isSelected = i >= start && i <= end;
            } else {
                isSelected = this.selectedIndices.has(i);
            }

            tile.classList.toggle("selected", isSelected);

            if (isSelected) {
                tile.style.backgroundColor = s.selectedBackground;
                tile.style.color = s.selectedFontColor;
                tile.style.borderColor = s.selectedBackground;
            } else {
                tile.style.backgroundColor = s.defaultBackground;
                tile.style.color = s.fontColor;
                tile.style.borderColor = "#ccc";
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SLIDER MODE
    // ═══════════════════════════════════════════════════════════════════════════════
    private renderSlider(): void {
        const ls = this.labelSettings;
        const ss = this.sliderSettings;
        const count = this.categories.length;
        if (count === 0) return;

        const isVertical = this.isVerticalSlider();
        const labelsFirst = this.labelsComeFirst();

        // Selected range display (always above everything)
        if (ls.showSelectedRange) {
            const rangeDisplay = document.createElement("div");
            rangeDisplay.className = "ss-range-display";
            rangeDisplay.style.fontFamily = ls.fontFamily;
            rangeDisplay.style.fontSize = ls.fontSize + "px";
            rangeDisplay.style.color = ls.fontColor;
            const arrow = isVertical ? "  \u2193  " : "  \u2192  ";
            rangeDisplay.textContent = this.categories[this.sliderStartIndex] + arrow + this.categories[this.sliderEndIndex];
            this.container.appendChild(rangeDisplay);
        }

        // Slider track area
        const sliderArea = document.createElement("div");
        sliderArea.className = "ss-slider-area" + (isVertical ? " vertical" : "");
        const areaThickness = Math.max(ss.handleSize, ss.trackHeight);
        if (isVertical) {
            sliderArea.style.width = areaThickness + "px";
        } else {
            sliderArea.style.height = areaThickness + "px";
        }

        // Track background
        const track = document.createElement("div");
        track.className = "ss-track" + (isVertical ? " vertical" : "");
        track.style.backgroundColor = ss.trackColor;
        if (isVertical) {
            track.style.width = ss.trackHeight + "px";
        } else {
            track.style.height = ss.trackHeight + "px";
        }
        track.style.borderRadius = (ss.trackHeight / 2) + "px";
        this.trackElement = track;

        // Selected range on track
        const startPct = (count > 1) ? (this.sliderStartIndex / (count - 1)) * 100 : 0;
        const endPct = (count > 1) ? (this.sliderEndIndex / (count - 1)) * 100 : 100;

        const selectedRange = document.createElement("div");
        selectedRange.className = "ss-track-selected" + (isVertical ? " vertical" : "");
        selectedRange.style.backgroundColor = (this.draggingHandle === "range") ? ss.grabColor : ss.selectedTrackColor;
        if (isVertical) {
            selectedRange.style.top = startPct + "%";
            selectedRange.style.height = (endPct - startPct) + "%";
            selectedRange.style.width = ss.trackHeight + "px";
        } else {
            selectedRange.style.left = startPct + "%";
            selectedRange.style.width = (endPct - startPct) + "%";
            selectedRange.style.height = ss.trackHeight + "px";
        }
        selectedRange.style.borderRadius = (ss.trackHeight / 2) + "px";
        selectedRange.style.cursor = "grab";
        this.selectedRangeElement = selectedRange;

        // Middle-bar drag
        selectedRange.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.draggingHandle = "range";
            this.dragStartMousePos = isVertical ? e.clientY : e.clientX;
            this.dragRangeStartIdx = this.sliderStartIndex;
            this.dragRangeEndIdx = this.sliderEndIndex;
            selectedRange.style.backgroundColor = ss.grabColor;
        });

        track.appendChild(selectedRange);
        sliderArea.appendChild(track);

        // Handles
        const startHandle = this.createHandle(startPct, "start");
        const endHandle = this.createHandle(endPct, "end");
        sliderArea.appendChild(startHandle);
        sliderArea.appendChild(endHandle);

        // Click on track to move nearest handle
        sliderArea.addEventListener("mousedown", (e) => this.onTrackClick(e, sliderArea));

        if (isVertical) {
            // Labels sit beside the track, so wrap both in a horizontal body row
            const body = document.createElement("div");
            body.className = "ss-vertical-body";
            if (labelsFirst) body.appendChild(this.createLabels());
            body.appendChild(sliderArea);
            if (!labelsFirst) body.appendChild(this.createLabels());
            this.container.appendChild(body);
        } else {
            if (labelsFirst) this.container.appendChild(this.createLabels());
            this.container.appendChild(sliderArea);
            if (!labelsFirst) this.container.appendChild(this.createLabels());
        }
    }

    /**
     * Builds one slider handle.
     *
     * Shape geometry is direction-aware so the handles read as a range:
     *   line   (Arrow)       -> triangle pointing inward along the track  ( >---< )
     *   circle (Half Circle) -> half disc, round edge facing outward      ( (---) )
     *   triangle (Pointer)   -> triangle across the track (up / right)
     *   square / diamond     -> symmetric, unchanged
     *   bar      ( | )        -> thin divider drawn across the track
     *   fullCircle           -> the original full disc
     */
    private createHandle(pct: number, which: "start" | "end"): HTMLElement {
        const ss = this.sliderSettings;
        const isVertical = this.isVerticalSlider();
        const size = ss.handleSize;
        const half = size / 2;
        const isStart = which === "start";

        const handle = document.createElement("div");
        handle.className = "ss-handle ss-handle-" + which + " ss-shape-" + ss.handleShape + (isVertical ? " ss-vertical" : "");

        // Footprint used only to centre the handle on its position.
        // CSS-drawn triangles have a zero-size box, so this is their border extent.
        let boxW = size;
        let boxH = size;

        switch (ss.handleShape) {
            case "line": {
                // Arrow pointing inward, along the track axis
                handle.classList.add("ss-geom-triangle");
                if (isVertical) {
                    handle.style.borderLeftWidth = half + "px";
                    handle.style.borderRightWidth = half + "px";
                    if (isStart) {
                        handle.style.borderTopWidth = size + "px";
                        handle.style.borderBottomWidth = "0";
                        handle.style.borderTopColor = ss.handleColor;
                    } else {
                        handle.style.borderBottomWidth = size + "px";
                        handle.style.borderTopWidth = "0";
                        handle.style.borderBottomColor = ss.handleColor;
                    }
                } else {
                    handle.style.borderTopWidth = half + "px";
                    handle.style.borderBottomWidth = half + "px";
                    if (isStart) {
                        handle.style.borderLeftWidth = size + "px";
                        handle.style.borderRightWidth = "0";
                        handle.style.borderLeftColor = ss.handleColor;
                    } else {
                        handle.style.borderRightWidth = size + "px";
                        handle.style.borderLeftWidth = "0";
                        handle.style.borderRightColor = ss.handleColor;
                    }
                }
                break;
            }
            case "triangle": {
                // Pointer across the track: up when horizontal, right when vertical
                handle.classList.add("ss-geom-triangle");
                if (isVertical) {
                    handle.style.borderTopWidth = half + "px";
                    handle.style.borderBottomWidth = half + "px";
                    handle.style.borderLeftWidth = size + "px";
                    handle.style.borderRightWidth = "0";
                    handle.style.borderLeftColor = ss.handleColor;
                } else {
                    handle.style.borderLeftWidth = half + "px";
                    handle.style.borderRightWidth = half + "px";
                    handle.style.borderBottomWidth = size + "px";
                    handle.style.borderTopWidth = "0";
                    handle.style.borderBottomColor = ss.handleColor;
                }
                break;
            }
            case "circle": {
                // Half disc: round edge away from the range, flat edge toward it.
                // Elliptical radii keep the grab area usable at small handle sizes.
                handle.classList.add("ss-geom-halfdisc");
                handle.style.backgroundColor = ss.handleColor;
                const depth = Math.max(4, Math.round(size * 0.6));
                if (isVertical) {
                    boxW = size;
                    boxH = depth;
                    handle.style.borderRadius = isStart
                        ? "50% 50% 0 0 / 100% 100% 0 0"
                        : "0 0 50% 50% / 0 0 100% 100%";
                } else {
                    boxW = depth;
                    boxH = size;
                    handle.style.borderRadius = isStart
                        ? "100% 0 0 100% / 50% 0 0 50%"
                        : "0 100% 100% 0 / 0 50% 50% 0";
                }
                break;
            }
            case "fullCircle": {
                handle.classList.add("ss-geom-disc");
                handle.style.backgroundColor = ss.handleColor;
                break;
            }
            case "diamond": {
                handle.classList.add("ss-geom-diamond");
                handle.style.backgroundColor = ss.handleColor;
                break;
            }
            case "bar": {
                // A thin bar drawn across the track ( | ). Spans the track thickness
                // and stays slim along the track axis so it reads as a divider line.
                handle.classList.add("ss-geom-bar");
                handle.style.backgroundColor = ss.handleColor;
                const thickness = Math.max(2, Math.round(size * 0.25));
                if (isVertical) {
                    // Horizontal bar across a vertical track
                    boxW = size;
                    boxH = thickness;
                } else {
                    // Vertical bar across a horizontal track
                    boxW = thickness;
                    boxH = size;
                }
                handle.style.borderRadius = Math.round(thickness / 2) + "px";
                break;
            }
            default: {
                handle.classList.add("ss-geom-square");
                handle.style.backgroundColor = ss.handleColor;
                break;
            }
        }

        handle.style.width = boxW + "px";
        handle.style.height = boxH + "px";

        // Position along the track, centred on the cross axis
        if (isVertical) {
            handle.style.top = "calc(" + pct + "% - " + (boxH / 2) + "px)";
            handle.style.left = "calc(50% - " + (boxW / 2) + "px)";
        } else {
            handle.style.left = "calc(" + pct + "% - " + (boxW / 2) + "px)";
            handle.style.top = "calc(50% - " + (boxH / 2) + "px)";
        }

        handle.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.draggingHandle = which;
        });

        return handle;
    }

    private createLabels(): HTMLElement {
        const ls = this.labelSettings;
        const count = this.categories.length;
        const isVertical = this.isVerticalSlider();
        const labelsFirst = this.labelsComeFirst();

        const labelsContainer = document.createElement("div");
        labelsContainer.className = "ss-labels" + (isVertical ? " vertical" : "");

        // A vertical label column needs an explicit width to reserve space beside the track
        if (isVertical) {
            const colWidth = (ls.maxLabelWidth > 0 ? ls.maxLabelWidth : 60) + 8;
            labelsContainer.style.width = colWidth + "px";
        }

        const visibleIndices = this.getVisibleLabelIndices();
        const orientation = this.resolveOrientation();

        for (let i = 0; i < count; i++) {
            const labelWrapper = document.createElement("div");
            labelWrapper.className = "ss-label-wrapper" + (isVertical ? " vertical" : "");
            const pct = (count > 1) ? ((i / (count - 1)) * 100) : 50;

            if (isVertical) {
                labelWrapper.style.top = pct + "%";
                // Anchor the wrapper to the edge that touches the track
                if (labelsFirst) {
                    labelWrapper.style.right = "0";
                } else {
                    labelWrapper.style.left = "0";
                }
                // Fix clipping: pin first label to the top edge, last to the bottom edge
                if (i === 0 && count > 1) {
                    labelWrapper.style.transform = "translateY(0)";
                } else if (i === count - 1 && count > 1) {
                    labelWrapper.style.transform = "translateY(-100%)";
                }
            } else {
                labelWrapper.style.left = pct + "%";
                // Fix clipping: align first label to the left edge, last label to the right edge
                if (i === 0 && count > 1) {
                    labelWrapper.style.transform = "translateX(0)";
                    labelWrapper.style.alignItems = "flex-start";
                } else if (i === count - 1 && count > 1) {
                    labelWrapper.style.transform = "translateX(-100%)";
                    labelWrapper.style.alignItems = "flex-end";
                }
            }

            let label: HTMLElement | null = null;
            if (visibleIndices.has(i)) {
                label = document.createElement("span");
                label.className = "ss-label";
                label.textContent = this.categories[i];
                label.style.fontFamily = ls.fontFamily;
                label.style.fontSize = ls.fontSize + "px";
                label.style.color = ls.fontColor;
                label.title = this.categories[i];

                if (ls.maxLabelWidth > 0) {
                    label.style.maxWidth = ls.maxLabelWidth + "px";
                    label.style.overflow = "hidden";
                    label.style.textOverflow = "ellipsis";
                }

                if (orientation === "vertical") {
                    label.classList.add("orient-vertical");
                } else if (orientation === "slant") {
                    label.classList.add("orient-slant");
                } else {
                    label.classList.add("orient-horizontal");
                }

                // Keep text flush against the track
                if (isVertical) {
                    label.style.textAlign = labelsFirst ? "right" : "left";
                }
            }

            const tick = document.createElement("div");
            tick.className = "ss-tick";

            // Vertical: label and tick sit side by side, tick always nearest the track
            if (isVertical && !labelsFirst) {
                labelWrapper.appendChild(tick);
                if (label) labelWrapper.appendChild(label);
            } else {
                if (label) labelWrapper.appendChild(label);
                labelWrapper.appendChild(tick);
            }

            labelsContainer.appendChild(labelWrapper);
        }

        return labelsContainer;
    }

    private getVisibleLabelIndices(): Set<number> {
        const count = this.categories.length;
        const density = this.labelSettings.labelDensity;
        const indices = new Set<number>();

        if (density === "all") {
            for (let i = 0; i < count; i++) indices.add(i);
        } else if (density === "every2") {
            for (let i = 0; i < count; i += 2) indices.add(i);
            indices.add(count - 1);
        } else if (density === "every3") {
            for (let i = 0; i < count; i += 3) indices.add(i);
            indices.add(count - 1);
        } else if (density === "every5") {
            for (let i = 0; i < count; i += 5) indices.add(i);
            indices.add(count - 1);
        } else {
            // "smart": fit as many labels as the available extent allows
            if (this.isVerticalSlider()) {
                const containerHeight = this.hostElement.clientHeight || 200;
                const avgLabelHeight = Math.max(10, this.labelSettings.fontSize * 1.8);
                const maxLabels = Math.max(2, Math.floor(containerHeight / avgLabelHeight));
                const step = Math.max(1, Math.ceil(count / maxLabels));
                for (let i = 0; i < count; i += step) indices.add(i);
            } else {
                const containerWidth = this.hostElement.clientWidth || 300;
                const avgLabelWidth = this.labelSettings.fontSize * 4;
                const maxLabels = Math.max(2, Math.floor(containerWidth / avgLabelWidth));
                const step = Math.max(1, Math.ceil(count / maxLabels));
                for (let i = 0; i < count; i += step) indices.add(i);
            }
            indices.add(count - 1);
        }

        indices.add(0);
        indices.add(count - 1);
        return indices;
    }

    private resolveOrientation(): string {
        const orient = this.labelSettings.labelOrientation;
        if (orient !== "auto") return orient;

        // In a vertical slider each label owns its own row, so horizontal text always fits
        if (this.isVerticalSlider()) return "horizontal";

        const containerWidth = this.hostElement.clientWidth || 300;
        const count = this.categories.length;
        const avgLabelLen = this.categories.reduce((sum, c) => sum + c.length, 0) / Math.max(count, 1);
        const charWidth = this.labelSettings.fontSize * 0.6;
        const spacePerLabel = containerWidth / Math.max(count, 1);
        const neededWidth = avgLabelLen * charWidth;

        if (neededWidth <= spacePerLabel) return "horizontal";
        if (neededWidth <= spacePerLabel * 2) return "slant";
        return "vertical";
    }

    // Slider drag logic
    private onTrackClick(e: MouseEvent, sliderArea: HTMLElement): void {
        const rect = sliderArea.getBoundingClientRect();
        const pct = this.isVerticalSlider()
            ? Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
            : Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const index = Math.round(pct * (this.categories.length - 1));

        const distToStart = Math.abs(index - this.sliderStartIndex);
        const distToEnd = Math.abs(index - this.sliderEndIndex);

        if (distToStart <= distToEnd) {
            this.sliderStartIndex = Math.min(index, this.sliderEndIndex);
            this.draggingHandle = "start";
        } else {
            this.sliderEndIndex = Math.max(index, this.sliderStartIndex);
            this.draggingHandle = "end";
        }

        this.render();
        this.applyFilter();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // MOUSE EVENTS (shared)
    // ═══════════════════════════════════════════════════════════════════════════════
    private onMouseMove(e: MouseEvent): void {
        if (this.slicerType !== "slider" || !this.draggingHandle || !this.trackElement) return;

        const rect = this.trackElement.getBoundingClientRect();
        const isVertical = this.isVerticalSlider();
        const pct = isVertical
            ? Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
            : Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const index = Math.round(pct * (this.categories.length - 1));

        if (this.draggingHandle === "start") {
            this.sliderStartIndex = Math.min(index, this.sliderEndIndex);
        } else if (this.draggingHandle === "end") {
            this.sliderEndIndex = Math.max(index, this.sliderStartIndex);
        } else if (this.draggingHandle === "range") {
            const trackExtent = isVertical ? rect.height : rect.width;
            const delta = (isVertical ? e.clientY : e.clientX) - this.dragStartMousePos;
            const stepSize = trackExtent / Math.max(1, this.categories.length - 1);
            const deltaSteps = Math.round(delta / stepSize);

            const rangeSize = this.dragRangeEndIdx - this.dragRangeStartIdx;
            let newStart = this.dragRangeStartIdx + deltaSteps;
            let newEnd = this.dragRangeEndIdx + deltaSteps;

            if (newStart < 0) { newStart = 0; newEnd = rangeSize; }
            if (newEnd > this.categories.length - 1) { newEnd = this.categories.length - 1; newStart = newEnd - rangeSize; }

            this.sliderStartIndex = newStart;
            this.sliderEndIndex = newEnd;
        }

        this.render();
    }

    private onMouseUp(): void {
        // Button mode
        if (this.slicerType === "button" && this.isDragging) {
            this.isDragging = false;
            const start = Math.min(this.dragStartIndex, this.dragEndIndex);
            const end = Math.max(this.dragStartIndex, this.dragEndIndex);

            if (start === end && this.selectedIndices.size === 1 && this.selectedIndices.has(start)) {
                this.selectedIndices.clear();
            } else {
                this.selectedIndices.clear();
                for (let i = start; i <= end; i++) {
                    this.selectedIndices.add(i);
                }
            }

            this.updateButtonHighlight();
            this.applyFilter();
            return;
        }

        // Slider mode
        if (this.slicerType === "slider" && this.draggingHandle) {
            if (this.draggingHandle === "range" && this.selectedRangeElement) {
                this.selectedRangeElement.style.backgroundColor = this.sliderSettings.selectedTrackColor;
            }
            this.draggingHandle = null;
            this.applyFilter();
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // FILTER
    // ═══════════════════════════════════════════════════════════════════════════════
    private applyFilter(): void {
        if (!this.columnTarget || this.categories.length === 0) {
            this.host.applyJsonFilter(null, "general", "filter", FilterAction.remove);
            return;
        }

        let selectedValues: (string | number | boolean)[] = [];

        if (this.slicerType === "button") {
            if (this.selectedIndices.size === 0) {
                this.host.applyJsonFilter(null, "general", "filter", FilterAction.remove);
                return;
            }
            selectedValues = Array.from(this.selectedIndices).map((i) => this.categories[i]);
        } else {
            // Slider: full range = no filter
            if (this.sliderStartIndex === 0 && this.sliderEndIndex === this.categories.length - 1) {
                this.host.applyJsonFilter(null, "general", "filter", FilterAction.remove);
                return;
            }
            for (let i = this.sliderStartIndex; i <= this.sliderEndIndex; i++) {
                selectedValues.push(this.categories[i]);
            }
        }

        const filter: IBasicFilter = {
            $schema: "https://powerbi.com/product/schema#basic",
            target: this.columnTarget,
            filterType: 1,
            operator: "In",
            values: selectedValues
        };

        this.host.applyJsonFilter(filter as any, "general", "filter", FilterAction.merge);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // FORMAT PANE
    // ═══════════════════════════════════════════════════════════════════════════════
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const instances: VisualObjectInstance[] = [];

        if (options.objectName === "general") {
            instances.push({
                objectName: "general",
                selector: null,
                properties: {
                    slicerType: this.slicerType,
                    showFilterIcon: this.collapseSettings.enabled
                }
            });
        }

        if (options.objectName === "collapseIcon" && this.collapseSettings.enabled) {
            instances.push({
                objectName: "collapseIcon",
                selector: null,
                properties: {
                    iconStyle: this.collapseSettings.iconStyle,
                    customIconBase64: this.collapseSettings.customIconBase64,
                    iconSize: this.collapseSettings.iconSize,
                    iconPosition: this.collapseSettings.iconPosition
                }
            });
        }

        if (options.objectName === "tileFormatting" && this.slicerType === "button") {
            instances.push({
                objectName: "tileFormatting",
                selector: null,
                properties: {
                    orientation: this.tileSettings.orientation,
                    maxTileWidth: this.tileSettings.maxTileWidth,
                    fontFamily: this.tileSettings.fontFamily,
                    fontSize: this.tileSettings.fontSize,
                    fontColor: { solid: { color: this.tileSettings.fontColor } },
                    fontBold: this.tileSettings.fontBold,
                    alignment: this.tileSettings.alignment,
                    defaultBackground: { solid: { color: this.tileSettings.defaultBackground } },
                    selectedBackground: { solid: { color: this.tileSettings.selectedBackground } },
                    selectedFontColor: { solid: { color: this.tileSettings.selectedFontColor } },
                    borderRadius: this.tileSettings.borderRadius,
                    tileGap: this.tileSettings.tileGap,
                    tilePadding: this.tileSettings.tilePadding
                }
            });
        }

        if (options.objectName === "sliderSettings" && this.slicerType === "slider") {
            instances.push({
                objectName: "sliderSettings",
                selector: null,
                properties: {
                    orientation: this.sliderSettings.orientation,
                    trackColor: { solid: { color: this.sliderSettings.trackColor } },
                    selectedTrackColor: { solid: { color: this.sliderSettings.selectedTrackColor } },
                    handleColor: { solid: { color: this.sliderSettings.handleColor } },
                    grabColor: { solid: { color: this.sliderSettings.grabColor } },
                    handleSize: this.sliderSettings.handleSize,
                    trackHeight: this.sliderSettings.trackHeight,
                    handleShape: this.sliderSettings.handleShape
                }
            });
        }

        if (options.objectName === "labelSettings" && this.slicerType === "slider") {
            instances.push({
                objectName: "labelSettings",
                selector: null,
                properties: {
                    labelPosition: this.labelSettings.labelPosition,
                    labelOrientation: this.labelSettings.labelOrientation,
                    labelDensity: this.labelSettings.labelDensity,
                    showSelectedRange: this.labelSettings.showSelectedRange,
                    fontFamily: this.labelSettings.fontFamily,
                    fontSize: this.labelSettings.fontSize,
                    fontColor: { solid: { color: this.labelSettings.fontColor } },
                    maxLabelWidth: this.labelSettings.maxLabelWidth
                }
            });
        }

        return instances;
    }
}

import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import "./../style/visual.less";
export declare class Visual implements IVisual {
    private host;
    private hostElement;
    private rootElement;
    private container;
    private iconElement;
    private versionElement;
    private categories;
    private slicerType;
    private selectedIndices;
    private isDragging;
    private dragStartIndex;
    private dragEndIndex;
    private sliderStartIndex;
    private sliderEndIndex;
    private draggingHandle;
    private trackElement;
    private selectedRangeElement;
    private dragStartMousePos;
    private dragRangeStartIdx;
    private dragRangeEndIdx;
    private tileSettings;
    private collapseSettings;
    private sliderSettings;
    private labelSettings;
    private isCollapsed;
    private columnTarget;
    private documentMouseUpHandler;
    private documentMoveHandler;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    private parseTileSettings;
    private parseCollapseSettings;
    private parseSliderSettings;
    private parseLabelSettings;
    private getStr;
    private getNum;
    private getBool;
    private getFill;
    private getIconDataUrl;
    private removeIcon;
    private renderIcon;
    private applyCollapseState;
    private clearContainer;
    private render;
    /** True when the slider should be laid out top-to-bottom instead of left-to-right. */
    private isVerticalSlider;
    /**
     * Whether labels are placed before the track in DOM/visual order.
     * Horizontal slider: "top" (or "left") => above the track.
     * Vertical slider:   "left" (or "top")  => left of the track.
     */
    private labelsComeFirst;
    private renderButtons;
    private applyTileStyles;
    private onTileMouseDown;
    private onTileMouseEnter;
    private updateButtonHighlight;
    private renderSlider;
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
    private createHandle;
    private createLabels;
    private getVisibleLabelIndices;
    private resolveOrientation;
    private onTrackClick;
    private onMouseMove;
    private onMouseUp;
    private applyFilter;
    enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
}

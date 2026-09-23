# Button Slider

A combined **button slicer** and **range slider** for Power BI, with a single toggle to switch between the two modes. Use it as a compact set of selectable buttons, or as an interactive slider for selecting a range — all from one visual, fully formatted to match your report theme.

- **Author:** Naser Daneshi
- **License:** [MIT](LICENSE)
- **API version:** 5.11.1
- **Version:** 1.6.0.0

## Features

### Two modes, one visual
Switch between **Button** and **Slider** modes via the **General → Slicer Type** toggle.

### Data
- Single field well: **Value** (categorical grouping)
- Supports highlighting
- Displays up to 200 categories (top-N data reduction)

### Button mode formatting
- Horizontal or vertical orientation
- Max tile width, tile gap, tile padding, border radius
- Font family, size, color, and bold
- Text alignment
- Default background, selected background, and selected font color

### Slider mode formatting
- Horizontal or vertical orientation
- Track color, selected-range color, handle color, and grab (drag) color
- Handle size and track height
- Handle shapes: Arrow, Half Circle, Full Circle, Pointer, Square, Diamond, Bar

### Labels (slider)
- Position: Top / Bottom (horizontal) or Left / Right (vertical)
- Orientation: Automatic, Horizontal, Vertical, or Slant (45°)
- Density: Show All, Smart (fit available space), Every 2nd / 3rd / 5th
- Optional "Show Selected Range" indicator
- Font family, size, color, and max label width

### Filter icon
- Optional collapsible filter icon with preset styles (black & white or colored, 16/24/32 px) or a custom Base64 icon
- Configurable icon size and corner position (Top Left / Top Right / Bottom Left / Bottom Right)

## Usage

1. Add the **Button Slider** visual to your report.
2. Drag a field into the **Value** well.
3. Choose **Button** or **Slider** under **Format → General → Slicer Type**.
4. Adjust formatting under **Button Formatting**, **Slider**, **Labels**, and **Filter Icon** as needed.

## Privacy

This visual does **not** collect, store, or transmit any data. It requires no special privileges and makes no external network or web-access calls.

## Development

```bash
npm install        # install dependencies
npm run start      # run in the Power BI developer sandbox
npm run lint       # lint the source
npm run package    # produce the .pbiviz package in dist/
```

## Support

- Issues: https://github.com/naser53/PBI/issues
- Repository: https://github.com/naser53/PBI
- Contact: naserdaneshi@gmail.com

# Exporting JSON Canvas to HTML

- Obsidian allow the user to make canvases, which are represented as [Open JSON Canvas](https://github.com/obsidianmd/jsoncanvas) (see also the [spec](https://raw.githubusercontent.com/obsidianmd/jsoncanvas/refs/heads/main/spec/1.0.md))
- The present plugin should expose an [Obsidian Command](https://docs.obsidian.md/Reference/TypeScript+API/Plugin/addCommand) which allow the user to export the currently opened Canvas as HTML

## Input and Output

Obsidian Canvas files have a format like:

```
{
	"nodes":[
		{"id":"82ed482196b563f9","type":"file","file":"Thoughts/📝 Technology-mediated task-based language teaching﹕ A research agenda.md","x":-540,"y":-300,"width":800,"height":100},
		{"id":"ce4765e220ecf14c","type":"file","file":"Thoughts/~ TMTBLT should be meaning-based, goal-oriented, personalized, holistic and include reflection.md","x":-420,"y":0,"width":800,"height":160,"color":"2"}
	],
	"edges":[
		{"id":"5c3e011ad28f689f","fromNode":"82ed482196b563f9","fromSide":"bottom","toNode":"ce4765e220ecf14c","toSide":"top"}
	]
}
```

The output should be an HTML file which works *without* any client-side js, and be as close to "normal" HTML as possible.
It may be advisable to utilize a pan and zoom library or something like that, but we want to refrain from any full blown js libraries or frameworks, required `<script>`s or even `<canvas>` and `<iframe>`.

Instead, we're simply going to render nodes as divs in a [CSS Grid](https://www.w3schools.com/css/css_grid.asp)

## Specs

### Nodes

- Utilizing `grid-template-areas`, we can style the resulting grid rather intuitively, like so:

```css
#obsidian-canvas {
  display: grid;
  grid-template-areas:
    "a a . b"
	". . . ."
    ". c c .";
}
```
- To get to the resulting HTML, we will ignore the *specific* x, y width and height values of a given node. However, we will not ignore their *abstract* position to each other.
  - To do this, any row/col of the resulting grid will be `auto`-sized, with a minimum width of 12px.
  - To know how our grid should look, we identify all unique "anchors" along the x and y axis and create the needed number of rows and cols. For example:
    - If we have an Obsidian grid with two nodes positioned over each other perfectly aligned (same x, same width), we are going to need:
      - 3 rows: The first node will occupy the first row, then we will have an empty row (nodes should not directly touch each other), then the last node will be in the last row
      - 1 col: Since the nodes are aligned, they can all live in the same singular column.
    - However, if we have two nodes stacked on top of each other but the second node is not as wide as the first, we are going to need:
      - 3 rows: Nothing changed here
      - 2 cols: The first node will occupy *both* cols, but the second node will only occupy the first col (to represent its smaller width)
    - If the nodes are on top of each other, but are not aligned at all (say the lower node starts more to the left), we're going to need:
      - 3 rows: Nothing changed here
      - 3 cols: The first node will occupy the first and second col, while the second node is going to occupy the second and the third row. Note that if the second node starts so far to the right that it does not overlap the first node at all, this would again be different


- Note that obsidian (for type `file`) only saves the file path. For rendering, we want to put the note's actual content (without its frontmatter) into the HTML

### Edges

- will be implemented later
import { Plugin, Notice, TFile } from 'obsidian';
import { CanvasData, AllCanvasNodeData, CanvasEdgeData, CanvasNodeData } from 'obsidian/canvas';

export default class CanvasToHtmlPlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: 'export-canvas-to-html',
            name: 'Export Canvas to HTML',
            callback: () => this.exportCanvasToHtml()
        });
    }

    private async exportCanvasToHtml() {
        const activeLeaf = this.app.workspace.activeLeaf;
        if (!activeLeaf || !activeLeaf.view || activeLeaf.view.getViewType() !== 'canvas') {
            const error = 'No canvas file is currently open';
            console.error('[CanvasToHtml]', error);
            new Notice(error);
            return;
        }

        try {
            const canvasData = await this.getCanvasData();
            const html = await this.generateHtml(canvasData);
            await this.saveHtmlFile(html);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('[CanvasToHtml] Export failed:', error);
            if (error instanceof Error && error.stack) {
                console.error('[CanvasToHtml] Stack trace:', error.stack);
            }
            new Notice('Failed to export canvas: ' + errorMessage);
        }
    }

    private async getCanvasData(): Promise<CanvasData> {
        const activeLeaf = this.app.workspace.activeLeaf;
        if (!activeLeaf?.view) {
            const error = 'No active view found';
            console.error('[CanvasToHtml]', error);
            throw new Error(error);
        }
        
        // @ts-ignore - canvas view type is not in the types
        const canvasView = activeLeaf.view;
        // @ts-ignore - canvas property is not in the types
        const canvas = canvasView.canvas;
        
        if (!canvas) {
            const error = 'Canvas data is not available';
            console.error('[CanvasToHtml]', error);
            throw new Error(error);
        }

        // Get the raw JSON data from the canvas
        const nodes = Array.from(canvas.nodes.values()).map((node: CanvasNodeData) => ({
            id: node.id,
            type: node.type,
            text: node.text,
            file: node.file,
            url: node.url,
            label: node.label,
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height,
            color: node.color
        })) as AllCanvasNodeData[];

        const edges = Array.from(canvas.edges.values()).map((edge: CanvasEdgeData) => ({
            id: edge.id,
            fromNode: edge.fromNode,
            fromSide: edge.fromSide,
            fromEnd: edge.fromEnd,
            toNode: edge.toNode,
            toSide: edge.toSide,
            toEnd: edge.toEnd,
            color: edge.color,
            label: edge.label
        }));
        
        return { nodes, edges };
    }

    private async generateHtml(canvasData: CanvasData): Promise<string> {
        const { nodes } = canvasData;
        
        if (!nodes || nodes.length === 0) {
            const error = 'No nodes found in canvas';
            console.error('[CanvasToHtml]', error);
            throw new Error(error);
        }
        
        // Get all unique x and y coordinates, including node boundaries
        const xCoords = new Set<number>();
        const yCoords = new Set<number>();
        
        nodes.forEach(node => {
            xCoords.add(node.x);
            xCoords.add(node.x + node.width);
            yCoords.add(node.y);
            yCoords.add(node.y + node.height);
        });

        // Sort coordinates
        const sortedXCoords = Array.from(xCoords).sort((a, b) => a - b);
        const sortedYCoords = Array.from(yCoords).sort((a, b) => a - b);
        
        // Create grid template areas
        const gridAreas = this.createGridAreas(nodes, sortedXCoords, sortedYCoords);
        
        // Generate node content
        const nodeContents = await Promise.all(nodes.map(async node => {
            try {
                let content = '';
                console.log('[CanvasToHtml] Processing node:', {
                    id: node.id,
                    type: node.type,
                    text: 'text' in node ? node.text : undefined,
                    file: 'file' in node ? node.file : undefined,
                    url: 'url' in node ? node.url : undefined,
                    label: 'label' in node ? node.label : undefined
                });
                
                // @ts-ignore - we know these properties exist from the debug output
                if (node.file) {
                    console.log('[CanvasToHtml] Processing file node:', node.file);
                    const file = this.app.vault.getAbstractFileByPath(node.file);
                    console.log('[CanvasToHtml] Found file:', file);
                    if (file instanceof TFile) {
                        content = await this.app.vault.read(file);
                        console.log('[CanvasToHtml] File content length:', content.length);
                        // Remove frontmatter if it exists
                        content = content.replace(/^---[\s\S]*?---\n/, '');
                        console.log('[CanvasToHtml] Content after frontmatter removal:', content);
                    }
                } else if (node.text) {
                    console.log('[CanvasToHtml] Processing text node:', node.text);
                    content = node.text;
                } else if (node.url) {
                    console.log('[CanvasToHtml] Processing link node:', node.url);
                    content = node.url;
                } else if (node.label) {
                    console.log('[CanvasToHtml] Processing group node:', node.label);
                    content = node.label;
                } else {
                    console.log('[CanvasToHtml] Unknown node type or missing properties:', node);
                }
                console.log('[CanvasToHtml] Final content for node:', content);

                return `<div class="node" style="grid-area: ${node.id}">${content}</div>`;
            } catch (error) {
                console.error(`Error: [CanvasToHtml] Error processing node ${node.id}:`, error);
                return `<div class="node" style="grid-area: ${node.id}">Error loading content</div>`;
            }
        }));

        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        #obsidian-canvas {
            display: grid;
            grid-template-areas: ${gridAreas};
            gap: 12px;
            padding: 12px;
        }
        .node {
            border: 1px solid #ccc;
            padding: 8px;
            min-width: 12px;
            min-height: 12px;
        }
    </style>
</head>
<body>
    <div id="obsidian-canvas">
        ${nodeContents.join('\n')}
    </div>
</body>
</html>`;
    }

    private createGridAreas(nodes: AllCanvasNodeData[], xCoords: number[], yCoords: number[]): string {
        // Create a 2D array to represent the grid
        const grid: string[][] = Array(yCoords.length - 1)
            .fill(null)
            .map(() => Array(xCoords.length - 1).fill('.'));

        // Place nodes in the grid
        nodes.forEach(node => {
            const startX = xCoords.indexOf(node.x);
            const startY = yCoords.indexOf(node.y);
            const endX = xCoords.indexOf(node.x + node.width);
            const endY = yCoords.indexOf(node.y + node.height);

            if (startX === -1 || startY === -1 || endX === -1 || endY === -1) {
                console.error(`[CanvasToHtml] Invalid coordinates for node ${node.id}:`, {
                    node,
                    startX,
                    startY,
                    endX,
                    endY
                });
                return;
            }

            // Fill the grid area for this node
            for (let y = startY; y < endY; y++) {
                for (let x = startX; x < endX; x++) {
                    grid[y][x] = node.id;
                }
            }
        });

        // Convert grid to CSS grid-template-areas
        return grid.map(row => `"${row.join(' ')}"`).join('\n');
    }

    private async saveHtmlFile(html: string) {
        try {
            const fileName = `canvas-export-${Date.now()}.html`;
            await this.app.vault.create(fileName, html);
            new Notice(`Canvas exported to ${fileName}`);
        } catch (error) {
            console.error('[CanvasToHtml] Failed to save HTML file:', error);
            throw error;
        }
    }
}

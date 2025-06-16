import { Plugin, TFile, Notice } from 'obsidian';

interface CanvasNode {
    id: string;
    type: string;
    file?: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface CanvasEdge {
    id: string;
    fromNode: string;
    fromSide: string;
    toNode: string;
    toSide: string;
}

interface CanvasData {
    nodes: CanvasNode[];
    edges: CanvasEdge[];
}

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
            new Notice('Please open a canvas file first');
            return;
        }

        try {
            const canvasData = await this.getCanvasData();
            const html = await this.generateHtml(canvasData);
            await this.saveHtmlFile(html);
        } catch (error) {
            new Notice('Failed to export canvas: ' + error.message);
        }
    }

    private async getCanvasData(): Promise<CanvasData> {
        const activeLeaf = this.app.workspace.activeLeaf;
        if (!activeLeaf?.view) throw new Error('No active view');
        
        // @ts-ignore - canvas view type is not in the types
        const canvasView = activeLeaf.view;
        // @ts-ignore - canvas property is not in the types
        return canvasView.canvas;
    }

    private async generateHtml(canvasData: CanvasData): Promise<string> {
        const { nodes } = canvasData;
        
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
            if (node.type === 'file' && node.file) {
                const file = this.app.vault.getAbstractFileByPath(node.file);
                if (file instanceof TFile) {
                    const content = await this.app.vault.read(file);
                    return `<div class="node" style="grid-area: ${node.id}">${content}</div>`;
                }
            }
            return `<div class="node" style="grid-area: ${node.id}">${node.id}</div>`;
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

    private createGridAreas(nodes: CanvasNode[], xCoords: number[], yCoords: number[]): string {
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
        const file = await this.app.vault.create(
            'canvas-export.html',
            html
        );
        new Notice(`Canvas exported to ${file.path}`);
    }
}

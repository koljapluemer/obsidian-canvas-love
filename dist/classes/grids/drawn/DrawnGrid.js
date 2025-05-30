"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var ConfiguredGrid_1 = require("../configured/ConfiguredGrid");
var DrawnNode_1 = require("./DrawnNode");
var DrawnEdge_1 = require("./DrawnEdge");
var EmptyCell_1 = require("./cells/EmptyCell");
var NodeCell_1 = require("./cells/NodeCell");
var EdgeCell_1 = require("./cells/EdgeCell");
var DrawnGrid = /** @class */ (function () {
    function DrawnGrid(configuredGrid) {
        this.grid = [[new EmptyCell_1.default()]];
        this.nodes = [];
        this.edges = [];
        this.placeNodes(configuredGrid);
        this.placeEdges(configuredGrid);
    }
    DrawnGrid.prototype.getRows = function () {
        return this.grid.length;
    };
    DrawnGrid.prototype.getCols = function () {
        return this.grid[0].length;
    };
    DrawnGrid.prototype.getCellAt = function (coord) {
        if (coord.row < 0 || coord.row >= this.getRows() ||
            coord.col < 0 || coord.col >= this.getCols()) {
            return new EmptyCell_1.default();
        }
        return this.grid[coord.row][coord.col];
    };
    DrawnGrid.prototype.isCellEmpty = function (coord) {
        return this.getCellAt(coord).isEmpty();
    };
    DrawnGrid.prototype.cloneRow = function (rowIndex) {
        var newRow = this.grid[rowIndex].map(function (cell) { return cell.clone(); });
        this.grid.splice(rowIndex, 0, newRow);
    };
    DrawnGrid.prototype.cloneColumn = function (colIndex) {
        for (var i = 0; i < this.grid.length; i++) {
            var cell = this.grid[i][colIndex].clone();
            this.grid[i].splice(colIndex, 0, cell);
        }
    };
    DrawnGrid.prototype.placeNodes = function (configuredGrid) {
        // Sort nodes by placement priority
        var sortedNodes = __spreadArray([], configuredGrid.nodes, true).sort(function (a, b) {
            return a.placementPriority - b.placementPriority;
        });
        // Place each node
        for (var _i = 0, sortedNodes_1 = sortedNodes; _i < sortedNodes_1.length; _i++) {
            var node = sortedNodes_1[_i];
            this.placeNode(node);
        }
    };
    DrawnGrid.prototype.placeNode = function (node) {
        var coord = null;
        var attempts = 0;
        var MAX_ATTEMPTS = 100; // Prevent infinite loops
        console.log("Attempting to place node: ".concat(node.ogData.id));
        while (attempts < MAX_ATTEMPTS) {
            coord = this.getRandomLegalNodePlacementCell();
            if (coord) {
                console.log("Legal placement found at (".concat(coord.row, ", ").concat(coord.col, ")"));
                // Create and place the node
                var drawnNode = new DrawnNode_1.default(node);
                drawnNode.setCoordinate(coord);
                // Create the initial node cell
                var nodeCell = new NodeCell_1.default(drawnNode);
                nodeCell.row = coord.row;
                nodeCell.col = coord.col;
                drawnNode.addCell(nodeCell);
                this.nodes.push(drawnNode);
                this.grid[coord.row][coord.col] = nodeCell;
                console.log("Node ".concat(node.ogData.id, " placed at (").concat(coord.row, ", ").concat(coord.col, ")"));
                return;
            }
            // If no legal cell found, randomly choose to clone a row or column, or add an empty row/column
            var action = Math.floor(Math.random() * 4);
            var rowIndex = null;
            var colIndex = null;
            switch (action) {
                case 0:
                    rowIndex = this.getRandomCloneableRowIndex();
                    if (rowIndex !== null) {
                        console.log("Cloning row at index ".concat(rowIndex));
                        this.cloneRowAt(rowIndex);
                    }
                    else {
                        console.log("No cloneable row found");
                    }
                    break;
                case 1:
                    colIndex = this.getRandomCloneableColIndex();
                    if (colIndex !== null) {
                        console.log("Cloning column at index ".concat(colIndex));
                        this.cloneColAt(colIndex);
                    }
                    else {
                        console.log("No cloneable column found");
                    }
                    break;
                case 2:
                    console.log("Adding empty row to start of grid");
                    this.addEmptyRowToStartofGrid();
                    break;
                case 3:
                    console.log("Adding empty column to start of grid");
                    this.addEmptyColumnToStartofGrid();
                    break;
            }
            // Render the grid after cloning for debugging
            console.log("Grid after cloning:");
            console.log(this.renderAsASCII());
            console.log("\n");
            attempts++;
        }
        throw new Error("Failed to place node after multiple attempts");
    };
    DrawnGrid.prototype.getDrawnNodes = function () {
        return this.nodes;
    };
    DrawnGrid.prototype.getDrawnEdges = function () {
        return this.edges;
    };
    DrawnGrid.prototype.renderAsASCII = function () {
        var result = "";
        for (var row = 0; row < this.getRows(); row++) {
            for (var col = 0; col < this.getCols(); col++) {
                result += this.grid[row][col].renderAsASCII();
            }
            result += "\n";
        }
        return result;
    };
    DrawnGrid.prototype.getFlatCells = function () {
        return this.grid.flat();
    };
    DrawnGrid.prototype.getRowAt = function (rowIndex) {
        if (rowIndex < 0 || rowIndex >= this.getRows())
            return [];
        return this.grid[rowIndex];
    };
    DrawnGrid.prototype.getColAt = function (colIndex) {
        if (colIndex < 0 || colIndex >= this.getCols())
            return [];
        return this.grid.map(function (row) { return row[colIndex]; });
    };
    DrawnGrid.prototype.isCellEmptyAndAllNeighborsAreEmptyAt = function (coord) {
        // Check the cell itself
        if (!this.isCellEmpty(coord))
            return false;
        // Check all 8 neighbors
        for (var dy = -1; dy <= 1; dy++) {
            for (var dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0)
                    continue; // Skip the cell itself
                var neighborCoord = { row: coord.row + dy, col: coord.col + dx };
                if (!this.isCellEmpty(neighborCoord))
                    return false;
            }
        }
        return true;
    };
    DrawnGrid.prototype.getRandomLegalNodePlacementCell = function () {
        // Find all cells that are empty and have empty neighbors
        var legalCells = [];
        for (var row = 0; row < this.getRows(); row++) {
            for (var col = 0; col < this.getCols(); col++) {
                var coord = { row: row, col: col };
                if (this.isCellEmptyAndAllNeighborsAreEmptyAt(coord)) {
                    legalCells.push(coord);
                }
            }
        }
        if (legalCells.length === 0)
            return null;
        return legalCells[Math.floor(Math.random() * legalCells.length)];
    };
    DrawnGrid.prototype.isCoordinateInGrid = function (rowIndex, colIndex) {
        return rowIndex >= 0 && rowIndex < this.getRows() && colIndex >= 0 && colIndex < this.getCols();
    };
    DrawnGrid.prototype.isRowClonableAt = function (rowIndex) {
        // First check if row is in grid
        if (!this.isCoordinateInGrid(rowIndex, 0)) {
            return false;
        }
        // Then check if all cells in the row allow cloning
        for (var col = 0; col < this.getCols(); col++) {
            if (!this.grid[rowIndex][col].rowsThatContainMeAreAllowedToBeCloned()) {
                return false;
            }
        }
        return true;
    };
    DrawnGrid.prototype.isColClonableAt = function (colIndex) {
        // First check if column is in grid
        if (!this.isCoordinateInGrid(0, colIndex)) {
            return false;
        }
        // Then check if all cells in the column allow cloning
        for (var row = 0; row < this.getRows(); row++) {
            if (!this.grid[row][colIndex].columnsThatContainMeAreAllowedToBeCloned()) {
                return false;
            }
        }
        return true;
    };
    DrawnGrid.prototype.getRandomCloneableRowIndex = function () {
        var _this = this;
        var cloneableRows = Array.from({ length: this.getRows() }, function (_, i) { return i; })
            .filter(function (i) { return _this.isRowClonableAt(i); });
        if (cloneableRows.length === 0)
            return null;
        return cloneableRows[Math.floor(Math.random() * cloneableRows.length)];
    };
    DrawnGrid.prototype.getRandomCloneableColIndex = function () {
        var _this = this;
        var cloneableCols = Array.from({ length: this.getCols() }, function (_, i) { return i; })
            .filter(function (i) { return _this.isColClonableAt(i); });
        if (cloneableCols.length === 0)
            return null;
        return cloneableCols[Math.floor(Math.random() * cloneableCols.length)];
    };
    DrawnGrid.prototype.cloneRowAt = function (rowIndex) {
        if (!this.isRowClonableAt(rowIndex)) {
            throw new Error("Cannot clone row at index ".concat(rowIndex));
        }
        // Create new row with same cells
        var newRow = this.grid[rowIndex].map(function (cell) { return cell.clone(); });
        this.grid.splice(rowIndex, 0, newRow);
        // Update all nodes that might be affected
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.handleRowDuplicationAtIndex(rowIndex);
        }
    };
    DrawnGrid.prototype.cloneColAt = function (colIndex) {
        if (!this.isColClonableAt(colIndex)) {
            throw new Error("Cannot clone column at index ".concat(colIndex));
        }
        // Add new column to each row
        for (var y = 0; y < this.getRows(); y++) {
            var newCell = this.grid[y][colIndex].clone();
            this.grid[y].splice(colIndex, 0, newCell);
        }
        // Update all nodes that might be affected
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.handleColDuplicationAtIndex(colIndex);
        }
    };
    DrawnGrid.prototype.addEmptyRowToStartofGrid = function () {
        var newRow = Array(this.getCols()).fill(new EmptyCell_1.default());
        this.grid.unshift(newRow);
        // Update row values for all nodes and their cells
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            var coord = node.getCoordinate();
            node.setCoordinate(__assign(__assign({}, coord), { row: coord.row + 1 }));
            // Update all cells belonging to this node
            for (var _b = 0, _c = node.getCells(); _b < _c.length; _b++) {
                var cell = _c[_b];
                cell.row++;
            }
        }
    };
    DrawnGrid.prototype.addEmptyRowToEndofGrid = function () {
        var newRow = Array(this.getCols()).fill(new EmptyCell_1.default());
        this.grid.push(newRow);
        // No need to update node coordinates as they're relative to the start
    };
    DrawnGrid.prototype.addEmptyColumnToStartofGrid = function () {
        for (var i = 0; i < this.getRows(); i++) {
            this.grid[i].unshift(new EmptyCell_1.default());
        }
        // Update col values for all nodes and their cells
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            var coord = node.getCoordinate();
            node.setCoordinate(__assign(__assign({}, coord), { col: coord.col + 1 }));
            // Update all cells belonging to this node
            for (var _b = 0, _c = node.getCells(); _b < _c.length; _b++) {
                var cell = _c[_b];
                cell.col++;
            }
        }
    };
    DrawnGrid.prototype.addEmptyColumnToEndofGrid = function () {
        for (var i = 0; i < this.getRows(); i++) {
            this.grid[i].push(new EmptyCell_1.default());
        }
        // No need to update node coordinates as they're relative to the start
    };
    DrawnGrid.prototype.saveToJSON = function () {
        var nodeIndexMap = new Map(this.nodes.map(function (n, i) { return [n, i]; }));
        var edgeIndexMap = new Map(this.edges.map(function (e, i) { return [e, i]; }));
        return {
            nodes: this.nodes.map(function (node) { return node.saveToJSON(); }),
            edges: this.edges.map(function (edge) { return edge.saveToJSON(); }),
            cells: this.grid.flat().map(function (cell) {
                var _a;
                if (cell instanceof EmptyCell_1.default) {
                    return { type: "emptyCell", row: cell.row, col: cell.col };
                }
                else if (cell instanceof NodeCell_1.default) {
                    // @ts-ignore
                    var nodeIdx = nodeIndexMap.get(cell.node || cell._node || ((_a = cell.getNode) === null || _a === void 0 ? void 0 : _a.call(cell)));
                    if (typeof nodeIdx !== "number")
                        throw new Error("NodeCell missing valid node index during serialization");
                    return { type: "nodeCell", row: cell.row, col: cell.col, nodeIndex: nodeIdx };
                }
                else if (cell instanceof EdgeCell_1.default) {
                    // @ts-ignore
                    var edgeIdx = edgeIndexMap.get(cell.edge);
                    if (typeof edgeIdx !== "number")
                        throw new Error("EdgeCell missing valid edge index during serialization");
                    return {
                        type: "edgeCell",
                        row: cell.row,
                        col: cell.col,
                        edgeIndex: edgeIdx,
                        connectsToNorth: cell.connectsToNorth,
                        connectsToEast: cell.connectsToEast,
                        connectsToSouth: cell.connectsToSouth,
                        connectsToWest: cell.connectsToWest,
                        hasArrowNorth: cell.hasArrowNorth,
                        hasArrowEast: cell.hasArrowEast,
                        hasArrowSouth: cell.hasArrowSouth,
                        hasArrowWest: cell.hasArrowWest
                    };
                }
                else {
                    throw new Error("Unknown cell type during serialization");
                }
            })
        };
    };
    DrawnGrid.makeFromJSON = function (data) {
        var grid = new DrawnGrid(new ConfiguredGrid_1.default());
        grid.nodes = data.nodes.map(function (nodeData) { return DrawnNode_1.default.makeFromJSON(nodeData); });
        grid.edges = data.edges.map(function (edgeData) { return DrawnEdge_1.default.makeFromJSON(edgeData); });
        if (data.cells && data.cells.length > 0) {
            var maxRow = Math.max.apply(Math, data.cells.map(function (c) { return c.row; }));
            var maxCol_1 = Math.max.apply(Math, data.cells.map(function (c) { return c.col; }));
            grid.grid = Array.from({ length: maxRow + 1 }, function () { return Array(maxCol_1 + 1).fill(null); });
            for (var _i = 0, _a = data.cells; _i < _a.length; _i++) {
                var cellData = _a[_i];
                var cell = void 0;
                if (cellData.type === "emptyCell") {
                    cell = new EmptyCell_1.default();
                }
                else if (cellData.type === "nodeCell") {
                    var node = grid.nodes[cellData.nodeIndex];
                    if (!node)
                        throw new Error("Node index ".concat(cellData.nodeIndex, " not found for nodeCell"));
                    cell = new NodeCell_1.default(node);
                }
                else if (cellData.type === "edgeCell") {
                    var edge = grid.edges[cellData.edgeIndex];
                    if (!edge)
                        throw new Error("Edge index ".concat(cellData.edgeIndex, " not found for edgeCell"));
                    var edgeCell = new EdgeCell_1.default();
                    edgeCell.edge = edge;
                    edgeCell.connectsToNorth = !!cellData.connectsToNorth;
                    edgeCell.connectsToEast = !!cellData.connectsToEast;
                    edgeCell.connectsToSouth = !!cellData.connectsToSouth;
                    edgeCell.connectsToWest = !!cellData.connectsToWest;
                    edgeCell.hasArrowNorth = !!cellData.hasArrowNorth;
                    edgeCell.hasArrowEast = !!cellData.hasArrowEast;
                    edgeCell.hasArrowSouth = !!cellData.hasArrowSouth;
                    edgeCell.hasArrowWest = !!cellData.hasArrowWest;
                    cell = edgeCell;
                }
                else {
                    throw new Error("Unknown cell type: ".concat(cellData.type));
                }
                cell.row = cellData.row;
                cell.col = cellData.col;
                grid.grid[cell.row][cell.col] = cell;
            }
        }
        grid.checkGridIntegrity();
        return grid;
    };
    DrawnGrid.prototype.checkGridIntegrity = function () {
        // Check that all node and edge cells exist in the grid and match type
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            for (var _b = 0, _c = node.getCells(); _b < _c.length; _b++) {
                var cell = _c[_b];
                var gridCell = this.grid[cell.row][cell.col];
                if (!gridCell || gridCell.getCellType() !== cell.getCellType()) {
                    throw new Error("Node cell at (".concat(cell.row, ",").concat(cell.col, ") missing or type mismatch in grid"));
                }
            }
        }
        for (var _d = 0, _e = this.edges; _d < _e.length; _d++) {
            var edge = _e[_d];
            for (var _f = 0, _g = edge.getCells(); _f < _g.length; _f++) {
                var cell = _g[_f];
                var gridCell = this.grid[cell.row][cell.col];
                if (!gridCell || gridCell.getCellType() !== cell.getCellType()) {
                    throw new Error("Edge cell at (".concat(cell.row, ",").concat(cell.col, ") missing or type mismatch in grid"));
                }
            }
        }
        // Optionally: check for extra cells in grid not referenced by any node/edge
    };
    DrawnGrid.prototype.evaluate = function () {
        // TODO: Implement evaluation
        return 0;
    };
    DrawnGrid.prototype.findValidAttachmentPoint = function (node, preferredDirection) {
        // Get all cells that belong to this node
        var nodeCells = node.getCells();
        // Try each direction in order: preferred, then clockwise
        var directions = ['N', 'E', 'S', 'W'];
        var startIndex = directions.indexOf(preferredDirection);
        // Rotate array to start with preferred direction
        var orderedDirections = __spreadArray(__spreadArray([], directions.slice(startIndex), true), directions.slice(0, startIndex), true);
        for (var _i = 0, orderedDirections_1 = orderedDirections; _i < orderedDirections_1.length; _i++) {
            var direction = orderedDirections_1[_i];
            // For each cell of the node, check if there's a valid attachment point in this direction
            for (var _a = 0, nodeCells_1 = nodeCells; _a < nodeCells_1.length; _a++) {
                var cell = nodeCells_1[_a];
                // First check: attachment point must be within bounds and empty
                var attachmentPoint = this.getAdjacentCoordinate(cell, direction);
                if (!attachmentPoint)
                    continue; // Skip if attachment point would be out of bounds
                // Verify attachment point is within grid bounds
                if (attachmentPoint.row < 0 || attachmentPoint.row >= this.getRows() ||
                    attachmentPoint.col < 0 || attachmentPoint.col >= this.getCols()) {
                    continue; // Skip if attachment point is out of bounds
                }
                if (!this.isCellEmpty(attachmentPoint))
                    continue; // Skip if attachment point is not empty
                // Second check: breathing space can be empty OR out of bounds
                var tempCell = new EmptyCell_1.default();
                tempCell.row = attachmentPoint.row;
                tempCell.col = attachmentPoint.col;
                var breathingSpace = this.getAdjacentCoordinate(tempCell, direction);
                // If breathing space exists, it must be empty
                if (breathingSpace && !this.isCellEmpty(breathingSpace))
                    continue;
                // If we get here, we have a valid attachment point:
                // - The attachment point exists, is within bounds, and is empty
                // - The breathing space is either empty or out of bounds
                return attachmentPoint;
            }
        }
        return null;
    };
    DrawnGrid.prototype.getAdjacentCoordinate = function (cell, direction) {
        var coord = { row: cell.row, col: cell.col };
        switch (direction) {
            case 'N':
                if (coord.row > 0)
                    return { row: coord.row - 1, col: coord.col };
                break;
            case 'E':
                if (coord.col < this.getCols() - 1)
                    return { row: coord.row, col: coord.col + 1 };
                break;
            case 'S':
                if (coord.row < this.getRows() - 1)
                    return { row: coord.row + 1, col: coord.col };
                break;
            case 'W':
                if (coord.col > 0)
                    return { row: coord.row, col: coord.col - 1 };
                break;
        }
        return null;
    };
    DrawnGrid.prototype.extendRandomly = function () {
        var action = Math.floor(Math.random() * 4);
        var rowIndex = null;
        var colIndex = null;
        console.log("Current grid dimensions: ".concat(this.getRows(), " rows x ").concat(this.getCols(), " cols"));
        switch (action) {
            case 0:
                rowIndex = this.getRandomCloneableRowIndex();
                if (rowIndex !== null) {
                    console.log("Cloning row at index ".concat(rowIndex));
                    this.cloneRowAt(rowIndex);
                }
                else {
                    console.log("No cloneable row found");
                }
                break;
            case 1:
                colIndex = this.getRandomCloneableColIndex();
                if (colIndex !== null) {
                    console.log("Cloning column at index ".concat(colIndex));
                    this.cloneColAt(colIndex);
                }
                else {
                    console.log("No cloneable column found");
                }
                break;
            case 2:
                console.log("Adding empty row to start of grid");
                this.addEmptyRowToStartofGrid();
                break;
            case 3:
                console.log("Adding empty column to start of grid");
                this.addEmptyColumnToStartofGrid();
                break;
        }
        // Validate grid structure after extension
        console.log("New grid dimensions: ".concat(this.getRows(), " rows x ").concat(this.getCols(), " cols"));
        if (this.grid.length === 0 || this.grid[0].length === 0) {
            console.error("Grid structure is invalid after extension!");
            // Ensure grid has at least one cell
            this.grid = [[new EmptyCell_1.default()]];
        }
        // Render the grid after cloning for debugging
        console.log("Grid after extending:");
        console.log(this.renderAsASCII());
        console.log("\n");
    };
    DrawnGrid.prototype.placeEdges = function (configuredGrid) {
        // Sort edges by placement priority (same as nodes)
        var sortedEdges = __spreadArray([], configuredGrid.edges, true).sort(function (a, b) {
            return a.placementPriority - b.placementPriority;
        });
        for (var _i = 0, sortedEdges_1 = sortedEdges; _i < sortedEdges_1.length; _i++) {
            var edge = sortedEdges_1[_i];
            this.placeEdge(edge);
        }
    };
    DrawnGrid.prototype.findManhattanPath = function (start, end) {
        var _this = this;
        // Helper to check if a coordinate is an attachment point
        var isAttachmentPoint = function (coord) {
            return (coord.row === start.row && coord.col === start.col) ||
                (coord.row === end.row && coord.col === end.col);
        };
        // Helper to check if a move is allowed
        var canMove = function (from, to, dir) {
            var fromCell = _this.grid[from.row][from.col];
            var toCell = _this.grid[to.row][to.col];
            if (dir.row !== 0) { // Vertical move
                if (!isAttachmentPoint(from) && !fromCell.isVerticallyTraversable())
                    return false;
                if (!isAttachmentPoint(to) && !toCell.isVerticallyTraversable())
                    return false;
            }
            else { // Horizontal move
                if (!isAttachmentPoint(from) && !fromCell.isHorizontallyTraversable())
                    return false;
                if (!isAttachmentPoint(to) && !toCell.isHorizontallyTraversable())
                    return false;
            }
            return true;
        };
        // Simple BFS implementation
        var queue = [{ coord: start, path: [start] }];
        var visited = new Set();
        visited.add("".concat(start.row, ",").concat(start.col));
        while (queue.length > 0) {
            var _a = queue.shift(), coord = _a.coord, path = _a.path;
            if (coord.row === end.row && coord.col === end.col) {
                return path;
            }
            // Try all four directions
            var directions = [
                { row: -1, col: 0 }, // North
                { row: 1, col: 0 }, // South
                { row: 0, col: -1 }, // West
                { row: 0, col: 1 } // East
            ];
            for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
                var dir = directions_1[_i];
                var nextCoord = { row: coord.row + dir.row, col: coord.col + dir.col };
                var key = "".concat(nextCoord.row, ",").concat(nextCoord.col);
                if (visited.has(key))
                    continue;
                if (!this.isCoordinateInGrid(nextCoord.row, nextCoord.col))
                    continue;
                if (!canMove(coord, nextCoord, dir))
                    continue;
                visited.add(key);
                queue.push({ coord: nextCoord, path: __spreadArray(__spreadArray([], path, true), [nextCoord], false) });
            }
        }
        return null;
    };
    DrawnGrid.prototype.addPathCell = function (edge, coord, prevCoord, nextCoord) {
        var cell = new EdgeCell_1.default();
        cell.row = coord.row;
        cell.col = coord.col;
        cell.edge = edge;
        // Connect to previous cell
        if (prevCoord) {
            var direction = this.getDirectionFromTo(prevCoord, coord);
            if (direction) {
                switch (direction) {
                    case 'N':
                        cell.connectsToNorth = true;
                        break;
                    case 'E':
                        cell.connectsToEast = true;
                        break;
                    case 'S':
                        cell.connectsToSouth = true;
                        break;
                    case 'W':
                        cell.connectsToWest = true;
                        break;
                }
            }
        }
        // Connect to next cell
        if (nextCoord) {
            var direction = this.getDirectionFromTo(coord, nextCoord);
            if (direction) {
                switch (direction) {
                    case 'N':
                        cell.connectsToNorth = true;
                        break;
                    case 'E':
                        cell.connectsToEast = true;
                        break;
                    case 'S':
                        cell.connectsToSouth = true;
                        break;
                    case 'W':
                        cell.connectsToWest = true;
                        break;
                }
            }
        }
        // Add to edge and grid
        edge.addCell(cell);
        this.grid[coord.row][coord.col] = cell;
        return cell;
    };
    DrawnGrid.prototype.clearPathCells = function (edge, keepAttachmentPoints) {
        if (keepAttachmentPoints === void 0) { keepAttachmentPoints = true; }
        // Get all cells except attachment points if needed
        var cellsToClear = keepAttachmentPoints
            ? edge.getCells().slice(2) // Skip first two cells (attachment points)
            : edge.getCells();
        // Clear each cell from the grid and edge
        for (var _i = 0, cellsToClear_1 = cellsToClear; _i < cellsToClear_1.length; _i++) {
            var cell = cellsToClear_1[_i];
            this.grid[cell.row][cell.col] = new EmptyCell_1.default();
        }
        // Reset edge's cells array to just attachment points if needed
        if (keepAttachmentPoints) {
            edge.getCells().splice(2); // Remove all cells after the first two
        }
        else {
            edge.getCells().splice(0); // Remove all cells
        }
    };
    DrawnGrid.prototype.placeEdge = function (edge) {
        console.log("Attempting to place edge from ".concat(edge.ogData.fromNode, " to ").concat(edge.ogData.toNode));
        // Find the sender and receiver nodes
        var senderNode = this.nodes.find(function (n) { return n.ogData.id === edge.ogData.fromNode; });
        if (!senderNode) {
            console.error("Could not find sender node ".concat(edge.ogData.fromNode));
            return;
        }
        var receiverNode = this.nodes.find(function (n) { return n.ogData.id === edge.ogData.toNode; });
        if (!receiverNode) {
            console.error("Could not find receiver node ".concat(edge.ogData.toNode));
            return;
        }
        var attempts = 0;
        var MAX_ATTEMPTS = 200; // Increased for more thorough attempts
        // Create an empty edge that we'll populate immediately but clear on retry
        var currentEdge = new DrawnEdge_1.default(edge, senderNode, receiverNode);
        var senderAttachmentPoint = null;
        var receiverAttachmentPoint = null;
        var senderEdgeCell = null;
        var receiverEdgeCell = null;
        while (attempts < MAX_ATTEMPTS) {
            // Step 1: Try to find sender attachment point
            if (!senderAttachmentPoint) {
                senderAttachmentPoint = this.findValidAttachmentPoint(senderNode, edge.cardinalPreferenceForSenderAttachment);
                if (!senderAttachmentPoint) {
                    console.log("No valid sender attachment point found, extending grid...");
                    this.extendRandomly();
                    attempts++;
                    continue;
                }
                console.log("Found valid sender attachment point at (".concat(senderAttachmentPoint.row, ", ").concat(senderAttachmentPoint.col, ")"));
                // Create the sender edge cell
                senderEdgeCell = new EdgeCell_1.default();
                senderEdgeCell.row = senderAttachmentPoint.row;
                senderEdgeCell.col = senderAttachmentPoint.col;
                // Set connection and arrow properties for sender
                var senderDirection = this.getDirectionFromTo(senderAttachmentPoint, senderNode.getCoordinate());
                if (senderDirection) {
                    // Set connection towards sender
                    switch (senderDirection) {
                        case 'N':
                            senderEdgeCell.connectsToSouth = true;
                            break;
                        case 'E':
                            senderEdgeCell.connectsToWest = true;
                            break;
                        case 'S':
                            senderEdgeCell.connectsToNorth = true;
                            break;
                        case 'W':
                            senderEdgeCell.connectsToEast = true;
                            break;
                    }
                    // Set arrow if needed
                    if (edge.arrowAtSender) {
                        switch (senderDirection) {
                            case 'N':
                                senderEdgeCell.hasArrowSouth = true;
                                break;
                            case 'E':
                                senderEdgeCell.hasArrowWest = true;
                                break;
                            case 'S':
                                senderEdgeCell.hasArrowNorth = true;
                                break;
                            case 'W':
                                senderEdgeCell.hasArrowEast = true;
                                break;
                        }
                    }
                }
                // Debug log for sender attachment point
                console.log("\nSender attachment point properties:");
                console.log("Connections:");
                console.log("  connectsToNorth: ".concat(senderEdgeCell.connectsToNorth));
                console.log("  connectsToEast:  ".concat(senderEdgeCell.connectsToEast));
                console.log("  connectsToSouth: ".concat(senderEdgeCell.connectsToSouth));
                console.log("  connectsToWest:  ".concat(senderEdgeCell.connectsToWest));
                console.log("Arrows:");
                console.log("  hasArrowNorth: ".concat(senderEdgeCell.hasArrowNorth));
                console.log("  hasArrowEast:  ".concat(senderEdgeCell.hasArrowEast));
                console.log("  hasArrowSouth: ".concat(senderEdgeCell.hasArrowSouth));
                console.log("  hasArrowWest:  ".concat(senderEdgeCell.hasArrowWest));
                console.log("\nHuman readable data string: ".concat(senderEdgeCell.getHumanReadableDataString(), "\n"));
                // Add sender cell to edge and update grid
                currentEdge.addCell(senderEdgeCell);
                this.grid[senderAttachmentPoint.row][senderAttachmentPoint.col] = senderEdgeCell;
                // Debug render after sender placement
                console.log("Grid after sender attachment:");
                console.log(this.renderAsASCII());
                console.log("\n");
            }
            // Step 2: Try to find receiver attachment point
            if (!receiverAttachmentPoint) {
                receiverAttachmentPoint = this.findValidAttachmentPoint(receiverNode, edge.cardinalPreferenceForReceiverAttachment);
                if (!receiverAttachmentPoint) {
                    console.log("No valid receiver attachment point found, clearing sender and extending grid...");
                    // Clear sender attachment
                    if (senderAttachmentPoint && senderEdgeCell) {
                        this.grid[senderAttachmentPoint.row][senderAttachmentPoint.col] = new EmptyCell_1.default();
                        senderAttachmentPoint = null;
                        senderEdgeCell = null;
                    }
                    // Clear the edge completely
                    currentEdge.getCells().splice(0);
                    this.extendRandomly();
                    attempts++;
                    continue;
                }
                console.log("Found valid receiver attachment point at (".concat(receiverAttachmentPoint.row, ", ").concat(receiverAttachmentPoint.col, ")"));
                // Create the receiver edge cell
                receiverEdgeCell = new EdgeCell_1.default();
                receiverEdgeCell.row = receiverAttachmentPoint.row;
                receiverEdgeCell.col = receiverAttachmentPoint.col;
                // Set connection and arrow properties for receiver
                var receiverDirection = this.getDirectionFromTo(receiverAttachmentPoint, receiverNode.getCoordinate());
                if (receiverDirection) {
                    // Set connection towards receiver
                    switch (receiverDirection) {
                        case 'N':
                            receiverEdgeCell.connectsToSouth = true;
                            break;
                        case 'E':
                            receiverEdgeCell.connectsToWest = true;
                            break;
                        case 'S':
                            receiverEdgeCell.connectsToNorth = true;
                            break;
                        case 'W':
                            receiverEdgeCell.connectsToEast = true;
                            break;
                    }
                    // Set arrow if needed
                    if (edge.arrowAtReceiver) {
                        switch (receiverDirection) {
                            case 'N':
                                receiverEdgeCell.hasArrowSouth = true;
                                break;
                            case 'E':
                                receiverEdgeCell.hasArrowWest = true;
                                break;
                            case 'S':
                                receiverEdgeCell.hasArrowNorth = true;
                                break;
                            case 'W':
                                receiverEdgeCell.hasArrowEast = true;
                                break;
                        }
                    }
                }
                // Debug log for receiver attachment point
                console.log("\nReceiver attachment point properties:");
                console.log("Connections:");
                console.log("  connectsToNorth: ".concat(receiverEdgeCell.connectsToNorth));
                console.log("  connectsToEast:  ".concat(receiverEdgeCell.connectsToEast));
                console.log("  connectsToSouth: ".concat(receiverEdgeCell.connectsToSouth));
                console.log("  connectsToWest:  ".concat(receiverEdgeCell.connectsToWest));
                console.log("Arrows:");
                console.log("  hasArrowNorth: ".concat(receiverEdgeCell.hasArrowNorth));
                console.log("  hasArrowEast:  ".concat(receiverEdgeCell.hasArrowEast));
                console.log("  hasArrowSouth: ".concat(receiverEdgeCell.hasArrowSouth));
                console.log("  hasArrowWest:  ".concat(receiverEdgeCell.hasArrowWest));
                console.log("\nHuman readable data string: ".concat(receiverEdgeCell.getHumanReadableDataString(), "\n"));
                // Add receiver cell to edge and update grid
                currentEdge.addCell(receiverEdgeCell);
                this.grid[receiverAttachmentPoint.row][receiverAttachmentPoint.col] = receiverEdgeCell;
                // Debug render after receiver placement
                console.log("Grid after receiver attachment:");
                console.log(this.renderAsASCII());
                console.log("\n");
            }
            // Step 3: Try to find path between attachment points
            var path = this.findManhattanPath(senderAttachmentPoint, receiverAttachmentPoint);
            if (!path) {
                console.log("No valid path found between attachment points, clearing both attachments and extending grid...");
                // Clear both attachments
                if (senderAttachmentPoint) {
                    this.grid[senderAttachmentPoint.row][senderAttachmentPoint.col] = new EmptyCell_1.default();
                    senderAttachmentPoint = null;
                    senderEdgeCell = null;
                }
                if (receiverAttachmentPoint) {
                    this.grid[receiverAttachmentPoint.row][receiverAttachmentPoint.col] = new EmptyCell_1.default();
                    receiverAttachmentPoint = null;
                    receiverEdgeCell = null;
                }
                // Clear the edge completely
                currentEdge.getCells().splice(0);
                this.extendRandomly();
                attempts++;
                continue;
            }
            // Add path cells (excluding attachment points which are already placed)
            for (var i = 1; i < path.length - 1; i++) {
                var prevCoord = path[i - 1];
                var currentCoord = path[i];
                var nextCoord = path[i + 1];
                this.addPathCell(currentEdge, currentCoord, prevCoord, nextCoord);
            }
            // Debug render after path placement
            console.log("Grid after path placement:");
            console.log(this.renderAsASCII());
            console.log("\n");
            // Add the edge to the grid's edges array
            this.edges.push(currentEdge);
            console.log("Edge placed successfully with both attachment points and path");
            return;
        }
        console.error("Failed to place edge after ".concat(MAX_ATTEMPTS, " attempts"));
    };
    DrawnGrid.prototype.getDirectionFromTo = function (from, to) {
        if (from.row === to.row) {
            if (from.col < to.col)
                return 'E';
            if (from.col > to.col)
                return 'W';
        }
        if (from.col === to.col) {
            if (from.row < to.row)
                return 'S';
            if (from.row > to.row)
                return 'N';
        }
        return null;
    };
    return DrawnGrid;
}());
exports.default = DrawnGrid;

/**
 * Container class for Tile, distributes and organizes
 * @param {HTML Element} elem Container within which to place tiles
 * @param {String} distribution Mode of distributing tiles (center, top, left)
 * @param {Int} resolution How small the tile areas are gonna be
 */
class Masonry {
    constructor(elem, distribution = "center", resolution = 32) {
        this.elem = elem;
        this.maxWidth = resolution;
        const boxSize = this.elem.offsetWidth / this.maxWidth;
        this.maxHeight = Math.floor(this.elem.offsetHeight / boxSize);
        this.centerSpace = [Math.floor(this.maxWidth / 2), Math.floor(this.maxHeight / 2)];
        this.elem.style.setProperty("display", "grid"); // tiles will be distributed on Grid... set it
        this.elem.style.setProperty("grid-auto-columns", boxSize + "px");
        this.elem.style.setProperty("grid-auto-rows", boxSize + "px");
        this.distribution = distribution;
        this.placedTiles = [];
        this.possibleDim = [ // initial possible tile dimensions
            [2, 2],
            [2, 3],
            [3, 2]
        ]
    }

    /**
     * Checks for overlap in position between two given Tile objects
     * @param  {Tile} a Tile A
     * @param  {Tile} b Tile B
     * @return {Bool} Whether or not they overlap
     */
    areTilesConflicting(a, b) {
        if ((a.x <= b.x && b.x < a.btmX) || (a.x < b.btmX && b.btmX <= a.btmX) || (b.x <= a.x && a.x < b.btmX) || (b.x < a.btmX && a.btmX <= b.btmX)) {
            if ((a.y <= b.y && b.y < a.btmY) || (a.y < b.btmY && b.btmY <= a.btmY) || (b.y <= a.y && a.y < b.btmY) || (b.y < a.btmY && a.btmY <= b.btmY)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if Tile doesn't conflict with any other placed Tiles and if doesn't overflow
     * @param  {Tile} tile Tile to check pos of
     * @return {Boolean} Is Tile position okay?
     */
    isTilePosAcceptable(tile) {
        for (var placedTile of this.placedTiles) {
            if (this.areTilesConflicting(tile, placedTile)) return false;
        };
        if (tile.x < 1 || tile.y < 1 || (tile.btmX - 1 > this.maxWidth && this.distribution != "left") || (tile.btmY - 1 > this.maxHeight && this.distribution != "top")) {
            return false;
        }
        return true;
    }
    /**
     * Grabs random dimensions and returns Tile object of that size
     * @return {Tile} Tile of random dimension
     */
    getRandSizeTile() {
        const rand = Math.floor(Math.random() * this.possibleDim.length);
        return (new Tile(1, 1, this.possibleDim[rand][0], this.possibleDim[rand][1]))
    }
    /**
     * Shift tile around in given space to make it fit
     * @param  {Tile} tile Tile to fit
     * @param  {Array} space Location of space to fit in
     * @return {Boolean} Whether has been fitted
     */
    isTileFit(tile, space) {
        tile.setXY(space[0], space[1]);
        if (this.isTilePosAcceptable(tile)) return true;

        tile.shiftX();
        if (this.isTilePosAcceptable(tile)) return true;

        tile.shiftY();
        if (this.isTilePosAcceptable(tile)) return true;

        tile.unshiftX();
        if (this.isTilePosAcceptable(tile)) return true;

        return false;
    }

    /**
     * Find space to check next, based on distribution mode
     * @param  {Array} oldSpaces Last used space
     * @return {Array} New space
     */
    getNextSpaceToCheck(oldSpaces) {
        var newSpaces = [];
        if (this.distribution == "center") {
            if (oldSpaces.length == 0) {
                newSpaces = [this.centerSpace]
            }
            oldSpaces.forEach(oldSpace => {
                if (oldSpace[0] >= this.centerSpace[0]) {
                    newSpaces.push([oldSpace[0] + 1, oldSpace[1]])
                }
                if (oldSpace[0] <= this.centerSpace[0]) {
                    newSpaces.push([oldSpace[0] - 1, oldSpace[1]])
                }
                if (oldSpace[0] == this.centerSpace[0]) {
                    if (oldSpace[1] >= this.centerSpace[1]) {
                        newSpaces.push([oldSpace[0], oldSpace[1] + 1])
                    }
                    if (oldSpace[1] <= this.centerSpace[1]) {
                        newSpaces.push([oldSpace[0], oldSpace[1] - 1])
                    }
                }
            })
        } else if (this.distribution == "top") {
            if (oldSpaces.length == 0) {
                for (var i = 1; i < this.maxWidth; i++) {
                    newSpaces.push([i, 1])
                }
            }
            oldSpaces.forEach(oldSpace => {
                newSpaces.push([oldSpace[0], oldSpace[1] + 1])
            })
        } else if (this.distribution == "left") {
            if (oldSpaces.length == 0) {
                for (var i = 1; i < this.maxHeight; i++) {
                    newSpaces.push([1, i])
                }
            }
            oldSpaces.forEach(oldSpace => {
                newSpaces.push([oldSpace[0] + 1, oldSpace[1]])
            })
        }
        var retSpaces = [];
        newSpaces.forEach((space) => {
            if (space[0] <= 0 || space[0] > this.maxWidth || space[1] <= 0 || space[1] > this.maxHeight) {
                if ((space[0] > this.maxWidth && this.distribution == "left") || (space[1] > this.maxHeight && this.distribution == "top")) {
                    retSpaces.push(space)
                }
            } else {
                retSpaces.push(space)
            }
        });
        return retSpaces
    }
    /**
     * Grab elements with given Class names, form tiles for them, and render them out
     * @param  {String} className Class identifier for Tile elements
     */
    placeTilesByClass(className) {
        var tileElems = Array.from(document.getElementsByClassName(className));
        var tiles = [];
        tileElems.forEach(elem => {
            let curTile = this.getRandSizeTile();
            curTile.setElem(elem);
            let dim = [curTile.elem.getAttribute("height"), curTile.elem.getAttribute("width")];
            if (!(dim[0] == null)) {
                curTile.setDim(parseInt(dim[0]), curTile.width)
            }
            if (!(dim[1] == null)) {
                curTile.setDim(curTile.height, parseInt(dim[1]))
            }
            tiles.push(curTile)
        });
        this.placeTiles(tiles)
    }
    /**
     * Generate new elements as Tiles and place them
     * @param  {Array} classNames List of Class names to give to each elem
     * @param  {String} styles Value of inline style of each elem
     * @param  {String} innerHTML Value of HTML to place into each elem
     * @return {Bool} Whether all tiles were successfully placed
     */
    placeGeneratedTile(classNames = [], styles = "", innerHTML = "") {
        let tileElem = document.createElement("DIV");
        classNames.forEach(name => {
            tileElem.classList.add(name)
        });
        tileElem.innerHTML = innerHTML;
        var tile = app.getRandSizeTile();
        tile.setElem(tileElem);
        if (!app.placeTiles([tile])) {
            return false;
        }
        tileElem.setAttribute("style", (tileElem.getAttribute("style") + " " + styles));
        this.elem.appendChild(tileElem);
        return true;
    }
    /**
     * Fits given Tiles into current Masonry and renders/places them there
     * @param  {Array} newTiles Array of Tile objects
     * @return {Bool} Whether all tiles weere successfully placed
     */
    placeTiles(newTiles) {
        var curSpaces = [];
        while (newTiles.length > 0) {
            curSpaces = this.getNextSpaceToCheck(curSpaces);
            if (curSpaces.length == 0) {
                return !1
            }
            curSpaces.forEach(curSpace => {
                if (newTiles.length <= 0) {
                    return this.placedTiles.length
                }
                var curTile = newTiles[0];
                if (this.isTileFit(curTile, curSpace)) {
                    curTile.render();
                    this.placedTiles.push(curTile);
                    newTiles.splice(0, 1)
                }
            })
        }
        return this.placedTiles.length
    }
    /**
     * Converts Masonry layout to printable String
     * @return {String} Masonry layout description
     */
    toString() {
        var retString = "";
        this.placedTiles.forEach(tile => {
            retString += tile.toString() + "\n"
        });
        return retString
    }
}

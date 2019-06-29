/**
 * Holds necessary information for Tile element, as well as useful Tile
 * manipulation methods and a rendering method
 * @param {Int} x X position
 * @param {Int} y Y position
 * @param {Int} height Tile height
 * @param {Int} width Tile width
 */
class Tile {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.resetBtm();
        this.elem
    }
    /**
     * Sets elem to enable rendering
     * @param {HTML Element} element HTML element that should be the tile
     */
    setElem(element) {
        this.elem = element
    }
    /**
     * Resets position
     * @param {int} x X Position
     * @param {int} y Y Position
     */
    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.resetBtm()
    }
    /**
     * Resets height
     * @param {int} height The height
     * @param {width} width The width
     */
    setDim(height, width) {
        this.height = height;
        this.width = width;
        this.resetBtm()
    }

    /**
     * ALL SHIFT AND UNSHIFT:
     * Manipulate tile position (down, up, left, right)
     */
    shiftX() {
        this.x = this.x - this.width + 1;
        this.resetBtm()
    }
    shiftY() {
        this.y = this.y - this.height + 1;
        this.resetBtm()
    }
    unshiftX() {
        this.x = this.x + this.width - 1;
        this.resetBtm()
    }
    unshiftY() {
        this.y = this.y + this.height - 1;
        this.resetBtm()
    }

    /**
     * UTILITY: Resets the bottom values for the Tiles
     */
    resetBtm() {
        this.btmX = this.x + (this.width);
        this.btmY = this.y + (this.height)
    }
    /**
     * Imposes virtual structure onto real given html element
     */
    render() {
        var x = this.x;
        var y = this.y;
        this.elem.setAttribute("style", "grid-column-start: " + x + "; grid-column-end: " + (this.btmX) + "; grid-row-start: " + (y) + "; grid-row-end: " + (this.btmY) + ";")
    }
    /**
     * Clones tile
     * @return {Tile} Tile copy
     */
    copy() {
        return new Tile(this.x, this.y, this.height, this.width)
    }
    /**
     * Returns string representation of tile
     * @return {String} Displayable Tile information
     */
    toString() {
        return ("x: " + this.x + "; y: " + this.y + ";\n height: " + this.height + "; width: " + this.width + ";\n btmX: " + this.btmX + "; btmY: " + this.btmY + ";")
    }
}

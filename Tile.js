/* Holds and is able to render a Tile -- functions like React Component tbh
*/
module.exports = class Tile {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.resetBtm();
        this.elem
    }
    setElem(element) {
        this.elem = element
    }
    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.resetBtm()
    }
    setDim(height, width) {
        this.height = height;
        this.width = width;
        this.resetBtm()
    }
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
    resetBtm() {
        this.btmX = this.x + (this.width);
        this.btmY = this.y + (this.height)
    }
    render() {
        var x = this.x;
        var y = this.y;
        this.elem.setAttribute("style", "grid-column-start: " + x + "; grid-column-end: " + (this.btmX) + "; grid-row-start: " + (y) + "; grid-row-end: " + (this.btmY) + ";")
    }
    copy() {
        return new Tile(this.x, this.y, this.height, this.width)
    }
    toString() {
        return ("x: " + this.x + "; y: " + this.y + ";\n height: " + this.height + "; width: " + this.width + ";\n btmX: " + this.btmX + "; btmY: " + this.btmY + ";")
    }
}

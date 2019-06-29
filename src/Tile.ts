/**
 * Holds representation of Tile element, as well as tile manipulation methods and a render method
 * @param x      X position of tile
 * @param y      Y position of tile
 * @param height Tile height
 * @param width  Tile width
 */
class Tile {
  x:number;
  y:number;
  btmX:number;
  btmY:number;
  height:number;
  width:number;
  elem:HTMLElement;

  public constructor(x:number, y:number, height:number, width:number) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.resetBtm();
  }





  /* SETTER METHODS */

  /**
   * Setter for this.elem, attaching actual DOM object to this tile
   * @param elem DOM object
   */
  public setElem(elem:HTMLElement):void {
    this.elem = elem;
  }
  /**
   * Setter for this Tile's position
   * @param x Desired tile x position
   * @param y Desired tile y position
   */
  public setXY(x:number, y:number):void {
    this.x = x;
    this.y = y;
    this.resetBtm();
  }
  /**
   * Setter for this Tile's dimensions
   * @param height Desired tile height
   * @param width  Desired tile width
   */
  public setDim(height:number, width:number):void {
    this.height = height;
    this.width = width;
    this.resetBtm();
  }

  /**
   * UTILITY
   * Resets the bottom values for the Tiles. Called a lot by setters
   */
  protected resetBtm():void {
    this.btmX = this.x + this.width;
    this.btmY = this.y + this.height;
  }






  /* TILE POSITION MANIPULATOR METHODS */

  /**
   * ALL SHIFT AND UNSHIFT
   * Manipulate tile position (down, up, left, right)
   */
  public shiftX():void {
    this.x = this.x - this.width + 1;
    this.resetBtm();
  }
  public shiftY():void {
    this.y = this.y - this.height + 1;
    this.resetBtm();
  }
  public unshiftX():void {
    this.x = this.x + this.width - 1;
    this.resetBtm();
  }
  public unshiftY():void {
    this.y = this.y + this.height - 1;
    this.resetBtm();
  }




  /**
   * Imposes virtual structure on given real DOM element
   */
  public render():void {
    if (!this.elem) return console.error('No DOM element specified for render');
    this.elem.setAttribute("style", "grid-column-start: " + this.x + "; grid-column-end: " + (this.btmX) + "; grid-row-start: " + (this.y) + "; grid-row-end: " + (this.btmY) + ";");
  }




  /**
   * Clones current tile
   * @return New Tile object
   */
  public copy():object {
    const copyTile =  new Tile(this.x, this.y, this.height, this.width);
    copyTile.setElem(this.elem);
    return copyTile;
  }
  /**
   * Converts tile to more-readable string
   * @return String representation of tile data
   */
  public toString():string {
    return `Tile: {x: ${this.x}, y: ${this.y},\nheight: ${this.height}, width: ${this.width},\nbtmX: ${this.btmX}, btmY: ${this.btmY}}`;
  }
}

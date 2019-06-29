/// <reference path="Tile.ts"/>

/**
 * Layout class to distribute and organize Tile
 * @param elem         DOM element within which to render
 * @param distribution distribution mode determining layout (center, top, left)
 * @param resolution   resolution (controls small tiles can be)
 */
class Masonry {
  elem:HTMLElement;
  maxWidth:number;
  maxHeight:number;
  centerSpace:Array<number>;
  distribution:string;
  placedTiles:Array<Tile>;
  possibleDim:Array<Array<number>>;

  constructor(elem:HTMLElement, distribution?:string, resolution?) {
    this.elem = elem;
    this.maxWidth = resolution || 32;

    const boxSize = elem.offsetWidth / this.maxWidth;
    elem.style.setProperty('display', 'grid');
    elem.style.setProperty('grid-auto-columns', `${boxSize}px`);
    elem.style.setProperty('grid-auto-rows', `${boxSize}px`);

    this.maxHeight = Math.floor(this.elem.offsetHeight / boxSize);
    this.centerSpace = [Math.floor(this.maxWidth / 2), Math.floor(this.maxHeight / 2)];
    this.distribution = distribution || 'center';
    this.placedTiles = [];
    this.possibleDim = [ // initial possible tile dimensions
      [2, 2],
      [2, 3],
      [3, 2],
    ];
  }


  /**
   * Checks for overlap in position between two given Tile objects
   * @param  a Tile A
   * @param  b Tile B
   * @return   IS overlap exists?
   */
  protected areTilesConflicting(a:Tile, b:Tile):boolean {
    if ((a.x <= b.x && b.x < a.btmX) || (a.x < b.btmX && b.btmX <= a.btmX) || (b.x <= a.x && a.x < b.btmX) || (b.x < a.btmX && a.btmX <= b.btmX)) {
        if ((a.y <= b.y && b.y < a.btmY) || (a.y < b.btmY && b.btmY <= a.btmY) || (b.y <= a.y && a.y < b.btmY) || (b.y < a.btmY && a.btmY <= b.btmY)) {
            return true;
        }
    }
    return false;
  }

  /**
   * Check if Tile doesn't conflict with any other previously placed Tiles or overflows
   * @param  tile Tile to check
   * @return     IS conflicting with current placements?
   */
  protected isTilePosAcceptable(tile:Tile):boolean {
    for (let placedTile of this.placedTiles) {
      if (this.areTilesConflicting(tile, placedTile)) return false;
    }
    if (tile.x < 1 || tile.y < 1 || (tile.btmX - 1 > this.maxWidth && this.distribution != "left") || (tile.btmY - 1 > this.maxHeight && this.distribution != "top")) {
        return false;
    }
    return true;
  }


  /**
   * Grabs random dimensions and returns Tile object of that size
   * @return Sized Tile objec
   */
  protected getRandSizeTile():Tile {
    const rand = Math.floor(Math.random() * this.possibleDim.length);
    return new Tile(1, 1, this.possibleDim[rand][0], this.possibleDim[rand][1]);
  }

  /**
   * Shift tile around in given space to make it fit
   * @param  tile  Tile to fit
   * @param  space Location of space to fit in
   * @return       IS has been fitted?
   */
  protected isTileFit(tile:Tile, space:Array<number>):boolean {
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
   * Find next space to check, based on distribution mode
   * @param  oldSpaces Last used space
   * @return           New space
   */
  protected getNextSpaceToCheck(oldSpaces:Array<number>):Array<number> {
    var newSpaces = [];
    if (this.distribution == "center") {
        if (oldSpaces.length == 0) {
            newSpaces = [this.centerSpace];
        }
        oldSpaces.forEach(oldSpace => {
            if (oldSpace[0] >= this.centerSpace[0]) {
                newSpaces.push([oldSpace[0] + 1, oldSpace[1]]);
            }
            if (oldSpace[0] <= this.centerSpace[0]) {
                newSpaces.push([oldSpace[0] - 1, oldSpace[1]]);
            }
            if (oldSpace[0] == this.centerSpace[0]) {
                if (oldSpace[1] >= this.centerSpace[1]) {
                    newSpaces.push([oldSpace[0], oldSpace[1] + 1]);
                }
                if (oldSpace[1] <= this.centerSpace[1]) {
                    newSpaces.push([oldSpace[0], oldSpace[1] - 1]);
                }
            }
        })
    } else if (this.distribution == "top") {
        if (oldSpaces.length == 0) {
            for (var i = 1; i < this.maxWidth; i++) {
                newSpaces.push([i, 1]);
            }
        }
        oldSpaces.forEach(oldSpace => {
            newSpaces.push([oldSpace[0], oldSpace[1] + 1]);
        })
    } else if (this.distribution == "left") {
        if (oldSpaces.length == 0) {
            for (var i = 1; i < this.maxHeight; i++) {
                newSpaces.push([1, i]);
            }
        }
        oldSpaces.forEach(oldSpace => {
            newSpaces.push([oldSpace[0] + 1, oldSpace[1]]);
        })
    }
    var retSpaces = [];
    newSpaces.forEach((space) => {
        if (space[0] <= 0 || space[0] > this.maxWidth || space[1] <= 0 || space[1] > this.maxHeight) {
            if ((space[0] > this.maxWidth && this.distribution == "left") || (space[1] > this.maxHeight && this.distribution == "top")) {
                retSpaces.push(space);
            }
        } else {
            retSpaces.push(space);
        }
    });
    return retSpaces;
  }





  /* PLACING TILES METHODS */

  /**
   * Grab HTMLElements with given Class names, form tiles for them and render
   * @param className Class identifier to grab by
   */
  public placeTilesByClass(className:string):void {
    const tileElems = [...(document.getElementsByClassName(className) as any)];
    let tiles = [];
    tileElems.forEach(elem => {
        let curTile = this.getRandSizeTile();
        curTile.setElem(elem);
        let dim = [curTile.elem.getAttribute("height"), curTile.elem.getAttribute("width")];
        if (!(dim[0] == null)) {
            curTile.setDim(parseInt(dim[0]), curTile.width)
        }
        if (!(dim[1] == null)) {
            curTile.setDim(curTile.height, parseInt(dim[1]));
        }
        tiles.push(curTile);
    });
    this.placeTiles(tiles);
  }

  /**
   * Generates new elements as Tiles and places them
   * @param  classNames List of classNames to add
   * @param  styles     Value of inline style to add
   * @param  innerHTML  Value of inner HTML to add (as string)
   * @return            IS tile successfully placed
   */
  public placeGeneratedTile(classNames?:Array<string>, styles?:string, innerHTML?:string):boolean {
    classNames = classNames || [];
    styles = styles || '';

    const tileElem = document.createElement("DIV");
    classNames.forEach(name => tileElem.classList.add(name));
    tileElem.innerHTML = innerHTML;
    const tile = this.getRandSizeTile();
    tile.setElem(tileElem);
    tileElem.setAttribute('style', `${tileElem.getAttribute("style")} ${styles}`);
    if (!this.placeTiles([tile])) return false;
    this.elem.appendChild(tileElem);
    return true;
  }

  public placeTiles(newTiles:Array<Tile>):boolean {
    var curSpaces = [];
    while (newTiles.length > 0) {
      curSpaces = this.getNextSpaceToCheck(curSpaces);
      if (curSpaces.length == 0) {
        return false; // ran out of room
      }
      curSpaces.forEach(curSpace => {
        if (newTiles.length <= 0) {
          return true;
        }
        var curTile = newTiles[0];
        if (this.isTileFit(curTile, curSpace)) {
          curTile.render();
          this.placedTiles.push(curTile);
          newTiles.splice(0, 1);
        }
      });
    }
    return true;
  }

  /**
   * Converts Masonry layout to printable string
   * @return Masonry layout description
   */
  public toString():string {
    var retString = '';
    this.placedTiles.forEach(tile => {
      retString += `${tile.toString()}\n`;
    });
    return retString;
  }

}

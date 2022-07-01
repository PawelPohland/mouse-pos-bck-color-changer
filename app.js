"use strict";

class Tile {
  static MAX_COLOR_VALUE = 255;

  _r = 0;
  _g = 0;
  _b = 0;

  constructor(r, g, b) {
    this.red = r;
    this.green = g;
    this.blue = b;
  }

  static parseColorValue(value) {
    let int = 0;

    try {
      let isValid = false;
      if (Number.isInteger(value)) {
        int = Number.parseInt(value, 10);
        isValid = int >= 0 && int <= Tile.MAX_COLOR_VALUE;
      }

      if (!isValid) {
        // color value is invalid - trow exception and return
        // (via finally) 0 as a new color value
        const msg = `Wrong color value!\nExpected value: [0, ..., ${Tile.MAX_COLOR_VALUE}].\nGot: ${value}`;
        int = 0;
        throw new Error(msg);
      }
    } catch (e) {
      console.error(e);
    } finally {
      return int;
    }
  }

  set red(value) {
    this._r = Tile.parseColorValue(value);
  }
  get red() {
    return this._r;
  }

  set green(value) {
    this._g = Tile.parseColorValue(value);
  }
  get green() {
    return this._g;
  }

  set blue(value) {
    this._b = Tile.parseColorValue(value);
  }
  get blue() {
    return this._b;
  }

  toString() {
    return `rgb(${this.red}, ${this.green}, ${this.blue})`;
  }
}

class ColoredTiles {
  constructor(currColorEl, colorsGeneratedEl, container) {
    this.currColorEl = currColorEl;
    this.colorsGeneratedEl = colorsGeneratedEl;
    this.container = container;
    this.tiles = [];
  }

  addTile(tile) {
    this.tiles.unshift(tile);
    this.drawTile(tile);
  }

  drawTile(tile) {
    if (this.container.classList.contains("hidden"))
      this.container.classList.remove("hidden");

    const elem = document.createElement("div");
    elem.classList.add("tile");
    elem.style.backgroundColor = tile.toString();

    this.currColorEl.textContent = `${tile.toString()}`;
    this.colorsGeneratedEl.textContent = `${this.tiles.length} colors generated`;
    this.container.insertAdjacentElement("afterbegin", elem);
  }
}

/**************************************************************************/

const previewElement = document.getElementById("preview");
const currentColorElement = document.querySelector(".current-color");

const colorHistoryElement = document.getElementById("tiles");
const colorsGeneratedElement = document.querySelector(".colors-generated");

const allTiles = new ColoredTiles(
  currentColorElement,
  colorsGeneratedElement,
  colorHistoryElement
);

const onPointerMove = (event) => {
  // get pointer position from event object
  let { offsetX: r, offsetY: g } = event;

  // set blue color value to either some random value
  // or a difference between red and green
  //let b = Math.floor(Math.random() * (Tile.MAX_COLOR_VALUE + 1));
  let b = Math.abs(r - g);

  // make sure that all the values are in range [0, ..., 255]
  const rgb = [r, g, b].map(
    (value) => Math.trunc(value) % Tile.MAX_COLOR_VALUE
  );

  // it's possible that offsetX or offsetY can be negative
  if (rgb.every((value) => value >= 0)) {
    const tile = new Tile(...rgb);
    allTiles.addTile(tile);

    // set preview background color
    previewElement.style.backgroundColor = tile.toString();
  }
};

// document.body.addEventListener("mousemove", onPointerMove);
document.body.addEventListener("pointermove", onPointerMove);

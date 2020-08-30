import { Layers } from './constants';

class SpriteMapEditorCursor extends Sprite {
  initialize() {
    super.initialize(new Bitmap(CycloneMapEditor.tileWidth, CycloneMapEditor.tileHeight));
  }

  update() {
    super.update();
    if (this.visible !== CycloneMapEditor.active) {
      this.visible = CycloneMapEditor.active;
    }

    if (CycloneMapEditor.active) {
      this.updatePosition();
    }
  }

  updateDrawing() {
    if (CycloneMapEditor.isRightButtonDown) {
      return this.updateRectangle();
    }

    switch (CycloneMapEditor.currentTool) {
      case 'fill':
        return this.updateTiles();
      case 'pencil':
        return this.updateTiles();
      case 'eraser':
        return this.updateEraser();
      case 'rectangle':
        if ((!CycloneMapEditor.rectangleWidth && !CycloneMapEditor.rectangleBackWidth) || (!CycloneMapEditor.rectangleHeight && !CycloneMapEditor.rectangleBackHeight)) {
          this.updateTiles();
          return;
        }

        return this.updateRectangle();
    }
  }

  getNewBitmapWidth() {
    return (CycloneMapEditor.tileWidth * (CycloneMapEditor.rectangleWidth || (CycloneMapEditor.rectangleBackWidth + 1))) || 1;
  }

  getNewBitmapHeight() {
    return (CycloneMapEditor.tileHeight * (CycloneMapEditor.rectangleHeight || (CycloneMapEditor.rectangleBackHeight + 1))) || 1;
  }

  updateRectangle() {
    const width = this.getNewBitmapWidth();
    const height = this.getNewBitmapHeight();

    if (width !== this.bitmap.width || height !== this.bitmap.height) {
      this.bitmap = new Bitmap(width, height);
    } else {
      this.bitmap.clear();
    }

    const fillColor = CycloneMapEditor.isRightButtonDown ? '#00000033' : '#00FF0033';

    if (CycloneMapEditor.currentLayer === 5) {
      this.drawTiles();
    }

    if (width > 8 && height > 8) {
      this.bitmap.fillRect(0, 0, width, 4, '#000000');
      this.bitmap.fillRect(0, height - 4, width, 4, '#000000');
      this.bitmap.fillRect(0, 0, 4, height, '#000000');
      this.bitmap.fillRect(width - 4, 0, 4, height, '#000000');

      this.bitmap.fillRect(2, 2, width - 4, 2, '#FFFFFF');
      this.bitmap.fillRect(2, height - 4, width - 4, 2, '#FFFFFF');
      this.bitmap.fillRect(2, 2, 2, height - 4, '#FFFFFF');
      this.bitmap.fillRect(width - 4, 2, 2, height - 4, '#FFFFFF');

      this.bitmap.fillRect(4, 4, width - 8, height - 8, fillColor);
    } else if (width > 0 && height > 0) {
      this.bitmap.fillRect(0, 0, width, height, fillColor);
    }
  }

  updateEraser() {
    const width = this.getNewBitmapWidth();
    const height = this.getNewBitmapHeight();

    if (width !== this.bitmap.width || height !== this.bitmap.height) {
      this.bitmap = new Bitmap(width, height);
    } else {
      this.bitmap.clear();
    }

    if (width > 8 && height > 8) {
      this.bitmap.fillRect(0, 0, width, 4, '#000000');
      this.bitmap.fillRect(0, height - 4, width, 4, '#000000');
      this.bitmap.fillRect(0, 0, 4, height, '#000000');
      this.bitmap.fillRect(width - 4, 0, 4, height, '#000000');

      this.bitmap.fillRect(2, 2, width - 4, 2, '#FFFFFF');
      this.bitmap.fillRect(2, height - 4, width - 4, 2, '#FFFFFF');
      this.bitmap.fillRect(2, 2, 2, height - 4, '#FFFFFF');
      this.bitmap.fillRect(width - 4, 2, 2, height - 4, '#FFFFFF');

      this.bitmap.fillRect(4, 4, width - 8, height - 8, '#FF000033');
    } else if (width > 0 && height > 0) {
      this.bitmap.fillRect(0, 0, width, height, '#FF000033');
    }
  }

  drawMultiLayerTiles() {
    for (let z = 0; z < CycloneMapEditor.multiLayerSelection.length; z++) {
      let column = 0;
      let row = 0;

      for (const tileId of CycloneMapEditor.multiLayerSelection[z]) {
        if (column >= CycloneMapEditor.tileCols) {
          column = 0;
          row++;
        }

        const x = column * CycloneMapEditor.tileWidth;
        const y = row * CycloneMapEditor.tileHeight;

        this.bitmap.drawTile(tileId, x, y);
        column++;
      }
    }
  }

  drawTiles() {
    if (CycloneMapEditor.currentLayer === Layers.auto && CycloneMapEditor.multiLayerSelection.length) {
      this.drawMultiLayerTiles();
      return;
    }

    let column = 0;
    let row = 0;

    for (const tileId of CycloneMapEditor.selectedTileList) {
      if (column >= CycloneMapEditor.tileCols) {
        column = 0;
        row++;
      }

      const x = column * CycloneMapEditor.tileWidth;
      const y = row * CycloneMapEditor.tileHeight;

      if (CycloneMapEditor.currentLayer === 5) {
        this.bitmap.drawRegion(tileId, x, y);
      } else if (CycloneMapEditor.currentLayer === 4) {
        this.bitmap.drawShadow(tileId, x, y);
      } else {
        this.bitmap.drawTile(tileId, x, y);
      }
      column++;
    }
  }

  updateTiles() {
    const width = CycloneMapEditor.tileWidth * CycloneMapEditor.tileCols;
    const height = CycloneMapEditor.tileHeight * CycloneMapEditor.tileRows;

    if (width !== this.bitmap.width || height !== this.bitmap.height) {
      this.bitmap = new Bitmap(width, height);
    } else {
      this.bitmap.clear();
    }

    this.drawTiles();

    if (width > 8 && height > 8) {
      this.bitmap.fillRect(0, 0, width, 4, '#000000');
      this.bitmap.fillRect(0, height - 4, width, 4, '#000000');
      this.bitmap.fillRect(0, 0, 4, height, '#000000');
      this.bitmap.fillRect(width - 4, 0, 4, height, '#000000');

      this.bitmap.fillRect(2, 2, width - 4, 2, '#FFFFFF');
      this.bitmap.fillRect(2, height - 4, width - 4, 2, '#FFFFFF');
      this.bitmap.fillRect(2, 2, 2, height - 4, '#FFFFFF');
      this.bitmap.fillRect(width - 4, 2, 2, height - 4, '#FFFFFF');
    }
  }

  getCursorTileX() {
    if (CycloneMapEditor.currentTool === 'rectangle' || CycloneMapEditor.currentTool === 'eraser' || CycloneMapEditor.isRightButtonDown) {
      if (CycloneMapEditor.rectangleWidth > 0) {
        return CycloneMapEditor.rectangleStartX;
      }
      if (CycloneMapEditor.rectangleBackWidth > 0) {
        return CycloneMapEditor.rectangleStartX - CycloneMapEditor.rectangleBackWidth;
      }
    }

    if (SceneManager._scene._mapEditorWindow) {
      if (TouchInput.x >= SceneManager._scene._mapEditorWindow.x) {
        return $gameMap.canvasToMapX(SceneManager._scene._mapEditorWindow.x);
      }
    }

    return $gameMap.canvasToMapX(TouchInput.x);
  }

  getCursorTileY() {
    if (CycloneMapEditor.currentTool === 'rectangle' || CycloneMapEditor.currentTool === 'eraser' || CycloneMapEditor.isRightButtonDown) {
      if (CycloneMapEditor.rectangleHeight > 0) {
        return CycloneMapEditor.rectangleStartY;
      }
      if (CycloneMapEditor.rectangleBackHeight > 0) {
        return CycloneMapEditor.rectangleStartY - CycloneMapEditor.rectangleBackHeight;
      }
    }

    return $gameMap.canvasToMapY(TouchInput.y);
  }

  updatePosition() {
    if (!CycloneMapEditor.active) {
      return;
    }

    const tileX = this.getCursorTileX();
    const tileY = this.getCursorTileY();

    this.x = Math.floor($gameMap.adjustX(tileX) * CycloneMapEditor.tileWidth);
    this.y = Math.floor($gameMap.adjustY(tileY) * CycloneMapEditor.tileHeight);
  }
}

export {
  SpriteMapEditorCursor,
};
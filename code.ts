figma.showUI(__html__);
figma.ui.resize(320, 204);

figma.ui.onmessage = async (pluginMessage) => {
  if (pluginMessage.type === "align") {
    await align(
      parseInt(pluginMessage.spacing),
      parseInt(pluginMessage.direction)
    );
  }
};

async function align(spacing: number, direction: number) {
  let selection = figma.currentPage.selection;
  let selecionLength = figma.currentPage.selection.length;
  let clone: any[] = [];
  let map: any[] = [];
  let startX: number = 0;
  let startY: number = 0;

  if (Number.isNaN(spacing)) {
    figma.notify("Spacing must be a number");
  }
  else {
    if (selecionLength == 0) {
      figma.notify("Select items to allign");
    }
    else {
      createClone();
      figma.ui.postMessage({ type: "sort", array: clone });
      clone = await new Promise((resolve) => {
        figma.ui.once("message", (msg) => {
          resolve(msg.array);
        });
      });
      createMap();
      findStart();
      if (direction == 1) {
        setPositionX();
      }
      else {
        setPositionY();
      }
      figma.closePlugin("Now it's alligned");
    }
  }

  function createClone() {
    for (var i = 0; i < selecionLength; i++) {
      clone[i] = selection[i].name;
    }
  }

  function createMap() {
    for (var i = 0; i < selecionLength; i++) {
      for (var j = 0; j < selecionLength; j++) {
        if (selection[i].name == clone[j]) {
          map[i] = j;
        }
      }
    }
  }

  function findStart() {
    startX = selection[0].x;
    startY = selection[0].y;
    for (var i = 0; i < selecionLength; i++) {
      if (selection[i].x < startX) startX = selection[i].x;
      if (selection[i].y < startY) startY = selection[i].y;
    }
  }

  function setPositionX() {
    for (var positionNumber = 0; positionNumber < selecionLength; positionNumber++) {
      for (var mapNumber = 0; mapNumber < selecionLength; mapNumber++) {
        if (positionNumber == map[mapNumber]) {
          selection[mapNumber].x = startX;
          selection[mapNumber].y = startY;
          startX = startX + selection[mapNumber].width + spacing;
        }
      }
    }
  }

  function setPositionY() {
    for (var positionNumber = 0; positionNumber < selecionLength; positionNumber++) {
      for (var mapNumber = 0; mapNumber < selecionLength; mapNumber++) {
        if (positionNumber == map[mapNumber]) {
          selection[mapNumber].x = startX;
          selection[mapNumber].y = startY;
          startY = startY + selection[mapNumber].height + spacing;
        }
      }
    }
  }
}

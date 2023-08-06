"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__);
figma.ui.resize(320, 204);
figma.ui.onmessage = (pluginMessage) => __awaiter(void 0, void 0, void 0, function* () {
    if (pluginMessage.type === "align") {
        yield align(parseInt(pluginMessage.spacing), parseInt(pluginMessage.direction));
    }
});
function align(spacing, direction) {
    return __awaiter(this, void 0, void 0, function* () {
        let selection = figma.currentPage.selection;
        let selecionLength = figma.currentPage.selection.length;
        let clone = [];
        let map = [];
        let startX = 0;
        let startY = 0;
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
                clone = yield new Promise((resolve) => {
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
                if (selection[i].x < startX)
                    startX = selection[i].x;
                if (selection[i].y < startY)
                    startY = selection[i].y;
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
    });
}

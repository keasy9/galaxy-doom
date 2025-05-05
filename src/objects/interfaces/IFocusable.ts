import {GuiElement} from "../gui/GuiElement.ts";

export interface IFocusable extends GuiElement {
    focus(): this;
    blur(): this;
}
import {Scene} from "phaser";
import {IFocusable} from "../../objects/interfaces/IFocusable.ts";
import KeyCodes = Phaser.Input.Keyboard.KeyCodes;
import {GuiElement} from "../../objects/gui/GuiElement.ts";

enum ElementSearchDirection {
    up = 'up',
    down = 'down',
}

export class GuiManager {
    protected static scene: Scene;
    protected static focusables: IFocusable[] = [];
    protected static currentFocused?: number;

    public static init(scene: Scene) {
        this.scene = scene;

        if (scene.input?.keyboard) {
            scene.input.keyboard.addKey(KeyCodes.W)?.on('down', () => this.onKeyDown(KeyCodes.W));
            scene.input.keyboard.addKey(KeyCodes.UP)?.on('down', () => this.onKeyDown(KeyCodes.UP));
            scene.input.keyboard.addKey(KeyCodes.S)?.on('down', () => this.onKeyDown(KeyCodes.S));
            scene.input.keyboard.addKey(KeyCodes.DOWN)?.on('down', () => this.onKeyDown(KeyCodes.DOWN));
        }
    }

    public static addFocusable(element: IFocusable) {
        this.focusables.push(element);
        this.focusables.sort((a, b) => {
            return a.getWorldTransformMatrix().getY(a.x, a.y) - b.getWorldTransformMatrix().getY(a.x, a.y);
        });
    }

    protected static onKeyDown(key: typeof KeyCodes[keyof typeof KeyCodes]) {
        if (this.focusables.length <= 1) return null; // нет элементов, или он один

        if (this.currentFocused === undefined) {
            // текущего элемента нет, выбираем первый
            this.focus(this.focusables[0]);
            return;
        }

        const keysToDirections: Record<typeof KeyCodes[keyof typeof KeyCodes], ElementSearchDirection> = {
            [KeyCodes.W]: ElementSearchDirection.up,
            [KeyCodes.UP]: ElementSearchDirection.up,
            [KeyCodes.S]: ElementSearchDirection.down,
            [KeyCodes.DOWN]: ElementSearchDirection.down,
        }

        if (keysToDirections[key] === ElementSearchDirection.up) {
            // ищем вверх
            if (this.currentFocused === 0) this.focus(this.focusables[this.focusables.length-1])
            else this.focus(this.focusables[this.currentFocused - 1])
        } else {
            // ищем вниз
            if (this.currentFocused >= this.focusables.length - 1) this.focus(this.focusables[0])
            else this.focus(this.focusables[this.currentFocused + 1])
        }
    }

    public static focus(element: IFocusable) {
        if (this.currentFocused !== undefined) {
            if (this.focusables[this.currentFocused] === element) return;

            this.focusables[this.currentFocused].blur();
            delete this.currentFocused;
        }

        const index: number = this.focusables.indexOf(element);
        if (index !== -1) {
            element.focus();
            this.currentFocused = index;
        }
    }

    public static removeFocusable(element: IFocusable) {
        const index = this.focusables.indexOf(element);
        if (index !== -1) this.focusables.splice(index, 1);
    }

    public static flickerEffect(element: GuiElement): void {
        this.scene.time.addEvent({
            delay: 20,
            callback: () => {
                // 70% шанс
                if (Math.random() > 0.3 && element.visible) {
                    element.setAlpha(Phaser.Math.RND.pick([0.8, 0.85]));
                }
            },
            loop: true
        });
    }
}

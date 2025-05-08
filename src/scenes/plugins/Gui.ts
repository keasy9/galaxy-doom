import {Scene} from "phaser";
import {IFocusable} from "../../objects/interfaces/IFocusable.ts";
import KeyCodes = Phaser.Input.Keyboard.KeyCodes;
import {GuiElement} from "../../objects/gui/GuiElement.ts";
import PluginManager = Phaser.Plugins.PluginManager;
import {GuiFactory} from "../../utils/factories/GuiFactory.ts";
import ScenePlugin = Phaser.Plugins.ScenePlugin;

enum ElementSearchDirection {
    up = 'up',
    down = 'down',
}

export class Gui extends ScenePlugin {
    protected focusables: IFocusable[] = [];
    protected currentFocused?: number;
    public readonly factory: GuiFactory;

    constructor(protected scene: Scene, pluginManager: PluginManager, pluginKey: string) {
        super(scene, pluginManager, pluginKey);

        this.factory = new GuiFactory(this.scene);

        if (this.scene.input?.keyboard) {
            this.scene.input.keyboard.addKey(KeyCodes.W)?.on('down', () => this.onKeyDown(KeyCodes.W));
            this.scene.input.keyboard.addKey(KeyCodes.UP)?.on('down', () => this.onKeyDown(KeyCodes.UP));
            this.scene.input.keyboard.addKey(KeyCodes.S)?.on('down', () => this.onKeyDown(KeyCodes.S));
            this.scene.input.keyboard.addKey(KeyCodes.DOWN)?.on('down', () => this.onKeyDown(KeyCodes.DOWN));
        }
    }

    protected onKeyDown(key: typeof KeyCodes[keyof typeof KeyCodes]) {
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

    public addFocusable(element: IFocusable) {
        this.focusables.push(element);
        this.focusables.sort((a, b) => {
            return a.getWorldTransformMatrix().getY(a.x, a.y) - b.getWorldTransformMatrix().getY(a.x, a.y);
        });
    }

    public removeFocusable(element: IFocusable): this {
        const index = this.focusables.indexOf(element);
        if (index !== -1) this.focusables.splice(index, 1);

        return this;
    }

    public focus(element: IFocusable): this {
        if (this.currentFocused !== undefined) {
            if (this.focusables[this.currentFocused] === element) return this;

            this.focusables[this.currentFocused].blur();
            delete this.currentFocused;
        }

        const index: number = this.focusables.indexOf(element);
        if (index !== -1) {
            element.focus();
            this.currentFocused = index;
        }

        return this;
    }

    public flickerEffect(element: GuiElement): this {
        const baseAlpha = element.alpha;
        this.scene.time.addEvent({
            delay: 20,
            callback: () => {
                // 70% шанс
                if (element.visible && Math.random() > 0.3) {
                    element.setAlpha(baseAlpha - Phaser.Math.RND.pick([0.2, 0.25]));
                }
            },
            loop: true
        });

        return this;
    }

    public destroy(): void {
        this.focusables = [];
        delete this.currentFocused;

        return super.destroy();
    }
}

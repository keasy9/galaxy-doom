declare module 'phaser' {
    import {Gui} from "./scenes/plugins/Gui.ts";

    interface Scene {
        gui: Gui;
    }
}
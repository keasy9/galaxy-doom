declare module 'phaser' {
    import {Gui} from "./scenes/plugins/Gui.ts";
    import {Collisions} from "./scenes/plugins/Collisions.ts";

    interface Scene {
        gui: Gui;
        collisions: Collisions;
    }
}
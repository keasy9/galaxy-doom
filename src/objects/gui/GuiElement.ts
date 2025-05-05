import Container = Phaser.GameObjects.Container;

export abstract class GuiElement extends Container {
    public canFocus: boolean = true;
}
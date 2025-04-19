export interface IRecyclable extends Phaser.GameObjects.GameObject {
    recycle(...args: any[]): IRecyclable;
}
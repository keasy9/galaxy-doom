import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;

export function camera() {
    return {
        isVisible(object: Container | Sprite): boolean {
            return object.visible
                && object.alpha > 0
                && Phaser.Geom.Rectangle.Overlaps(object.getBounds(), object.scene.cameras.main.worldView)
        }
    };
}
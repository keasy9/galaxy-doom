import {Scene} from "phaser";
import {Font, FontSize, GuiManager} from "../utils/managers/GuiManager.ts";
import {Progressbar} from "../objects/gui/Progressbar.ts";
import BitmapText = Phaser.GameObjects.BitmapText;
import {Sound, SoundManager} from "../utils/managers/SoundManager.ts";

export const P_ASSETS = '/assets/';
export const P_SPRITES = P_ASSETS + 'sprites/';
export const P_TEXTURES = P_ASSETS + 'textures/';
export const P_DATA = P_ASSETS + 'data/';
export const P_LEVELS = P_DATA + 'levels/';
export const P_FONTS = P_ASSETS + 'fonts/';
export const P_AUDIO = P_ASSETS + 'audio/';
export const P_SOUNDS = P_AUDIO + 'sounds/';

export class Boot extends Scene {
    protected progressBar?: Progressbar;
    protected progressText?: BitmapText;

    protected progress: number = 0;

    protected currentTextPartIndex = 0;
    protected currentTextPart: BitmapText;
    protected previousTextPart: BitmapText;
    protected textOffset = 20;
    protected textParts = [
        'with phaser',
        'by keasy9  ',
        'for fun    ',
    ];
    protected soundParts = [
        Sound.sfx_intro_coin,
        Sound.sfx_intro_power,
        Sound.sfx_intro_rainbow,
    ];

    constructor(key: string = 'boot') {
        super(key);

        GuiManager.init(this);
        SoundManager.init(this);
    }

    preload() {
        // cоздаём прогрессбар
        this.createProgressbar();

        // загружаем ассеты
        this.load.bitmapFont(Font.main, P_FONTS + 'press-start-2p.png', P_FONTS + 'press-start-2p.xml');
        this.load.audio(Sound.sfx_intro_coin, P_SOUNDS + 'coin.mp3');
        this.load.audio(Sound.sfx_intro_power, P_SOUNDS + 'power.mp3');
        this.load.audio(Sound.sfx_intro_rainbow, P_SOUNDS + 'rainbow.mp3');
        this.load.audio('todo_remove', P_SOUNDS + 'remove.mp3');
        this.load.audio('todo_remove2', P_SOUNDS + 'remove2.mp3');

        // обновляем прогрессбар при загрузке
        this.load.on('progress', this.updateProgressbar.bind(this));

        this.load.on('filecomplete-bitmapfont-' + Font.main, () => {
            // когда шрифт загрузился - пишем проценты
            this.progressText = GuiManager.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                `${Math.round(this.progress * 100)}%`,
                FontSize.medium,
            );
        }, this);
    }

    create() {
        this.progressBar?.destroy();
        this.progressText?.destroy();
        delete this.progressBar;
        delete this.progressText;

        // любое действие пропускает анимацию
        this.input.on('pointerdown', this.nextScene.bind(this));
        this.input.on('keydown', this.nextScene.bind(this));

        const made = GuiManager.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'made ',
            FontSize.medium,
        );

        this.currentTextPart = GuiManager.text(
            this.cameras.main.centerX + made.width/2,
            this.cameras.main.centerY,
            this.textParts[0],
            FontSize.medium,
        ).setAlpha(0);

        this.previousTextPart = GuiManager.text(
            this.cameras.main.centerX + made.width/2,
            this.cameras.main.centerY - this.textOffset,
            '',
            FontSize.medium,
        ).setAlpha(0);

        this.tweens.add({
            targets: this.progressBar,
            alpha: 0,
            duration: 100,
            onComplete: () => {
                this.time.addEvent({
                    delay: 200,
                    callback: () => {
                        // начинаем анимацию
                        this.tweens.add({
                            targets: made,
                            x: `-=${this.currentTextPart.width/2}`,
                            duration: 1000,
                            ease: 'Cubic',
                            onComplete: this.showNextTextPart.bind(this),
                        });
                    }
                });
            }
        });
    }

    protected createProgressbar() {
        this.progressBar = GuiManager.progressbar(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            0x2692f0,
            0x91bccf,
        );
    }

    protected updateProgressbar(value: number) {
        this.progressBar?.setProgress(value);

        if (this.progressText) {
            // обновляем текст, если он есть
            this.progressText.setText(`${Math.round(value * 100)}%`);
        } else {
            this.progress = value;
        }
    }

    protected nextScene() {
        this.scene.start('menu');
    }

    protected showNextTextPart() {
        if (this.currentTextPartIndex >= this.textParts.length) {
            // если прошли все части, переходим к следующей сцене
            SoundManager.stopAll(2000);
            this.time.delayedCall(2000, this.nextScene.bind(this));
            return;

        } else if (this.currentTextPartIndex === this.textParts.length - 1) {
            // последняя часть переливается радугой
            this.tweens.addCounter({
                from: 0,
                to: 360,
                duration: 5000,
                repeat: -1,
                onUpdate: tween => {
                    const value = tween.getValue();
                    // преобразуем HSV в RGB (hue меняется от 0 до 360)
                    const color = Phaser.Display.Color.HSLToColor(value / 360, 1, 0.5);
                    this.currentTextPart.setTint(color.color);
                }
            });
            SoundManager.setRate(0.5);
        }

        this.currentTextPart.setText(this.textParts[this.currentTextPartIndex]).setAlpha(0);
        this.currentTextPart.y += this.textOffset;

        if (this.soundParts[this.currentTextPartIndex]) {
            SoundManager.play(this.soundParts[this.currentTextPartIndex]);
        }

        this.tweens.add({
            targets: this.currentTextPart,
            alpha: 1,
            y: `-=${this.textOffset}`,
            duration: 900,
            ease: 'Power2',
            onComplete: this.showNextTextPart.bind(this),
        });

        this.previousTextPart.setText(this.textParts[this.currentTextPartIndex-1] ?? '').setAlpha(1);
        this.previousTextPart.y += this.textOffset;

        this.tweens.add({
            targets: this.previousTextPart,
            alpha: 0,
            y: `-=${this.textOffset}`,
            duration: 800,
            ease: 'Power2',
            onComplete: () => this.previousTextPart.setText(this.textParts[this.currentTextPartIndex - 1]),
        });

        this.currentTextPartIndex++;
    }
}
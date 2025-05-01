import {Scene} from "phaser";
import {GuiColor, Font, FontSize, GuiFactory} from "../utils/factories/GuiFactory.ts";
import {Progressbar} from "../objects/gui/Progressbar.ts";
import BitmapText = Phaser.GameObjects.BitmapText;
import {Sound, SoundManager} from "../utils/managers/SoundManager.ts";
import {TEXTURE_MENU_BG} from "./Home.ts";
import {Translator} from "../utils/managers/Translator.ts";
import {Button} from "../objects/gui/Button.ts";

export const P_ASSETS = '/assets/';
export const P_SPRITES = P_ASSETS + 'sprites/';
export const P_TEXTURES = P_ASSETS + 'textures/';
export const P_DATA = P_ASSETS + 'data/';
export const P_LEVELS = P_DATA + 'levels/';
export const P_FONTS = P_ASSETS + 'fonts/';
export const P_AUDIO = P_ASSETS + 'audio/';
export const P_SOUNDS = P_AUDIO + 'sounds/';
export const P_LANGS = P_DATA + 'langs/';

export class Boot extends Scene {
    protected progressBar?: Progressbar;

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

        GuiFactory.init(this);
        SoundManager.init(this);
    }

    preload() {
        // cоздаём прогрессбар
        this.progressBar = GuiFactory.progressbar({
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            color: GuiColor.blue,
            bgColor: GuiColor.grayBlue,
        });


        // шрифт
        this.load.bitmapFont(Font.main, `${P_FONTS}press-start-2p.png`, `${P_FONTS}press-start-2p.xml`);

        // звуки для интро
        this.load.audio(Sound.sfx_intro_coin, `${P_SOUNDS}coin.mp3`);
        this.load.audio(Sound.sfx_intro_power, `${P_SOUNDS}power.mp3`);
        this.load.audio(Sound.sfx_intro_rainbow, `${P_SOUNDS}rainbow.mp3`);

        // фон главного меню
        this.load.image(TEXTURE_MENU_BG, `${P_TEXTURES}menu_bg.png`);

        // текущий язык + запасной
        this.load.json(`lang-${Translator.current}`, `${P_LANGS}${Translator.current}.json`);
        if (Translator.current !== Translator.fallback) {
            this.load.json(`lang-${Translator.fallback}`, `${P_LANGS}${Translator.fallback}.json`);
        }

        // обновляем прогрессбар при загрузке
        this.load.on('progress', (value: number) => this.progressBar?.setProgress(value));

        this.load.on(`filecomplete-bitmapfont-${Font.main}`, () => {
            // когда шрифт загрузился - пишем проценты
            this.progressBar?.printProgress(FontSize.medium);
        }, this);
    }

    create() {
        this.progressBar?.destroy();
        delete this.progressBar;

        // любое действие пропускает анимацию
        this.input.on('pointerdown', this.nextScene.bind(this));
        this.input.on('keydown', this.nextScene.bind(this));

        const made = GuiFactory.text({
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            text: 'made ',
            fontSize: FontSize.medium,
        });

        this.currentTextPart = GuiFactory.text({
            x: this.cameras.main.centerX + made.width / 2,
            y: this.cameras.main.centerY,
            text: this.textParts[0],
            fontSize: FontSize.medium,
        }).setAlpha(0);

        this.previousTextPart = GuiFactory.text({
            x: this.cameras.main.centerX + made.width / 2,
            y: this.cameras.main.centerY - this.textOffset,
            fontSize: FontSize.medium,
        }).setAlpha(0);

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
                            x: `-=${this.currentTextPart.width / 2}`,
                            duration: 1000,
                            ease: 'Cubic',
                            onComplete: this.showNextTextPart.bind(this),
                        });
                    },
                });
            }
        });
    }

    protected nextScene(transition: number = 200) {
        // Сохраняем ссылку на текущую сцену
        const currentScene = this;

        // Останавливаем все звуки с плавным затуханием
        SoundManager.stopAll(transition - 100);

        // Запускаем fadeOut и сразу подписываемся на событие завершения
        this.cameras.main.once('camerafadeoutcomplete', () => {
            currentScene.scene.start('menu');
            currentScene.scene.get('menu').cameras.main.fadeIn(100);
        });

        this.cameras.main.fadeOut(transition - 100);
    }

    protected showNextTextPart() {
        if (this.currentTextPartIndex >= this.textParts.length) {
            // если прошли все части, переходим к следующей сцене
            this.nextScene(2000);
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

        this.previousTextPart.setText(this.textParts[this.currentTextPartIndex - 1] ?? '').setAlpha(1);
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
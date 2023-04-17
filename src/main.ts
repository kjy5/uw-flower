import '../styles/style.css'
import {Application, Graphics} from "pixi.js";
import {
    BLUE_COLOR,
    CENTER_RADIUS,
    CENTER_X,
    CENTER_Y,
    GRAPHIC_HEIGHT,
    GREEN_COLOR,
    LIGHT_RED_COLOR,
    PETAL_HEIGHT,
    PETAL_WIDTH,
    PURPLE_COLOR,
    RED_COLOR,
    STEM_WIDTH,
    WIDTH
} from "./constants";

// Properties
let healthLevel = .5;


// Create app
let app = new Application<HTMLCanvasElement>({
    width: WIDTH,
    height: GRAPHIC_HEIGHT,
    backgroundColor: 0xffffff
});
document.getElementById('graphics')?.appendChild(app.view);

// Create health bar
let healthBar = new Graphics();
healthBar.beginFill(BLUE_COLOR);
healthBar.drawRect(0, 0, window.innerWidth * healthLevel, 30);

// Create stem
let stem = new Graphics();
stem.beginFill(GREEN_COLOR);
stem.drawRect(CENTER_X - STEM_WIDTH / 2, CENTER_Y, STEM_WIDTH, window.innerHeight);

// Create flower center
let flowerCenter = new Graphics();
flowerCenter.beginFill(RED_COLOR);
flowerCenter.drawCircle(CENTER_X, CENTER_Y, CENTER_RADIUS);

// Create petals
let underPetals: Graphics[] = [];
let overPetals: Graphics[] = [];
for (let i = 0; i < 10; i++) {
    // Setup look
    let petal = new Graphics();
    petal.beginFill(i< 5 ? PURPLE_COLOR : LIGHT_RED_COLOR);
    petal.pivot.set(0, -PETAL_HEIGHT);
    petal.position.set(CENTER_X, CENTER_Y);
    petal.drawEllipse(0, 0, PETAL_WIDTH, PETAL_HEIGHT);
    petal.rotation = i * Math.PI / 2.5 + Math.PI;

    // Split between over and under petals
    if (i < 5) {
        // Add interaction to over petal
        petal.eventMode = 'static';
        petal.on('pointerdown', () => {
            healthLevel -= .01;
        });

        overPetals.push(petal);
    } else {
        petal.beginFill(LIGHT_RED_COLOR);
        underPetals.push(petal);
    }
}


// Create elements to stage
app.stage.addChild(healthBar);
app.stage.addChild(stem);
underPetals.forEach(petal => app.stage.addChild(petal));
overPetals.forEach(petal => app.stage.addChild(petal));
app.stage.addChild(flowerCenter);

// Set update loop
app.ticker.add(() => {
    // Update health bar
    healthBar.width = window.innerWidth * healthLevel;
    overPetals.forEach(petal => petal.alpha = healthLevel);
});

document.getElementById('water')?.addEventListener('click', () => {
    healthLevel += .01;
    healthLevel = Math.min(1, healthLevel);
});
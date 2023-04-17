import '../styles/style.css'
import {Application, Graphics} from "pixi.js";
import {BLUE_COLOR, GREEN_COLOR, PURPLE_COLOR, RED_COLOR} from "./constants";


// Create app
let app = new Application<HTMLCanvasElement>({
    width: window.innerWidth,
    height: window.innerHeight * .7,
    backgroundColor: 0xffffff
});
document.getElementById('graphics')?.appendChild(app.view);

// Create health bar
let healthLevel = .5;
let healthBar = new Graphics();
healthBar.beginFill(BLUE_COLOR);
healthBar.drawRect(0, 0, window.innerWidth * healthLevel, 30);

// Dimentions and locations
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight * .3;

// Create stem
const stemWidth = 30;
let stem = new Graphics();
stem.beginFill(GREEN_COLOR);
stem.drawRect(centerX - stemWidth / 2, centerY, stemWidth, window.innerHeight);

// Create flower center
const centerRadius = 50;
let flowerCenter = new Graphics();
flowerCenter.beginFill(RED_COLOR);
flowerCenter.drawCircle(centerX, centerY, centerRadius);

// Create petals
const petalWidth = 60;
const petalHeight = 90;
let petals: Graphics[] = [];
for (let i = 0; i < 5; i++) {
    let petal = new Graphics();
    petal.beginFill(PURPLE_COLOR);
    petal.pivot.set(0, -petalHeight);
    petal.position.set(centerX, centerY);
    petal.drawEllipse(0, 0, petalWidth, petalHeight);
    petal.rotation = i * Math.PI / 2.5 + Math.PI;

    petals.push(petal);
}


// Create elements to stage
app.stage.addChild(healthBar);
app.stage.addChild(stem);
petals.forEach(petal => app.stage.addChild(petal));
app.stage.addChild(flowerCenter);

// Set update loop
// let elapsed = 0;
// app.ticker.add((delta) => {
//     elapsed += delta;
// });
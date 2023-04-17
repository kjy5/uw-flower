import './style.css'
import typescriptLogo from './typescript.svg'
import {Application, Sprite} from "pixi.js";

// Create app
let app = new Application<HTMLCanvasElement>({width: window.innerWidth, height: window.innerHeight, backgroundColor: 0xffffff});
document.getElementById('app')?.appendChild(app.view);

// Create Sprite
let sprite = Sprite.from(typescriptLogo);
app.stage.addChild(sprite);

// Set update loop
let elapsed = 0;
app.ticker.add((delta) => {
    elapsed += delta;
    sprite.x = 100 + Math.cos(elapsed / 50) * 100;
});
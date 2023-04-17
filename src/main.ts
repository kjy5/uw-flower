import '../styles/style.css'
import {Application, Graphics} from "pixi.js";
import {
    CENTER_RADIUS,
    CENTER_X,
    CENTER_Y,
    GRAPHIC_HEIGHT,
    GREEN_COLOR,
    LIGHT_BLUE_COLOR,
    LIGHT_RED_COLOR,
    PETAL_HEIGHT,
    PETAL_WIDTH,
    PROJECT_URL,
    PUBLIC_KEY,
    PURPLE_COLOR,
    RED_COLOR,
    STEM_WIDTH,
    WHITE_COLOR,
    WIDTH
} from "./constants";
import {createClient} from "@supabase/supabase-js";

// Properties
let healthLevel = .5;

// Setup Supabase connection
const supabase = createClient(PROJECT_URL, PUBLIC_KEY);

// Initialize health
supabase.from('Flowers').select('health').eq('name', 'Quad').then(({data, error}) => {
    if (error || !data) {
        console.error(error);
    } else {
        healthLevel = data[0].health;
    }
});

// Subscribe to health updates
supabase.channel('any').on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'Flowers',
    filter: 'name=eq.Quad'
}, (payload) => {
    healthLevel = payload.new.health;
    updateHealth(true);
    console.log("Updating health to: " + healthLevel);
}).subscribe()


// Create app
let app = new Application<HTMLCanvasElement>({
    width: WIDTH,
    height: GRAPHIC_HEIGHT,
    backgroundColor: WHITE_COLOR
});
document.getElementById('graphics')?.appendChild(app.view);

// Create health bar
let healthBar = new Graphics();
healthBar.beginFill(WHITE_COLOR);
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
    petal.beginFill(i < 5 ? PURPLE_COLOR : LIGHT_RED_COLOR);
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
            updateHealth();
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
    if (healthLevel < .25) {
        healthBar.tint = LIGHT_RED_COLOR;
    } else if (healthLevel < .5) {
        healthBar.tint = RED_COLOR;
    } else if (healthLevel < .75) {
        healthBar.tint = LIGHT_BLUE_COLOR;
    } else {
        healthBar.tint = GREEN_COLOR;
    }

    // Update petal alpha
    overPetals.forEach(petal => petal.alpha = healthLevel);
});

// Health functions
function updateHealth(fromServer: boolean = false) {
    healthLevel = Math.max(0, Math.min(1, healthLevel));

    if (!fromServer) {
        // Update database
        supabase.from('Flowers').update({health: healthLevel}).eq('name', 'Quad').then((result) => {
            if (result.error) {
                console.error(result.error);
            }
        });
    }
}

// Add button actions
document.getElementById('water')?.addEventListener('click', () => {
    healthLevel += .01;
    updateHealth();
});

document.getElementById('fire')?.addEventListener('click', () => {
    healthLevel -= .01;
    updateHealth();
});
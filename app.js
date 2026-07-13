
// ==========================
// CLOCK (HEADER)
// ==========================

function updateTime() {
    const timeEl = document.getElementById("liveTime");
    if (timeEl) {
        const now = new Date();
        timeEl.innerText = now.toLocaleTimeString();
    }
}

setInterval(updateTime, 1000);
updateTime();


// ==========================
// ELEMENTS (MATCH YOUR HTML)
// ==========================

const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

const responseBox = document.getElementById("response");
const transcriptBox = document.getElementById("transcript");
const statusBox = document.getElementById("status");

const voiceBtn = document.getElementById("voiceBtn");

const conversationLog = document.getElementById("conversationLog");


// ==========================
// COMMAND ENGINE (CLEAN)
// ==========================

function handleCommand(command) {
    command = command.toLowerCase().trim();

    let reply = "";

    // ==========================
    // OPEN WEBSITES (FIRST - IMPORTANT)
    // ==========================
    if (command.startsWith("open ")) {

    const raw = command.replace("open", "").trim().toLowerCase();

    const websites = {
        youtube: "https://youtube.com",
        spotify: "https://open.spotify.com",
        github: "https://github.com",
        netflix: "https://netflix.com",
        google: "https://google.com",
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        amazon: "https://amazon.com"
    };

    let site = "";

    // ==========================
    // SMART MATCHING (KEY FIX)
    // ==========================
    for (let key in websites) {
        if (raw.includes(key)) {
            site = key;
            break;
        }
    }

    if (site) {
        window.open(websites[site], "_blank");
        reply = "Opening " + site;
    } else {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(raw)}`, "_blank");
        reply = "Searching for " + raw;
    }
}

    // ==========================
    // SEARCH COMMAND
    // ==========================
    else if (command.startsWith("search ")) {
        const query = command.replace("search", "").trim();
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
        reply = "Searching Google for " + query;
    }
else if (
    command.includes("world update") ||
    command.includes("update me") ||
    command.includes("what's going on in the world") ||
    command.includes("whats going on in the world") ||
    command.includes("latest world news")
) {

    window.open(
        "https://www.worldmonitor.app/dashboard?lat=20.1067&lon=0.0000&zoom=1.50&view=global&timeRange=7d&layers=conflicts,bases,hotspots,nuclear,irradiators,sanctions,weather,economic,waterways,outages,military,natural",
        "_blank"
    );

    reply = "Opening World Monitor Database . As you can see , This is the live global situation in real time. let me know how I can help  you master ";
}
    // ==========================
    // BASIC COMMANDS
    // ==========================
    else if (command.includes("hello")) {
        reply = "Hello User.";
    }
    else if (command.includes("time")) {
        reply = "Current time is " + new Date().toLocaleTimeString();
    }
    else if (command.includes("name")) {
        reply = "I am JARVIS.";
    }

    // ==========================
    // DEFAULT
    // ==========================
    else {
        reply = "Command not recognized.";
    }

    responseBox.innerText = reply;
    speak(reply);
}


// ==========================
// CHAT INPUT BUTTON
// ==========================

if (sendBtn && chatInput) {
    sendBtn.addEventListener("click", () => {
        const text = chatInput.value.trim();
        if (!text) return;

        handleCommand(text);
        chatInput.value = "";
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendBtn.click();
        }
    });
}


// ==========================
// VOICE BUTTON (SAFE BASIC)
// ==========================

if (voiceBtn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = "en-US";

        voiceBtn.addEventListener("click", () => {
            recognition.start();
            if (statusBox) statusBox.innerText = "Listening...";
        });

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;

            if (transcriptBox) transcriptBox.innerText = text;

            handleCommand(text);
        };

        recognition.onend = () => {
            if (statusBox) statusBox.innerText = "Ready";
        };

        recognition.onerror = () => {
            if (statusBox) statusBox.innerText = "Voice error";
        };
    } else {
        voiceBtn.addEventListener("click", () => {
            alert("Speech Recognition not supported in this browser");
        });
    }
}
function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);

    // ==========================
    // IRON MAN STYLE SETTINGS
    // ==========================
    speech.volume = 1;
    speech.rate = 0.95;   // slightly slower = more robotic
    speech.pitch = 0.6;   // lower pitch = deeper Jarvis tone

    const voices = window.speechSynthesis.getVoices();

    // Try to pick a deep male / Google UK / Microsoft voice
    speech.voice =
        voices.find(v =>
            v.name.includes("Google UK English Male") ||
            v.name.includes("Microsoft David") ||
            v.name.includes("Daniel") ||
            v.name.toLowerCase().includes("male")
        ) || voices[0];

    window.speechSynthesis.speak(speech);
}
window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
};
function speak(text, mode = "normal") {
    const speech = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();

    speech.voice = voices[0];

    if (mode === "alert") {
        speech.rate = 1.1;
        speech.pitch = 0.9;
    }
    else if (mode === "calm") {
        speech.rate = 0.9;
        speech.pitch = 0.6;
    }
    else {
        speech.rate = 0.95;
        speech.pitch = 0.7;
    }

    window.speechSynthesis.speak(speech);
}

// ========================================================
// THE ONLY GLOBE ENGINE (DELETE ALL OLD VERSIONS)
// ========================================================
const globeCanvas = document.getElementById('globeCanvas');

function drawGlobe() {
    if (!globeCanvas) return;
    const ctx = globeCanvas.getContext('2d');
    const cx = globeCanvas.width / 2;
    const cy = globeCanvas.height / 2;
    const radius = 140;
    
    // Clear the canvas
    ctx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);
    
    // Draw simple wireframe sphere
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Loop
    requestAnimationFrame(drawGlobe);
}
drawGlobe();
const perfCanvas = document.getElementById('performanceGridCanvas');
if (perfCanvas) {
    const ctx = perfCanvas.getContext('2d');
    let tick = 0;

    function drawPerformanceGraph() {
        ctx.clearRect(0, 0, perfCanvas.width, perfCanvas.height);
        tick++;

        // Draw Sci-Fi Vector Grid Backdrop
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
        ctx.lineWidth = 1;
        for(let x=0; x<perfCanvas.width; x+=25) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, perfCanvas.height); ctx.stroke();
        }
        for(let y=0; y<perfCanvas.height; y+=25) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(perfCanvas.width, y); ctx.stroke();
        }

        // Line Rendering Engine for Channel Arrays
        function drawChannelLine(offset, color, speed) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for(let x = 0; x < perfCanvas.width; x++) {
                let y = (perfCanvas.height / 2) + 
                        Math.sin((x + tick) * speed) * 15 * Math.cos((x - tick)*0.005) + offset;
                if(x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        drawChannelLine(-15, '#c84cff', 0.02); // Purple Channel (Memory)
        drawChannelLine(10, '#00e5ff', 0.035); // Cyan Channel (CPU)
        drawChannelLine(30, '#00ff9d', 0.015); // Green Channel (Network)

        requestAnimationFrame(drawPerformanceGraph);
    }
    drawPerformanceGraph();
}

// ========================================================
// SYSTEM TELEMETRY SPARK & VOICE ACTIVITY CANVAS
// ========================================================
function runWaveforms(canvasId, color, variance) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let seed = 0;

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        seed += 0.1;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for(let x=0; x<canvas.width; x+=4) {
            let h = Math.abs(Math.sin(x*0.05 + seed) * Math.cos(x*0.02 - seed)) * canvas.height * variance;
            ctx.moveTo(x, canvas.height/2 - h/2);
            ctx.lineTo(x, canvas.height/2 + h/2);
        }
        ctx.stroke();
        requestAnimationFrame(render);
    }
    render();
}

runWaveforms('voiceWaveformCanvas', '#c84cff', 0.8);
runWaveforms('telemetrySparkCanvas', '#00e5ff', 0.5);

// ========================================================
// QUICK ACTIONS - BUTTON MATRIX LOGIC
// ========================================================
const missionButtons = document.querySelectorAll('.mission-btn');

missionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Find the label text inside the clicked button
        const labelElement = btn.querySelector('.btn-lbl');
        if (!labelElement) return; 
        
        const command = labelElement.innerText.trim();

        // Add a quick visual flash to the button when clicked
        btn.style.transform = "scale(0.95)";
        btn.style.borderColor = "#c84cff"; // Flashes purple
        setTimeout(() => {
            btn.style.transform = "scale(1)";
            btn.style.borderColor = "rgba(0, 229, 255, 0.2)";
        }, 150);

        // Execute action based on which button was clicked
        switch(command) {
            case 'VOICE CMD':
                // Already handled by your existing voiceBtn logic, 
                // but we can add a visual confirmation!
                console.log("Microphone activated.");
                break;
                
            case 'BROWSER':
                speak("Opening secure browser, sir.");
                window.open('https://www.google.com', '_blank');
                break;
                
            case 'MEMORY':
                speak("Accessing memory databanks.");
                alert("SYSTEM MEMORY:\nNeural Net: Online\nData Cores: Stable\nFragmentation: 0%");
                break;
                
            case 'FILES':
                speak("Opening local file system.");
                // This actually opens the computer's real file selection window!
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.click();
                break;
                
            case 'SETTINGS':
                speak("Displaying system configuration.");
                alert("SYSTEM SETTINGS:\n- Audio: Active\n- Visuals: Optimal\n- Telemetry: Live");
                break;
                
            case 'EMAIL':
                speak("Opening secure mail client.");
                // Opens the default email app on your computer
                window.open('mailto:master@jarvis.local');
                break;
                
            case 'VISION':
                speak("Activating primary vision systems.");
                // Actually requests access to the user's webcam for a true sci-fi feel
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => { 
                        alert("Vision systems online. Camera access granted."); 
                        // Stop the camera immediately so the light turns off
                        stream.getTracks().forEach(track => track.stop());
                    })
                    .catch(err => { 
                        alert("Vision systems offline. Camera access denied."); 
                    });
                break;
                
            case 'TERMINAL':
                speak("Terminal input selected.");
                // Automatically selects your chat text box at the bottom
                const chatBox = document.getElementById('chatInput');
                if (chatBox) {
                    chatBox.focus();
                    chatBox.style.boxShadow = "0 0 15px #00e5ff";
                    setTimeout(() => chatBox.style.boxShadow = "none", 1000);
                }
                break;
        }
    });
});
// ========================================================
// AUTOMATED SYSTEM BOOT SEQUENCE
// ========================================================
window.addEventListener('load', () => {
    runAutoBootSequence();
});

function runAutoBootSequence() {
    const bootScreen = document.getElementById('bootScreen');
    const bootTerminal = document.getElementById('bootTerminal');
    const statusBox = document.getElementById("status");
    const responseBox = document.getElementById("responseBox");

    if (statusBox) statusBox.innerText = "BOOTING...";

    // Timeline of events (Text to print, delay, and which UI parts to reveal)
    const steps = [
        { 
            text: ">> Initializing core power grids...", 
            delay: 800, 
            reveal: '.hud-header' 
        },
        { 
            text: ">> Calibrating neural interface & reactor core...", 
            delay: 2500, 
            reveal: '.center-panel' 
        },
        { 
            text: ">> Loading telemetry and mission control protocols...", 
            delay: 4500, 
            reveal: '.left-panel, .right-panel' 
        },
        { 
            text: ">> Establishing secure voice and transcript engines...", 
            delay: 6500, 
            reveal: '.bottom-row' 
        },
        { 
            text: ">> All systems online. Welcome back, Master Zaid.", 
            delay: 8500, 
            finish: true 
        }
    ];

    steps.forEach(step => {
        setTimeout(() => {
            // 1. Print text to the black terminal screen
            if (bootTerminal) {
                const p = document.createElement('p');
                p.innerText = step.text;
                bootTerminal.appendChild(p);
            }

            // 2. Attempt to speak the text (Requires a user click somewhere on the page to work)
            const spokenText = step.text.replace(">> ", "");
            speak(spokenText);

            // 3. Reveal the linked UI components
            if (step.reveal) {
                const elements = document.querySelectorAll(step.reveal);
                elements.forEach(el => el.classList.add('ui-revealed'));
            }

            // 4. Wrap up the sequence and hide the overlay
            if (step.finish) {
                if (responseBox) responseBox.innerHTML = "All systems operational.<br><br>Awaiting command...";
                if (statusBox) statusBox.innerText = "READY";
                
                setTimeout(() => {
                    bootScreen.style.opacity = '0';
                    setTimeout(() => bootScreen.style.display = 'none', 1000);
                }, 1500); // Wait 1.5s after the final text before fading to the HUD
            }
        }, step.delay);
    });
}
// ========================================================
// LIVE DATA: BATTERY SENSOR
// ========================================================
async function initBatterySensor() {
    try {
        // Request battery access from the browser
        const battery = await navigator.getBattery();
        const batteryLevelEl = document.getElementById('batteryLevel');

        function updateBatteryUI() {
            if (batteryLevelEl) {
                // Convert decimal to percentage
                const level = Math.round(battery.level * 100);
                
                // Check if the laptop is plugged in
                const status = battery.charging ? "CHARGING" : "DRAINING";
                const color = battery.charging ? "#00ff9d" : "#00e5ff"; 
                
                // Update the HTML
                batteryLevelEl.innerHTML = `${level}% <br><span style="font-size: 8px; color: ${color}; letter-spacing: 2px;">${status}</span>`;
            }
        }

        // Run once on load, then listen for changes (plugging in/unplugging)
        updateBatteryUI();
        battery.addEventListener('levelchange', updateBatteryUI);
        battery.addEventListener('chargingchange', updateBatteryUI);

    } catch (e) {
        console.warn("Battery API not supported on this device/browser.");
    }
}
initBatterySensor();


// ========================================================
// LIVE DATA: SATELLITE WEATHER & LOCATION
// ========================================================
function initWeatherSensor() {
    const coreTempEl = document.getElementById('coreTemp');

    // 1. Ask the browser for GPS coordinates
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                // 2. Send coordinates to a free, open-source weather satellite API
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                const data = await response.json();
                
                // 3. Extract the actual local temperature
                const temp = Math.round(data.current_weather.temperature);

                // 4. Update the HUD
                if (coreTempEl) {
                    coreTempEl.innerHTML = `${temp}°C <br><span style="font-size: 8px; color: #c84cff; letter-spacing: 2px;">LOCAL AMBIENT</span>`;
                }
            } catch (e) {
                console.error("Weather uplink failed:", e);
            }
        }, (error) => {
            console.warn("Location access denied by user. Cannot fetch local weather.");
            if (coreTempEl) coreTempEl.innerHTML = `ERR <br><span style="font-size: 8px; color: red;">GPS OFFLINE</span>`;
        });
    }
}
initWeatherSensor();

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, 300/300, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(300, 300);
document.getElementById("earth").appendChild(renderer.domElement);

// Earth geometry
let geometry = new THREE.SphereGeometry(1, 32, 32);

// Texture (Earth image)
let texture = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg"
);

let material = new THREE.MeshBasicMaterial({ map: texture });
let earth = new THREE.Mesh(geometry, material);

scene.add(earth);

camera.position.z = 2;

// Animation
function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.005;
    renderer.render(scene, camera);
}

animate();
// =========================================
// DOCUMENT PICTURE-IN-PICTURE ENGINE
// =========================================
const pipBtn = document.getElementById("pipBtn");

if (pipBtn) {
    // Check if the modern Document PiP API is supported by the browser
    if ('documentPictureInPicture' in window) {
        pipBtn.addEventListener("click", async () => {
            try {
                // 1. Request a floating window frame with custom bounds
                const pipWindow = await window.documentPictureInPicture.requestWindow({
                    width: 320,
                    height: 220,
                });

                // 2. Clone and inject core styles so the glow and fonts transfer over
                document.querySelectorAll('style, link[rel="stylesheet"]').forEach((styleElement) => {
                    pipWindow.document.head.appendChild(styleElement.cloneNode(true));
                });

                // 3. Inject the floating layout structure
                pipWindow.document.body.innerHTML = `
                    <div class="pip-hud-container" style="background: #020813; color: #ffffff; padding: 15px; font-family: 'Orbitron', sans-serif; height: 100vh; box-sizing: border-box; overflow: hidden; border: 2px solid #00e5ff;">
                        <div style="font-size: 0.65rem; color: #00e5ff; letter-spacing: 2px; border-bottom: 1px solid rgba(0,229,255,0.2); padding-bottom: 5px; margin-bottom: 10px; display: flex; justify-content: space-between;">
                            <span>JARVIS // MINI-HUD</span>
                            <span style="color: #00ff9d; animation: terminal-blink 1s step-end infinite;">● LIVE</span>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <small style="color: rgba(255,255,255,0.4); font-size: 0.55rem; display:block;">CORE TELEMETRY</small>
                            <span id="pipCpu" style="font-size: 1.2rem; color: #ffffff; text-shadow: 0 0 8px #00e5ff;">CPU: 32%</span>
                        </div>
                        <div>
                            <small style="color: rgba(255,255,255,0.4); font-size: 0.55rem; display:block;">SYSTEM CORE FEED</small>
                            <div id="pipStatus" style="font-size: 0.75rem; color: #00ff9d; margin-top: 3px;">MONITORING MODE ACTIVE</div>
                        </div>
                    </div>
                `;

                // 4. Create a live bridge loop updating data from the main tab to the floating window
                const updateLoop = setInterval(() => {
                    // Check if window was closed by user
                    if (!pipWindow || pipWindow.closed) {
                        clearInterval(updateLoop);
                        return;
                    }

                    // Keep values mirrored perfectly
                    const pipCpuEl = pipWindow.document.getElementById("pipCpu");
                    const pipStatusEl = pipWindow.document.getElementById("pipStatus");

                    // Grab values from your main page dashboard state
                    const mainStatus = document.getElementById("status")?.innerText || "READY";
                    
                    if (pipStatusEl) pipStatusEl.innerText = mainStatus;
                    
                    // (Optional hook for your upcoming dynamic CPU metric upgrade)
                    if (pipCpuEl && window.currentCpuUsage) {
                        pipCpuEl.innerText = `CPU: ${window.currentCpuUsage}%`;
                    }
                }, 250);

            } catch (err) {
                console.error("Failed to initialize Document PiP window:", err);
            }
        });
    } else {
        // Fallback hide/notify if browser configuration blocks or doesn't support the framework
        pipBtn.style.opacity = "0.5";
        pipBtn.title = "Document Picture-in-Picture is not supported or enabled in this browser.";
    }
}
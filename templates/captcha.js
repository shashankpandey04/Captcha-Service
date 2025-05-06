const behaviorData = {
    mouseMoves: [],
    keyTimings: [],
    clicks: [],
    scrolls: [],
    tabFocus: true,
    inactivityPeriods: []
};

let lastActivity = Date.now();
let samplingRate = 100; // Collect mouse movements at a higher rate
let lastSampleTime = Date.now();
let behaviorToken = null;
let lastActiveTime = Date.now();

function disableAutoComplete() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.setAttribute('autocomplete', 'off');
        form.setAttribute('novalidate', 'novalidate');
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.setAttribute('autocomplete', 'off');
            if (input.name) {
                input.dataset.originalName = input.name;
                input.name = input.name + '_' + Math.random().toString(36).substr(2, 9);
            }
        });
    });
}

document.addEventListener("mousemove", e => {
    const now = Date.now();
    if (now - lastSampleTime >= samplingRate) {
        behaviorData.mouseMoves.push({ 
            x: e.clientX, 
            y: e.clientY, 
            t: now,
            pressure: e.pressure || 0, // For devices that support pressure
            speed: e.movementX ? Math.sqrt(e.movementX**2 + e.movementY**2) : 0
        });
        lastSampleTime = now;
        updateActivity();
    }
});

document.addEventListener("click", e => {
    behaviorData.clicks.push({ 
        x: e.clientX, 
        y: e.clientY, 
        t: Date.now(),
        button: e.button
    });
    updateActivity();
});

document.addEventListener("keydown", e => {
    behaviorData.keyTimings.push({
        t: Date.now(),
        keyCode: e.keyCode,
        interval: behaviorData.keyTimings.length > 0 ? 
            Date.now() - behaviorData.keyTimings[behaviorData.keyTimings.length-1].t : 0
    });
    updateActivity();
});

document.addEventListener("scroll", e => {
    behaviorData.scrolls.push({
        t: Date.now(),
        scrollY: window.scrollY,
        scrollX: window.scrollX
    });
    updateActivity();
});

document.addEventListener("visibilitychange", () => {
    behaviorData.tabFocus = !document.hidden;
    if (document.hidden) {
        const inactiveStart = Date.now();
        document.addEventListener("visibilitychange", function recordReturn() {
            if (!document.hidden) {
                behaviorData.inactivityPeriods.push({
                    start: inactiveStart,
                    end: Date.now()
                });
                document.removeEventListener("visibilitychange", recordReturn);
            }
        });
    }
    updateActivity();
});

function updateActivity() {
    lastActiveTime = Date.now();
}

setInterval(() => {
    const now = Date.now();
    if (now - lastActiveTime > 2000) { 
        behaviorData.inactivityPeriods.push({
            start: lastActiveTime,
            end: now
        });
        lastActiveTime = now;
    }
}, 2000);

function sendBehaviorData() {
    fetch("http://127.0.0.1:5000/submit_behavior", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            public_key: "{{ public_key }}",
            behavior_data: behaviorData
        })
    })
    .then(res => res.json())
    .then(res => {
        console.log("Behavior token received:", res.token);
        window.__behavior_token = res.token;
        behaviorToken = res.token;
        window.__captcha_ready = true;
        console.log("Behavior data sent:", behaviorData);
    })
    .catch(err => {
        console.error("Error submitting behavior data:", err);
    });
}

window.addEventListener("load", () => {
    setTimeout(sendBehaviorData, 3000);
    disableAutoComplete();

    setInterval(() => {
        if (behaviorData.mouseMoves.length > 50 || 
                behaviorData.keyTimings.length > 10 ||
                behaviorData.clicks.length > 5) {
            sendBehaviorData();
        }
    }, 5000);
});
function createCaptchaBadge() {
    const badge = document.createElement('div');
    badge.id = 'captcha-badge';
    badge.innerHTML = `
        <div id="captcha-badge-icon">
            <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M19,11c0,4.52-2.98,8.69-7,9.93 C7.98,19.69,5,15.52,5,11V6.3l7-3.11l7,3.11V11z M12,15c1.66,0,3-1.34,3-3s-1.34-3-3-3s-3,1.34-3,3S10.34,15,12,15z"/>
            </svg>
        </div>
        <div id="captcha-badge-info">
            <span class="badge-label">Protected by</span>
            <span class="badge-name">AWS LPU Captcha</span>
        </div>
    `;
    document.body.appendChild(badge);

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        #captcha-badge {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            background: linear-gradient(135deg, #2a2a3c, #1a1a2e);
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
            width: 48px;
            height: 48px;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.08);
        }
        #captcha-badge-info {
            opacity: 0;
            margin-left: 8px;
            white-space: nowrap;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.3px;
            color: rgba(255,255,255,0.9);
            transition: opacity 0.3s;
            display: flex;
            flex-direction: column;
            line-height: 1.2;
        }
        #captcha-badge:hover {
            width: 240px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.15) inset;
            background: linear-gradient(135deg, #323248,rgb(48, 48, 74));
        }
        #captcha-badge:hover #captcha-badge-info {
            opacity: 1;
        }
        #captcha-badge-icon {
            font-size: 20px;
            color: #62e6ff;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            position: relative;
            z-index: 2;
            min-width: 48px; /* Ensure fixed width even when expanding */
        }
        #captcha-badge-icon svg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .badge-label {
            font-size: 11px;
            opacity: 0.7;
        }
        .badge-name {
            font-weight: 600;
            background: linear-gradient(90deg, #62e6ff,rgb(110, 200, 120));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .badge-tag {
            font-size: 10px;
            background: linear-gradient(90deg, #ff7b9c, #ff5252);
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
            margin-top: 3px;
            display: inline-block;
            font-weight: 700;
            align-self: flex-start;
            box-shadow: 0 2px 6px rgba(255,82,82,0.3);
        }
    `;
    document.head.appendChild(style);
}
window.addEventListener('load', createCaptchaBadge);

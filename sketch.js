/**
 * SortCraft — Core Canvas Engine & State Controller
 */

class SortCraftEngine {
    constructor() {
        this.canvas = document.getElementById('visualizerCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById('canvasContainer');

        // State variables
        this.array = [];
        this.arraySize = 45;
        this.speed = 50; // 1 to 100
        this.currentAlgoKey = 'quickSort';
        this.currentPattern = 'random';
        this.generator = null;

        this.isRunning = false;
        this.isPaused = false;
        this.isFinished = false;

        this.animFrameId = null;
        this.lastStepTimestamp = 0;

        // Telemetry stats
        this.comparisons = 0;
        this.swaps = 0;
        this.accesses = 0;
        this.startTime = 0;
        this.elapsedTime = 0;

        // Active state indices for rendering
        this.compareIndices = new Set();
        this.swapIndices = new Set();
        this.pivotIndices = new Set();
        this.sortedIndices = new Set();

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.setupEventListeners();
        this.updateAlgoInfoPanel(this.currentAlgoKey);
        this.generateArray();
        this.render();
    }

    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.container.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.width = rect.width;
        this.height = rect.height;

        this.render();
    }

    generateArray() {
        this.stopVisualization();
        this.array = [];
        this.resetStateIndices();
        this.resetStats();

        const n = this.arraySize;
        const minVal = 15;
        const maxVal = this.height - 30;

        if (this.currentPattern === 'random') {
            for (let i = 0; i < n; i++) {
                this.array.push(minVal + Math.random() * (maxVal - minVal));
            }
        } else if (this.currentPattern === 'reversed') {
            for (let i = 0; i < n; i++) {
                this.array.push(maxVal - (i / (n - 1)) * (maxVal - minVal));
            }
        } else if (this.currentPattern === 'nearlySorted') {
            for (let i = 0; i < n; i++) {
                this.array.push(minVal + (i / (n - 1)) * (maxVal - minVal));
            }
            const numSwaps = Math.max(2, Math.floor(n * 0.08));
            for (let s = 0; s < numSwaps; s++) {
                let idx1 = Math.floor(Math.random() * n);
                let idx2 = Math.floor(Math.random() * n);
                [this.array[idx1], this.array[idx2]] = [this.array[idx2], this.array[idx1]];
            }
        } else if (this.currentPattern === 'fewUnique') {
            const levels = 5;
            for (let i = 0; i < n; i++) {
                let level = Math.floor(Math.random() * levels);
                this.array.push(minVal + (level / (levels - 1)) * (maxVal - minVal));
            }
        } else if (this.currentPattern === 'mountain') {
            const mid = Math.floor(n / 2);
            for (let i = 0; i < mid; i++) {
                this.array.push(minVal + (i / mid) * (maxVal - minVal));
            }
            for (let i = mid; i < n; i++) {
                this.array.push(maxVal - ((i - mid) / (n - mid)) * (maxVal - minVal));
            }
        }

        this.updateStatus('System Ready', 'ready');
        this.updateCommentary("Array generated. Click 'Play' to start sorting.");
        this.render();
    }

    resetStateIndices() {
        this.compareIndices.clear();
        this.swapIndices.clear();
        this.pivotIndices.clear();
        this.sortedIndices.clear();
    }

    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.accesses = 0;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.updateStatsUI();
    }

    updateStatsUI() {
        document.getElementById('statComparisons').innerText = this.comparisons.toLocaleString();
        document.getElementById('statSwaps').innerText = this.swaps.toLocaleString();
        document.getElementById('statAccesses').innerText = this.accesses.toLocaleString();
        document.getElementById('statTime').innerText = `${this.elapsedTime.toFixed(2)} ms`;
    }

    updateStatus(text, state) {
        const dot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');

        dot.className = 'status-dot';
        if (state === 'sorting') dot.classList.add('sorting');
        if (state === 'paused') dot.classList.add('paused');

        statusText.innerText = text;
    }

    updateCommentary(text) {
        document.getElementById('commentaryText').innerText = text;
    }

    startVisualization() {
        if (this.isFinished) {
            this.generateArray();
        }

        if (!this.generator) {
            const algoFunc = ALGO_GENERATORS[this.currentAlgoKey];
            if (!algoFunc) return;
            this.generator = algoFunc(this.array);
            this.startTime = performance.now();
        }

        this.isRunning = true;
        this.isPaused = false;

        document.getElementById('playIcon').className = 'fa-solid fa-pause';
        document.getElementById('playText').innerText = 'Pause';
        this.updateStatus('Sorting Array...', 'sorting');

        this.loop();
    }

    pauseVisualization() {
        this.isRunning = false;
        this.isPaused = true;
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        document.getElementById('playIcon').className = 'fa-solid fa-play';
        document.getElementById('playText').innerText = 'Resume';
        this.updateStatus('Visualization Paused', 'paused');
    }

    stopVisualization() {
        this.isRunning = false;
        this.isPaused = false;
        this.isFinished = false;
        this.generator = null;
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        document.getElementById('playIcon').className = 'fa-solid fa-play';
        document.getElementById('playText').innerText = 'Play';
    }

    stepVisualization() {
        if (this.isFinished) return;

        if (!this.generator) {
            const algoFunc = ALGO_GENERATORS[this.currentAlgoKey];
            if (!algoFunc) return;
            this.generator = algoFunc(this.array);
            this.startTime = performance.now();
        }

        this.executeSingleStep();
    }

    executeSingleStep() {
        if (!this.generator) return;

        const maxVal = this.height - 30;
        const res = this.generator.next();

        if (res.done) {
            this.finishVisualization();
            return;
        }

        const step = res.value;
        if (!step) return;

        this.resetStateIndices();

        if (this.startTime > 0) {
            this.elapsedTime = performance.now() - this.startTime;
        }

        if (step.type === 'compare') {
            this.comparisons++;
            this.accesses += 2;
            step.indices.forEach(idx => this.compareIndices.add(idx));
            soundSynth.playNote(this.array[step.indices[0]], maxVal, 'compare');
        } else if (step.type === 'swap') {
            this.swaps++;
            this.accesses += 4;
            step.indices.forEach(idx => this.swapIndices.add(idx));
            soundSynth.playNote(this.array[step.indices[0]], maxVal, 'swap');
        } else if (step.type === 'overwrite') {
            this.swaps++;
            this.accesses += 2;
            this.swapIndices.add(step.index);
            soundSynth.playNote(step.value, maxVal, 'swap');
        } else if (step.type === 'pivot') {
            this.pivotIndices.add(step.index);
            this.accesses++;
        } else if (step.type === 'markSorted') {
            step.indices.forEach(idx => this.sortedIndices.add(idx));
            soundSynth.playNote(this.array[step.indices[0]], maxVal, 'sorted');
        }

        if (step.msg) {
            this.updateCommentary(step.msg);
        }

        this.updateStatsUI();
        this.render();
    }

    finishVisualization() {
        this.stopVisualization();
        this.isFinished = true;
        this.resetStateIndices();

        for (let i = 0; i < this.array.length; i++) {
            this.sortedIndices.add(i);
        }

        if (window.authManager) {
            window.authManager.recordVisualizationRun();
        }

        this.updateStatus('Sorting Complete!', 'ready');
        this.updateCommentary(`Finished! Total Comparisons: ${this.comparisons}, Total Swaps: ${this.swaps}, Elapsed Time: ${this.elapsedTime.toFixed(2)} ms.`);
        this.render();
    }

    loop(timestamp = 0) {
        if (!this.isRunning) return;

        const delay = Math.max(0, Math.pow((100 - this.speed) / 10, 2) * 20);

        if (timestamp - this.lastStepTimestamp >= delay) {
            const stepsPerFrame = this.speed > 80 ? Math.floor((this.speed - 75) / 2) : 1;
            for (let s = 0; s < stepsPerFrame; s++) {
                this.executeSingleStep();
                if (!this.isRunning) break;
            }
            this.lastStepTimestamp = timestamp;
        }

        if (this.isRunning) {
            this.animFrameId = requestAnimationFrame((ts) => this.loop(ts));
        }
    }

    render() {
        const ctx = this.ctx;
        const width = this.width;
        const height = this.height;

        ctx.clearRect(0, 0, width, height);

        const n = this.array.length;
        if (n === 0) return;

        const barWidth = Math.max(2, (width - (n - 1) * 2) / n);
        const style = getComputedStyle(document.body);

        const colorDefault = style.getPropertyValue('--color-default').trim() || '#00e5ff';
        const colorCompare = style.getPropertyValue('--color-compare').trim() || '#f59e0b';
        const colorSwap = style.getPropertyValue('--color-swap').trim() || '#ec4899';
        const colorPivot = style.getPropertyValue('--color-pivot').trim() || '#8b5cf6';
        const colorSorted = style.getPropertyValue('--color-sorted').trim() || '#10b981';

        for (let i = 0; i < n; i++) {
            const val = this.array[i];
            const x = i * (barWidth + 2);
            const barHeight = val;
            const y = height - barHeight;

            let fillColor = colorDefault;

            if (this.sortedIndices.has(i)) fillColor = colorSorted;
            if (this.pivotIndices.has(i)) fillColor = colorPivot;
            if (this.compareIndices.has(i)) fillColor = colorCompare;
            if (this.swapIndices.has(i)) fillColor = colorSwap;

            ctx.fillStyle = fillColor;

            if (this.compareIndices.has(i) || this.swapIndices.has(i) || this.pivotIndices.has(i)) {
                ctx.shadowColor = fillColor;
                ctx.shadowBlur = 12;
            } else {
                ctx.shadowBlur = 0;
            }

            const radius = Math.min(4, barWidth / 2);
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
            ctx.fill();

            if (n <= 35 && barWidth > 14) {
                ctx.shadowBlur = 0;
                ctx.fillStyle = document.body.classList.contains('theme-light') ? '#0f172a' : '#ffffff';
                ctx.font = '10px Fira Code';
                ctx.textAlign = 'center';
                ctx.fillText(Math.round(val), x + barWidth / 2, y - 6);
            }
        }
    }

    updateAlgoInfoPanel(key) {
        const data = ALGO_METADATA[key];
        if (!data) return;

        document.getElementById('algoName').innerText = data.name;
        document.getElementById('algoCategory').innerText = data.category;
        document.getElementById('algoDescription').innerText = data.description;

        document.getElementById('timeBest').innerText = data.timeBest;
        document.getElementById('timeAvg').innerText = data.timeAvg;
        document.getElementById('timeWorst').innerText = data.timeWorst;
        document.getElementById('spaceComplexity').innerText = data.spaceComplexity;
        document.getElementById('isStable').innerText = data.stable;

        const codeContainer = document.getElementById('codeContainer');
        codeContainer.innerHTML = data.code.map((line, idx) => `<div><span style="color:#64748b; margin-right: 10px;">${idx + 1}</span>${line}</div>`).join('');
    }

    setupEventListeners() {
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            document.body.className = `theme-${e.target.value}`;
            if (window.authManager && window.authManager.isLightMode) {
                document.body.classList.add('theme-light');
            }
            this.render();
        });

        document.getElementById('soundToggleBtn').addEventListener('click', () => {
            const enabled = soundSynth.toggleMute();
            const icon = document.getElementById('soundIcon');
            icon.className = enabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        });

        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            soundSynth.setVolume(e.target.value);
        });

        document.getElementById('algoSelect').addEventListener('change', (e) => {
            this.currentAlgoKey = e.target.value;
            this.updateAlgoInfoPanel(this.currentAlgoKey);
            this.generateArray();
        });

        document.getElementById('patternSelect').addEventListener('change', (e) => {
            this.currentPattern = e.target.value;
            this.generateArray();
        });

        const sizeSlider = document.getElementById('arraySize');
        sizeSlider.addEventListener('input', (e) => {
            this.arraySize = parseInt(e.target.value, 10);
            document.getElementById('sizeValue').innerText = this.arraySize;
            this.generateArray();
        });

        const speedSlider = document.getElementById('sortSpeed');
        speedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value, 10);
            document.getElementById('speedValue').innerText = `${this.speed}x`;
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.generateArray();
        });

        document.getElementById('playPauseBtn').addEventListener('click', () => {
            if (this.isRunning) {
                this.pauseVisualization();
            } else {
                this.startVisualization();
            }
        });

        document.getElementById('stepBtn').addEventListener('click', () => {
            if (this.isRunning) this.pauseVisualization();
            this.stepVisualization();
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.sortEngine = new SortCraftEngine();
});

// Web Audio API Synthesizer for Sorting Visualizer
class SoundSynthesizer {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.volume = 0.15;
        this.maxFreq = 880; // A5
        this.minFreq = 150; // D3
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playNote(value, maxVal, type = 'compare') {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            // Calculate frequency logarithmically based on value
            const normalized = Math.max(0, Math.min(1, value / maxVal));
            const freq = this.minFreq * Math.pow(this.maxFreq / this.minFreq, normalized);

            osc.type = type === 'swap' ? 'triangle' : (type === 'sorted' ? 'sine' : 'sine');
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            const duration = type === 'swap' ? 0.08 : (type === 'sorted' ? 0.04 : 0.05);
            const vol = type === 'swap' ? this.volume * 1.2 : this.volume;

            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio context error fallback
        }
    }

    setVolume(val) {
        this.volume = parseFloat(val);
    }

    toggleMute() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

const soundSynth = new SoundSynthesizer();

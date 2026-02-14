/**
 * Simple audio utility using Web Audio API to generate game sounds
 * without needing external assets.
 */

class AudioService {
    private ctx: AudioContext | null = null;

    private getContext() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.ctx;
    }

    /**
     * Pleasant high-pitched "ding"
     */
    playCorrect() {
        try {
            const ctx = this.getContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) {
            console.warn('Audio play failed', e);
        }
    }

    /**
     * Short low-pitched "buzz"
     */
    playIncorrect() {
        try {
            const ctx = this.getContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(110, ctx.currentTime); // A2
            osc.frequency.linearRampToValueAtTime(55, ctx.currentTime + 0.2); // A1

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch (e) {
            console.warn('Audio play failed', e);
        }
    }
}

export const audioService = new AudioService();

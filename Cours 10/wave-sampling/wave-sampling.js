import LibSampleRate from 'https://cdn.jsdelivr.net/npm/@alexanderolsen/libsamplerate-js@2.1/+esm'
import BaseVisualizer from '../BaseVisualizer.js'

fetch('wave-sampling/index.html')
    .then(stream => stream.text())
    .then(text => define(text))

function define(html) {
    class WaveSampling extends BaseVisualizer {

        circles = []
        path = null

        constructor() {
            super()

            this.innerHTML = html

            this.svg       = SVG(this.querySelector('svg')).viewbox(0, 0, 10, 2)
            this.srInput  = this.querySelector('#sampling')

            this.y = this.t.map(t =>  Math.cos(2 * Math.PI * 440 * t))

            this.srInput.addEventListener('input', () => this.update())

            let path = this.getPath(this.t.slice(0, 1000), this.y.slice(0, 1000))
            this.svg.path().plot(path).attr({'stroke-width': 0.005, 'stroke-dasharray': 0.05})

            this.update()
        }

        update() {
            let sr = this.srInput.value

            this.y_resampled_true = this.t.map(t => Math.cos(Math.PI * 2 * Math.min((sr - 440), 440) * t))

            let path = this.getPath(this.t.slice(0, 1000), this.y_resampled_true.slice(0, 1000))
            if (this.path == null) {
                this.path = this.svg.path().attr({'stroke': 'rgba(255,0,0,0.5)'})
                this.path.plot(path)
            } else {
                this.path.animate().plot(path)
            }
            
            this.t_sampled = Array(this.DURATION * sr).fill().map((_, i) => i / sr)
            this.y_sampled = this.t_sampled.map(t =>  Math.cos(2 * Math.PI * 440 * t))
            
            if(sr < 2 * 440) {
                LibSampleRate.create(1, sr, 44100, {converterType: 1})
                .then((src) => {
                    this.y_resampled = src.simple(this.y_sampled)
                    this.load(this.y_resampled)
                    src.destroy()
                })
            } else {
                this.load(this.y)
            }

            this.y_sampled.slice(0, 1000).forEach((y, k) => {
                let point = this.scale({x: this.t_sampled[k], y: y})
                if (this.circles.length == k) {
                    this.circles.push(
                        this.svg.circle(0.03)
                            .cx(point.x)
                            .cy(point.y)
                    )
                } else {
                    this.circles[k].animate()
                            .cx(point.x)
                            .cy(point.y)
                }
            })
        }

    }

    customElements.define('wave-sampling', WaveSampling)
}
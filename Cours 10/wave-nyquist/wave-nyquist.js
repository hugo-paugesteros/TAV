import BaseVisualizer from '../BaseVisualizer.js'

fetch('wave-nyquist/index.html')
    .then(stream => stream.text())
    .then(text => define(text))

function define(html) {
    class WaveNyquist extends BaseVisualizer {

        xMin = 0
        xMax = 2

        SR = 100

        circles = []
        path = null

        constructor() {
            super()

            this.innerHTML = html

            this.svg       = SVG(this.querySelector('svg')).viewbox(0, 0, 10, 2)
            this.freqInput = this.querySelector('#frequency')
            this.srInput   = this.querySelector('#sr')

            this.t = new Float32Array(this.DURATION * this.SR).fill().map((_, i) => i / this.SR)
            this.y = this.t.map(t => Math.cos(Math.PI * 2 * 1 * t))

            this.freqInput.addEventListener('input', () => this.update())
            this.srInput.addEventListener('input', () => this.update())

            this.update()
        }

        update() {
            let f = this.freqInput.value
            let sr = this.srInput.value

            let t = new Float32Array(this.DURATION * sr).fill().map((_, i) => i / sr)
            let y = t.map(t => Math.cos(Math.PI * 2 * 3 * t))

            y.forEach((y, k) => {
                let point = this.scale({x: t[k], y: y})
                if(this.circles.length == k) {
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
            
            y = this.t.map(t => Math.cos(Math.PI * 2 * f * t))
            let path = this.getPath(this.t.slice(0,1000), y.slice(0,1000))
            if(this.path == null) {
                this.path = this.svg.path()
                this.path.plot(path).attr({'stroke-width': 0.005, 'stroke-dasharray': 0.05})
            } else {
                this.path.animate().plot(path)
            }
        }

    }

    customElements.define('wave-nyquist', WaveNyquist)
}
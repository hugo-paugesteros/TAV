import BaseVisualizer from '../BaseVisualizer.js'

fetch('wave-generator/index.html')
    .then(stream => stream.text())
    .then(text => define(text))

function define(html) {
    class WaveGenerator extends BaseVisualizer {

        path = null

        constructor() {
            super()
            
            this.innerHTML = html

            this.svg       = SVG(this.querySelector('svg')).viewbox(0, 0, 10, 2)
            this.gainInput = this.querySelector('#gain')
            this.freqInput = this.querySelector('#freq')
            this.typeInput = this.querySelector('#type')

            this.gainInput.addEventListener('input', () => this.update())
            this.freqInput.addEventListener('input', () => this.update())
            this.typeInput.addEventListener('input', () => this.update())

            this.update()
        }

        update() {
            let A = this.gainInput.value
            let f = this.freqInput.value
            let type = this.typeInput.value

            switch (type) {
                case 'square':
                    this.y = this.t.map(t => {
                        if(t % (1/f) > 1/(2*f)) {
                            return A
                        } else {
                            return -A
                        }
                    })
                    break
                case 'complex':
                    this.y = this.t.map((t, i) => 
                        A/2 * Math.sin(2 * Math.PI * f * t) +
                        A/8 * Math.sin(2 * Math.PI * 2*f * t) +
                        A/7 * Math.sin(2 * Math.PI * 3*f * t)
                    )
                    break
                default:
                    this.y = this.t.map((t, i) => A * Math.sin(2 * Math.PI * f * t))
                    break
            }

            this.load(this.y)

            let path = this.y.slice(0, 1000).reduce(
                (acc, curr, k) => {
                    let point = this.scale({x: this.t[k], y: curr})
                    if(k == 0) return `M ${point.x} ${point.y} `
                    return acc + `L ${point.x} ${point.y} `
                }, '')

            if (this.path == null) {
                this.path = this.svg.path()
                this.path.plot(path)
            } else {
                this.path.animate().plot(path)
            }
        }

    }

    customElements.define('wave-generator', WaveGenerator)
}
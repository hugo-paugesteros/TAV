import {quantize} from '../utils.js'
import BaseVisualizer from '../BaseVisualizer.js'

fetch('wave-quantization/index.html')
    .then(stream => stream.text())
    .then(text => define(text))

function define(html) {
    class WaveQuantization extends BaseVisualizer {

        path = null
        true = null

        constructor() {
            super()

            this.innerHTML = html

            this.svg       = SVG(this.querySelector('svg')).viewbox(0, 0, 10, 2)
            this.bitInput  = this.querySelector('#quantization')

            this.bitInput.addEventListener('input', () => this.update())

            this.y = this.t.map(t =>  Math.sin(2 * Math.PI * 440 * t))
            let path = this.getPath(this.t.slice(0, 1000), this.y.slice(0, 1000))
            this.svg.path().plot(path).attr({
                'stroke-width': 0.005, 
                'stroke-dasharray': 0.05
            })

            this.update()
        }

        update() {
            let n = this.bitInput.value
            
		    this.y_quant = quantize(this.y, n)

            this.load(this.y_quant)

            let path = this.y_quant.slice(0, 1000).reduce(
                (acc, curr, k) => {
                    let point = this.scale({x: this.t[k], y: curr})
                    if(k == 0) return `M ${point.x} ${point.y} `
                    return acc + `L ${point.x} ${point.y} `
                }, '')

            if (this.path == null) {
                this.path = this.svg.path()
                this.path.plot(path)
            } else {
                this.path.timeline().finish()
                this.path.animate().plot(path)
            }
        }

    }

    customElements.define('wave-quantization', WaveQuantization)
}
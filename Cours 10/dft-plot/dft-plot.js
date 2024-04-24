fetch('dft-plot/index.html')
    .then(stream => stream.text())
    .then(text => define(text))

function define(html) {
    class DFTPlot extends HTMLElement {

        SR = 20
        FACTOR = 10

        circles = []
        rects = []

        windowToggle = false

        constructor() {
            super()

            this.innerHTML = html
        }

        connectedCallback() {
            this.waveform_svg = SVG().addTo(this).viewbox(0, 0, 10, 1).viewrange(0, 1, -1.05, 1.05)
            this.dft_svg      = SVG().addTo(this).viewbox(0, 0, 10, 1).viewrange(0, this.SR/2, 0, 0.5 * this.SR)

            this.waveform_svg.line(0, 0.5, 10, 0.5)
            this.dft_svg.line(0, 1, 10, 1)

            this.t         = Array(this.SR * this.FACTOR).fill().map((_, i) => i / (this.SR * this.FACTOR))
            this.f         = this.t.map((t, _) => Math.sin(2 * Math.PI * 8.5  * t)) 

            this.path = this.waveform_svg.path().plot(this.waveform_svg.getPath(this.t, this.f))
            this.f.filter((_, i) => i % this.FACTOR == 0).forEach((y, k) => {
                let point = this.waveform_svg.scale({x: this.t[k*this.FACTOR], y: y})
                this.circles.push(
                    this.waveform_svg.circle(.03)
                        .cx(point.x)
                        .cy(point.y)
                )
            })

            this._dft().forEach((y, k) => {
                let point = this.dft_svg.scale({x: k, y: y})
                this.rects.push(
                    this.dft_svg.rect(10/(this.SR*4), y).x(point.x).y(point.y)
                )
            })

            this.addEventListener('click', () => this.toggle())
        }

        update() {
            this.path.animate().plot(this.waveform_svg.getPath(this.t, this.f))
            this.f.filter((_, i) => i % this.FACTOR == 0).forEach((y, k) => {
                let point = this.waveform_svg.scale({x: this.t[k*this.FACTOR], y: y})
                this.circles[k].animate().cy(point.y)
            })
            this._dft().forEach((y, k) => {
                let point = this.dft_svg.scale({x: k, y: y})
                this.rects[k].animate().y(point.y)
            })
        }

        toggle() {
            this.windowToggle = !this.windowToggle
            if(this.windowToggle) {
                this.original = this.f
                this.f = this.f.map((y, k) => y * this._hann(this.t[k]))
            } else {
                this.f = this.original
            }
            this.update()
        }

        _dft() {
            let dft = Array(this.SR/2)
            for (let k = 0; k <= this.SR/2; k++) {
                let real = 0
                let imag = 0
                for (let n = 0; n < this.SR; n++) {
                    real += this.f[n * this.FACTOR] * Math.cos(2 * Math.PI * k * n / this.SR)
                    imag += this.f[n * this.FACTOR] * Math.sin(-2 * Math.PI * k * n / this.SR)
                }
                dft[k] = Math.sqrt(Math.pow(real, 2) + Math.pow(imag, 2))
            }
            return dft
        }

        _hann(i) {
            return 0.5*(1 - Math.cos(6.283185307179586*i))
        }

    }

    customElements.define('dft-plot', DFTPlot)
}
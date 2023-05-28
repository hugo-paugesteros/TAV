import { SVG } from "https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js"

let template = document.createElement('template')
template.innerHTML = `
<style>
svg {
	transform: scaleY(-1);
	stroke: white;
	fill: white;
	stroke-width : 0.01;
}
svg path {
	fill: transparent;
}
svg circle {
	stroke: transparent;
}
</style>
`

class DFTDemo extends HTMLElement {

	plotData = {}
	dft = []
	window = false
	N = 32
	oversampling = 20

	constructor() {
		super()

		this.shadow = this.attachShadow({mode: 'open'})
		this.shadow.appendChild(template.content.cloneNode(true))

		this.time_svg = SVG().addTo(this.shadow)
		this.time_svg.viewbox(0, -1.05, this.N, 2.1)

		this.frequency_svg = SVG().addTo(this.shadow)
		this.frequency_svg.viewbox(0, 0, this.N / 2, 2)
		// this.func = (t) => Math.sin(2 * Math.PI * 2 * t)

		this._axis()
		// this.update()
		// this.render()
	}

	_axis() {
		this.time_svg.path(`M 0 0 H ${this.N}`).attr({
			'stroke-width': 0.005
		})
		this.frequency_svg.path(`M 0 0 H ${this.N / 2}`).attr({
			'stroke-width': 0.005
		})
	}

	_buildPath(y) {
		let pathString = ''
		y.forEach((y, i) => {
			if(i == 0) {
				pathString += `M ${i / this.oversampling} ${y} `
			} else {
				pathString += `L ${i / this.oversampling} ${y} `
			}
		})
		return pathString
	}

	_hann(i) {
		return 0.5*(1 - Math.cos(6.283185307179586*i/(this.N-1)))
	  }

	update() {
		if(this.window) {
			this.y = Array(this.N * this.oversampling)
			.fill()
			.map((_, n) => this._hann(n / (this.oversampling)) * this.func(n / (this.N * this.oversampling)))
		} else {
			this.y = Array(this.N * this.oversampling)
			.fill()
			.map((_, n) => this.func(n / (this.N * this.oversampling)))
		}

		this.y_discrete = Array(this.N)
			.fill()
			.map((_, n) => this.y[n * this.oversampling])

		for (let k = 0; k <= this.N/2; k++) {
			let real = 0
			let imag = 0
			for (let n = 0; n < this.N; n++) {
				real += this.y_discrete[n] * Math.cos(2 * Math.PI * k * n / this.N)
				imag += this.y_discrete[n] * Math.sin(-2 * Math.PI * k * n / this.N)
			}
			this.dft[k] = Math.sqrt(Math.pow(real, 2) + Math.pow(imag, 2))
		}

		this.render()
	}

	render() {
		if(this.plotData.y_path) {
			this.plotData.y_path.animate().plot(this._buildPath(this.y))
		} else {
			this.plotData.y_path = this.time_svg.path(this._buildPath(this.y))
		}
		
		if(this.plotData.y_circles) {
			this.y_discrete.forEach((y, n) => {
				this.plotData.y_circles[n].animate()
					.cx(n)
					.cy(y)
			})
		} else {
			this.plotData.y_circles = []
			this.y_discrete.forEach((y, n) => {
				this.plotData.y_circles.push(
					this.time_svg.circle(.05)
						.cx(n)
						.cy(y)
				)
			})
		}

		if(this.plotData.dft_rects) {
			this.dft.forEach((Y, k) => {
				this.plotData.dft_rects[k].animate()
					.height(2*Y / this.N)
			})
		} else {
			this.plotData.dft_rects = []
			this.dft.forEach((Y, k) => {
				this.plotData.dft_rects.push(
					this.frequency_svg.rect(.05)
						.cx(k)
						.cy(0)
						.width(.1)
						.height(2*Y / this.N)
				)
			})
		}
	}

}

customElements.define('dft-demo', DFTDemo)
import { SVG } from "https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js"

let template = document.createElement('template')
template.innerHTML = `
<progress id="cos_sim"></progress>
<progress id="sin_sim"></progress>

<style>
	progress {
		transition: all .2s;
		height: 30px;
		background: black;
		width: 0px;
	}

	svg {
		display: block;
		margin: 20px auto;
	}
	@media (prefers-color-scheme: dark) {
		svg {
			stroke: white;
		}
		svg circle {
			fill: white;
			stroke: transparent;
		}
	}
</style>
`

class InnerProduct extends HTMLElement {

	points = []
	spoints = []
	pointshq = []

	constructor() {
		super()

		this.shadow = this.attachShadow({mode: 'open'})
		this.shadow.appendChild(template.content.cloneNode(true))

		this.svg = SVG().addTo(this.shadow)
		this.svg.viewbox(-1, -1.05, 17, 2.1)

		this.cos_sim = this.shadow.querySelector('#cos_sim')
		this.sin_sim = this.shadow.querySelector('#sin_sim')

		this.N = 15
		this.oversampling = 20
		this.y = Array(this.N + 1).fill().map((_, n) => Math.cos(2 * Math.PI * n / this.N + 1.5))
		this.yhq = Array(this.N * this.oversampling).fill().map((_, n) => Math.cos(2 * Math.PI * n / (this.N * this.oversampling) + 1.5))
		
		this.axis()
		
		this.y.forEach((y, n) => {
			this.svg.circle(.05)
				.cx(n)
				.cy(y)
		})

		this.svg.path(this._buildPath(this.yhq)).attr({
			fill: 'transparent',
			'stroke-width': '.01'
		})
	}

	axis() {
		this.svg.path('M -1 0 H 18').attr({
			'stroke-width': 0.005
		})
	}

	update(k) {
		this.k = k
		this.fk = Array(this.N + 1).fill().map((_, n) => Math.cos(2 * Math.PI * this.k * n / this.N))
		this.fkhq = Array(this.N * this.oversampling).fill().map((_, n) => Math.cos(2 * Math.PI * this.k * n / (this.N * this.oversampling)))
		this.inner_product = this.yhq.reduce((acc, y, n) => acc + y * this.fkhq[n])

		// Sine
		this.sfk = Array(this.N + 1).fill().map((_, n) => Math.sin(2 * Math.PI * this.k * n / this.N))
		this.sfkhq = Array(this.N * this.oversampling).fill().map((_, n) => Math.sin(2 * Math.PI * this.k * n / (this.N * this.oversampling)))
		this.sinner_product = this.yhq.reduce((acc, y, n) => acc + y * this.sfkhq[n])

		this.render()
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

	render() {
		if (this.points[0]) {
			this.fk.forEach((y, n) => {
				this.points[n]
					.animate()
					.cx(n)
					.cy(y)
			})

			this.sfk.forEach((y, n) => {
				this.spoints[n]
					.animate()
					.cx(n)
					.cy(y)
			})

			this.path.animate().plot(this._buildPath(this.fkhq))
			this.spath.animate().plot(this._buildPath(this.sfkhq))
		} else {
			this.fk.forEach((y, n) => {
				this.points.push(
					this.svg.circle(.05)
					.cx(n)
					.cy(y)
					.attr({fill: 'red'})
				)
			})

			this.sfk.forEach((y, n) => {
				this.spoints.push(
					this.svg.circle(.05)
					.cx(n)
					.cy(y)
					.attr({fill: 'green'})
				)
			})

			this.path = this.svg.path(this._buildPath(this.fkhq)).attr({
				fill: 'transparent',
				stroke: 'red',
				'stroke-width': '.01'
			})
			this.spath = this.svg.path(this._buildPath(this.sfkhq)).attr({
				fill: 'transparent',
				stroke: 'green',
				'stroke-width': '.01'
			})
		}

		this.cos_sim.style.width = Math.round(Math.abs(this.inner_product)) / 150 * 300 + 'px'
		this.sin_sim.style.width = Math.round(Math.abs(this.sinner_product)) / 150 * 300 + 'px'
	}

}

customElements.define('inner-product', InnerProduct)
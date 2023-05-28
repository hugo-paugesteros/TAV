import { SVG } from "https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js"

let template = document.createElement('template')
template.innerHTML = `
<style>
progress {
	transition: all .2s;
	height: 30px;
	background: black;
	width: 0px;
}
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
<progress id="cos_sim"></progress>
<progress id="sin_sim"></progress>
`

class InnerProduct extends HTMLElement {

	plotData = {}
	k = 1
	N = 16
	oversampling = 20

	constructor() {
		super()

		this.shadow = this.attachShadow({mode: 'open'})
		this.shadow.appendChild(template.content.cloneNode(true))

		this.cos_progress = this.shadow.querySelector('#cos_sim')
		this.sin_progress = this.shadow.querySelector('#sin_sim')

		this.svg = SVG().addTo(this.shadow)
		this.svg.viewbox(0, -1.05, this.N, 2.1)
		this.func = (t) => Math.sin(2 * Math.PI * 2 * t)

		this._axis()
		// this.update()
	}

	_axis() {
		this.svg.path('M 0 0 H 16').attr({
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
		this.y = Array(this.N * this.oversampling)
			.fill()
			.map((_, n) => this.func(n / (this.N * this.oversampling)))
			// .map((_, n) => this._hann(n / (this.oversampling)) * this.func(n / (this.N * this.oversampling)))
		this.y_discrete = Array(this.N)
			.fill()
			.map((_, n) => this.y[n * this.oversampling])

		this.cos = Array(this.N * this.oversampling)
			.fill()
			.map((_, n) => Math.cos(2 * Math.PI * this.k * n / (this.N * this.oversampling)))
		this.cos_discrete = Array(this.N)
			.fill()
			.map((_, n) => this.cos[n * this.oversampling])

		this.sin = Array(this.N * this.oversampling)
			.fill()
			.map((_, n) => Math.sin(2 * Math.PI * this.k * n / (this.N * this.oversampling)))	
		this.sin_discrete = Array(this.N)
			.fill()
			.map((_, n) => this.sin[n * this.oversampling])

		// this.cos_sim = this.cos_discrete.reduce((acc, y, n) => acc + y * this.y_discrete[n])
		// this.sin_sim = this.sin_discrete.reduce((acc, y, n) => acc + y * this.y_discrete[n])

		this.cos_sim = 0
		this.sin_sim = 0
		for (let n = 0; n < this.N; n++) {
			this.cos_sim += this.y_discrete[n] * this.cos_discrete[n]
			this.sin_sim += this.y_discrete[n] * this.sin_discrete[n]
		}

		// this.cos_sim = this.cos.reduce((acc, y, n) => acc + y * this.y[n])
		// this.sin_sim = this.sin.reduce((acc, y, n) => acc + y * this.y[n])

		this.render()
	}

	render() {
		if(this.plotData.y_path) {
			this.plotData.y_path.animate().plot(this._buildPath(this.y))
		} else {
			this.plotData.y_path = this.svg.path(this._buildPath(this.y))
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
					this.svg.circle(.05)
						.cx(n)
						.cy(y)
				)
			})
		}

		if(this.plotData.cos_path) {
			this.plotData.cos_path.animate().plot(this._buildPath(this.cos))
		} else {
			this.plotData.cos_path = this.svg.path(this._buildPath(this.cos)).attr({
				stroke : 'red'
			})
		}

		if(this.plotData.cos_circles) {
			this.cos_discrete.forEach((y, n) => {
				this.plotData.cos_circles[n].animate()
					.cx(n)
					.cy(y)
			})
		} else {
			this.plotData.cos_circles = []
			this.cos_discrete.forEach((y, n) => {
				this.plotData.cos_circles.push(
					this.svg.circle(.05)
						.cx(n)
						.cy(y)
						.attr({fill: 'red'})
				)
			})
		}

		if(this.plotData.sin_path) {
			this.plotData.sin_path.animate().plot(this._buildPath(this.sin))
		} else {
			this.plotData.sin_path = this.svg.path(this._buildPath(this.sin)).attr({
				stroke : 'green'
			})
		}

		if(this.plotData.sin_circles) {
			this.sin_discrete.forEach((y, n) => {
				this.plotData.sin_circles[n].animate()
					.cx(n)
					.cy(y)
			})
		} else {
			this.plotData.sin_circles = []
			this.sin_discrete.forEach((y, n) => {
				this.plotData.sin_circles.push(
					this.svg.circle(.05)
						.cx(n)
						.cy(y)
						.attr({fill: 'green'})
				)
			})
		}

		this.cos_progress.style.width = Math.round(Math.max(this.cos_sim, 0)) / 10 * 300 + 'px'
		this.sin_progress.style.width = Math.round(Math.max(this.sin_sim, 0)) / 10 * 300 + 'px'
	}

}

customElements.define('inner-product', InnerProduct)
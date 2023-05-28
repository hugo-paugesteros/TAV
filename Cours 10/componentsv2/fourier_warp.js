let template = document.createElement('template')
template.innerHTML = `
<style>
svg {
	display: block;
	margin: 20px auto;
}
@media (prefers-color-scheme: dark) {
	svg path {
		stroke: white;
	}
	svg circle {
		fill: white;
	}
}
</style>
<svg></svg>
`

class FourierWarp extends HTMLElement {

	points = []

	constructor() {
		super()

		this.shadow = this.attachShadow({mode: 'open'})
		this.shadow.appendChild(template.content.cloneNode(true))

		this.svg = this.shadow.querySelector('svg')
		this.svg.style.width = '500px'
		
		this.gain = 20
		let freq = 1
		this.t = Array(10 * 200).fill().map((_, i) => i / 200)
		
		this.y = this.t.map(t => 
			this.gain * Math.cos(2 * Math.PI * freq * t)
		)

		this.y = this.t.map(t => 
			this.gain * Math.cos(2 * Math.PI * freq * t + Math.PI/4)
		)
		
		this.y = this.t.map(t => 
			this.gain * Math.cos(2 * Math.PI * freq * t)
			+ this.gain / 2 * Math.cos(2 * Math.PI * 2 * freq * t)
		)
		this.axis()
		this.render(1)
	}

	axis() {
		let xaxis = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		xaxis.setAttribute('d', 'M -20 0 H 40')
		xaxis.setAttribute('stroke', 'black')
		xaxis.setAttribute('stroke-width', '0.05')
		this.svg.append(xaxis)

		let yaxis = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		yaxis.setAttribute('d', 'M 0 -20 V 40')
		yaxis.setAttribute('stroke', 'black')
		yaxis.setAttribute('stroke-width', '0.05')
		this.svg.append(yaxis)
	}

	render(k) {
		this.svg.setAttribute('viewBox', `${-this.gain} ${-this.gain} ${2*this.gain} ${2*this.gain}`)

		let N = this.y.length
		let mx = 0
		let my = 0

		if(this.points[0] === undefined) {
			this.center = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
			this.center.setAttribute('r', '0.3')
			this.center.setAttribute('fill', 'red')
			this.svg.append(this.center)
		}

		this.y.forEach((y, n) => {
			// let cx = (y/5 + 0) * Math.cos(2 * Math.PI * k * n / N)
			// let cy = (y/5 + 0) * Math.sin(2 * Math.PI * k * n / N)
			let cx = (y/5 + 10) * Math.cos(2 * Math.PI * k * n / N)
			let cy = (y/5 + 10) * Math.sin(2 * Math.PI * k * n / N)

			mx += cx/N
			my += cy/N

			if (this.points[n] !== undefined) {
				this.points[n].setAttribute('cx', cx)
				this.points[n].setAttribute('cy', cy)
			} else {
				const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
				point.setAttribute('r', 0.1)
				point.setAttribute('cx', cx)
				point.setAttribute('cy', cy)
				this.points.push(point)
				this.svg.append(point)
			}
		})
		this.center.setAttribute('cx', mx)
		this.center.setAttribute('cy', my)
	}

}

customElements.define('fourier-warp', FourierWarp)
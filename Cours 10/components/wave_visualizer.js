let template = document.createElement('template')
template.innerHTML = `
<style>
	svg {
		display: block;
	}
	svg path {
		fill: transparent;
	}

	svg circle {
		stroke-width: 0;
	}

	@media (prefers-color-scheme: dark) {
		svg {
			stroke: white;
			fill: white;
		}
	}
</style>
<svg></svg>
`

class WaveVisualizer extends HTMLElement {

	plots = []
	points = []

	constructor() {
		super()
		let shadow 	= this.attachShadow({mode: 'open'})
		shadow.appendChild(template.content.cloneNode(true))
		this.svg = shadow.querySelector('svg')
	}

	connectedCallback() {
		this.render()
	}

	plot(t, y, type='plot') {
		let plot = new Plot(t, y, type)
		this._setViewbox(t, y)
		plot.render(this)
		this.plots.push(plot)
		return plot
	}

	render() {
		// this._setViewbox()
		// this._renderStep(this.t, this.y)

		// this.t.forEach((t, i) => {
		// 	this._renderPoint(i, t, this.y[i])
		// })

		// this._renderPath(this.t, this.y)
	}

	_setViewbox(t, y) {
		let t_min = Math.min(...t)
		let t_max = Math.max(...t)
		let y_min = Math.min(...y)
		let y_max = Math.max(...y)

		
		let t_range = t_max - t_min
		let y_range = y_max - y_min
		let margin = 0.05

		this.radius = t_range / 1000

		this.svg.setAttribute('viewBox', `${t_min - t_range * margin} ${y_min - y_range * margin} ${t_range * (1+2*margin)} ${y_range * (1+2*margin)}`)
	}

	_renderStep(t, y) {
		let pathString = ''
		t.forEach((_, i) => {
			if(i == 0) {
				pathString += `M ${t[0]} ${y[0]} `
			} else {
				pathString += `H ${t[i]} `
				pathString += `V ${y[i]} `
			}
		})

		this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		this.path.setAttribute('d', pathString)
		this.path.setAttribute('part', 'foreground')
		this.path.setAttribute('stroke-width', this.radius)
		this.svg.append(this.path)
	}

	_renderPoint(i, t, y) {
		if(this.points[i] === undefined) {
			const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
			point.setAttribute('part', 'foreground')
			point.setAttribute('r', this.radius)
			point.setAttribute('cx', t)
			point.setAttribute('cy', y)
			this.points.push(point)
			this.svg.append(point)
		} else {
			this.points[i].setAttribute('cy', y)
		}
		
	}
}

class Plot {

	points = []

	constructor(t, y, type) {
		this.t = t
		this.y = y
		this.type = type
	}

	render(visualizer) {
		console.log(this.t)
		switch (this.type) {
			case 'step':
				this._step(visualizer)
				break;
			case 'scatter':
				this._scatter(visualizer)
				break;
			default:
				this._plot(visualizer)
				break;
		}
	}

	erase() {
		this.points = []
		this.path = undefined
		this.group.remove()
	}

	_plot(visualizer) {
		let pathString = ''
		this.t.forEach((_, i) => {
			if(i == 0) {
				pathString += `M ${this.t[0]} ${this.y[0]} `
			} else {
				pathString += `L ${this.t[i]} ${this.y[i]} `
			}
		})

		if(this.path) {
			this.path.setAttribute('d', pathString)
		} else {
			this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
			this.group.setAttribute('stroke-width', visualizer.radius)
			
			this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
			this.path.setAttribute('d', pathString)
			this.path.setAttribute('part', 'foreground')
			this.group.append(this.path)
			visualizer.svg.append(this.group)
		}
	}

	_step(visualizer) {
		let pathString = ''
		this.t.forEach((_, i) => {
			if(i == 0) {
				pathString += `M ${this.t[0]} ${this.y[0]} `
			} else {
				pathString += `H ${this.t[i]} `
				pathString += `V ${this.y[i]} `
			}
		})

		if(this.path) {
			this.path.setAttribute('d', pathString)
		} else {
			this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
			this.path.setAttribute('d', pathString)
			this.path.setAttribute('part', 'foreground')
			this.path.setAttribute('stroke-width', visualizer.radius)
			visualizer.svg.append(this.path)
		}
	}

	_scatter(visualizer) {
		if(this.points[0] === undefined) {
			this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
			
			this.t.forEach((_, i) => {
				const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
				point.setAttribute('part', 'foreground')
				point.setAttribute('r', visualizer.radius)
				point.setAttribute('cx', this.t[i])
				point.setAttribute('cy', this.y[i])
				this.points.push(point)
				this.group.append(point)
			})
			visualizer.svg.append(this.group)
		} else {
			this.t.forEach((_, i) => {
				this.points[i].setAttribute('cx', this.t[i])
				this.points[i].setAttribute('cy', this.y[i])
			})
		}
	}

	set strokeWidth(width) {
		this.group.setAttribute('stroke-width', width)
	}

	set color(color) {
		this.group.setAttribute('stroke', color)
	}

	set r(radius) {
		this.points.forEach(point => {
			point.setAttribute('r', radius)
		})
	}

}

customElements.define('wave-visualizer', WaveVisualizer)
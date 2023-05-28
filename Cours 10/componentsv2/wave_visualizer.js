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
	isPlaying = false

	constructor() {
		super()
		let shadow 	= this.attachShadow({mode: 'open'})
		shadow.appendChild(template.content.cloneNode(true))
		this.svg = shadow.querySelector('svg')
		this.svg.addEventListener('click', this.playPause.bind(this))
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
	}

	playPause() {
		(this.isPlaying ? this.pause() : this.play())
		this.isPlaying = !this.isPlaying
	}

	play() {
		this.audioContext.resume()
	}

	pause() {
		this.audioContext.suspend()
	}

	load(y, sr) {
		if(this.source) {
			this.source.disconnect()
		}

		let buffer = this.audioContext.createBuffer(
			1,
			y.length,
			sr
		)

		const data = buffer.getChannelData(0)
		for (let i = 0; i < data.length; i++) {
			data[i] = y[i]
		}
		this.source = this.audioContext.createBufferSource()
		this.source.buffer = buffer
		this.source.start(0)
		this.source.connect(this.audioContext.destination)
		if (!this.isPlaying) {
			this.audioContext.suspend()
		}
	}

	plot(t, y, type='plot') {
		this.scale_t = 1000
		this.radius = 0.02
		let plot = new Plot(t, y, type, this)
		this.svg.setAttribute('viewBox', `0 -1.05 10 2.1`)
		// this._setViewbox(t, y)
		plot.render(this)
		this.plots.push(plot)
		return plot
	}

	_setViewbox(t, y) {
		let t_min = Math.min(...t)
		let t_max = Math.max(...t)
		let y_min = Math.min(...y)
		let y_max = Math.max(...y)

		let t_range = t_max - t_min
		let y_range = y_max - y_min
		let margin = 0.05
		
		// this.scale_t = 
		this.radius = t_range / 1000

		this.svg.setAttribute('viewBox', `${t_min - t_range * margin} ${y_min - y_range * margin} ${t_range * (1+2*margin)} ${y_range * (1+2*margin)}`)
	}
}

class Plot {

	points = []

	constructor(t, y, type, visualizer) {
		this.t = t
		this.y = y
		this.type = type
		this.visualizer = visualizer
	}

	render() {
		switch (this.type) {
			case 'step':
				this._step()
				break;
			case 'scatter':
				this._scatter()
				break;
			default:
				this._plot()
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
				pathString += `M ${this.t[0] * this.visualizer.scale_t} ${this.y[0]} `
			} else {
				pathString += `L ${this.t[i] * this.visualizer.scale_t} ${this.y[i]} `
			}
		})

		if(this.path) {
			this.path.setAttribute('d', pathString)
		} else {
			this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
			this.group.setAttribute('stroke-width', this.visualizer.radius)
			
			this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
			this.path.setAttribute('d', pathString)
			this.path.setAttribute('part', 'foreground')
			this.group.append(this.path)
			this.visualizer.svg.append(this.group)
		}
	}

	_step() {
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
			this.path.setAttribute('stroke-width', this.visualizer.radius)
			this.visualizer.svg.append(this.path)
		}
	}

	_scatter() {
		if(this.points[0] === undefined) {
			this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
			
			this.t.forEach((_, i) => {
				const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
				point.setAttribute('part', 'foreground')
				point.setAttribute('r', this.visualizer.radius)
				point.setAttribute('cx', this.visualizer.scale_t * this.t[i])
				point.setAttribute('cy', this.y[i])
				this.points.push(point)
				this.group.append(point)
			})
			this.visualizer.svg.append(this.group)
		} else {
			this.t.forEach((_, i) => {
				this.points[i].setAttribute('cx', this.visualizer.scale_t * this.t[i])
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
export default class BaseVisualizer extends HTMLElement {

    xMin = 0
    xMax = 0.02
    yMin = -1.05
    yMax = 1.05

    SR = 44100
    DURATION = 5

    isPlaying = false

    constructor() {
        super()
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.t = new Float32Array(this.DURATION * this.SR).fill().map((_, i) => i / this.SR)
        this.y = new Float32Array(this.DURATION * this.SR).fill(0)
    }

    load(y) {
        if(this.source) this.source.disconnect()

        let buffer = this.audioContext.createBuffer(1, y.length, this.SR)

        const data = buffer.getChannelData(0)
        for (let i = 0; i < data.length; i++) {
            data[i] = y[i]
        }
        this.source = this.audioContext.createBufferSource()
        this.source.buffer = buffer
        this.source.start(0)
        this.source.connect(this.audioContext.destination)
    }

    connectedCallback() {
        this.querySelector('svg').addEventListener('click', () => this.playPause())
    }

    playPause() {
        this.isPlaying ? this.audioContext.suspend() : this.audioContext.resume()
        this.isPlaying = !this.isPlaying
    }

    scale(point) {
        let xPerc = (point.x - this.xMin) / (this.xMax - this.xMin)
        let yPerc = (point.y - this.yMin) / (this.yMax - this.yMin)
        return {x: xPerc * this.svg.viewbox().width, y: this.svg.viewbox().height * (1 - yPerc)}
    }

    getPath(t, y) {
        return y.reduce(
            (acc, curr, k) => {
                let point = this.scale({x: t[k], y: curr})
                if(k == 0) return `M ${point.x} ${point.y} `
                return acc + `L ${point.x} ${point.y} `
            }, '')
    }
}
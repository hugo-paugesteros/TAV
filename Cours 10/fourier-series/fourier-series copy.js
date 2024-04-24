class FourierSeries extends HTMLElement {

    constructor() {
        super()
    }
    
    connectedCallback() {
        this.svg = SVG().addTo(this).viewbox(0, 0, 10, 2).viewrange(-0.5, 2, -2, 2)
        
        this.diameters = []
        this.circles = []
        let group = this.svg.group()
        let coords = this.svg.scale({x: 0, y: 0})

        for (let i = 1; i < 5; i++) {
            let k = 2 * i - 1
            let A = 4 / (k * Math.PI)
            this.diameters.push(A)
            let offset = this.diameters.slice(0, -1).reduce((acc, curr) => acc + curr/2, 0)

            this.circle = group.circle(A)
                .cx(coords.x + offset)
                .cy(coords.y)
                .css({fill: 'none'})
            group.line(coords.x + offset, coords.y, coords.x + offset + A/2, coords.y)
                .stroke({linecap: 'round'})
            let animatedur = (k == 1) ? 10000 : 5000
            group.animate(animatedur).ease('-').rotate(-360, coords.x + offset, coords.y).loop()

            group = group.group()
        }
        let t = new Array(1 * 1000).fill().map((_, i) => 0.5 + i / 1000)
        let y = t.map((t, _) => 
            this.diameters.reduce((acc, curr, k) => acc + curr * Math.sin(-2 * Math.PI * (k*2+1) * t), 0) 
        )
        let path = this.svg.getPath(t, y)
        this.svg.path().plot(path)

        this.point = this.svg.circle(.05).cx(0).cy(0)
        this.line  = this.svg.line(2,1,4,1)

        requestAnimationFrame((t) => this.update(t))
    }

    update(t) {
        if (this.zero === undefined) this.zero = t
        t = (t - this.zero)/10000
        let alpha = t - Math.floor(t)

        let x = this.diameters.reduce((acc, curr, k) => acc + curr/2 * Math.cos(2 * Math.PI * (k*2+1) * t), 0)
        let y = this.diameters.reduce((acc, curr, k) => acc + curr/2 * Math.sin(-2 * Math.PI * (k*2+1) * t), 0)
        this.point.cx(2 + x).cy(1 + y)
        this.line.plot(2 + x, 1 + y, 4 + alpha*4, 1 + y)

        requestAnimationFrame((t) => this.update(t))
    }

}

customElements.define('fourier-series', FourierSeries)
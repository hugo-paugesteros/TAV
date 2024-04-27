class SlidePair extends HTMLElement {

    k_bins = 5
    m_bins = 20

    window = [3, 1]
    lines = []

    constructor() {
        super()
    }

    connectedCallback() {
        this.svg = SVG().addTo(this).viewbox(0, 0, 10, 1).viewrange(-0.5, this.m_bins + .5, -0.5, this.k_bins + .5)

        this.range = document.createElement('input')
        this.range.setAttribute('type', 'range')
        this.range.setAttribute('value', '0')
        this.range.setAttribute('max', this.m_bins-this.frag_bins)

        this.appendChild(this.range)
        this._grid()
        this._populate()

        let origin = this.svg.scale({x: 0, y: 0})
        let point = this.svg.scale({x: this.window[0], y: 3*this.window[1]})
        this.rect = this.svg.rect(point.x - origin.x, origin.y - point.y).css({'fill': 'rgba(0,250,0,.1)', 'stroke': 'green'})

        this.update()
        this.range.addEventListener('input', () => this.update())
    }

    _grid() {
        for (let i = 0; i <= this.m_bins; i++) {
            let point1 = this.svg.scale({x: i, y: 0})
            let point2 = this.svg.scale({x: i, y: this.k_bins})
            this.svg.line(point1.x, point1.y, point2.x, point2.y)
        }
        for (let j = 0; j <= this.k_bins; j++) {
            let point1 = this.svg.scale({x: 0, y: j})
            let point2 = this.svg.scale({x: this.m_bins, y: j})
            this.svg.line(point1.x, point1.y, point2.x, point2.y)
        }
    }

    _populate() {
        this.data = []
        for (let i = 0; i < this.m_bins; i++) {
            for (let j = 0; j < this.k_bins; j++) {
                if (Math.random() < 0.3) {
                    let circle = this.svg.circle(.05)
                    .cx(this.svg.scale({x: i + 0.5}).x)
                    .cy(this.svg.scale({y: j + 0.5}).y)
                    this.data.push({x: i, y: j, circle: circle})
                }
            }
        }
        this.range.setAttribute('max', this.data.length - 1)
    }

    update() {
        let i = parseInt(this.range.value)
        let point1 = this.data[i]

        this.data.forEach((point) => point.circle.removeClass('current').removeClass('neigh'))
        this.lines.forEach((line) => line.removeClass('thick'))

        point1.circle.addClass('current')
        let point = this.svg.scale({x: point1.x + 1, y: point1.y + 2*this.window[1]})
        this.rect.animate().x(point.x).y(point.y)

        let color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`

        this.data.forEach((point2) => {
            if (
                point2.x - point1.x > 0 && 
                point2.x - point1.x <= this.window[0] &&
                Math.abs(point2.y - point1.y) <= this.window[1]
            ) {
                point2.circle.addClass('neigh')
                let scale1 = this.svg.scale({x: point1.x + 0.5, y: point1.y + 0.5})
                let scale2 = this.svg.scale({x: point2.x + 0.5, y: point2.y + 0.5})
                this.lines.push(this.svg.line(scale1.x, scale1.y, scale2.x, scale2.y).css({'stroke': color}).addClass('thin thick'))
            }
        })
    }
    
}

customElements.define('slide-pair', SlidePair)
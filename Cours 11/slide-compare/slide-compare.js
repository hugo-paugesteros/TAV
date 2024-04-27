class SlideCompare extends HTMLElement {

    k_bins = 5
    m_bins = 20
    frag_bins = 5

    constructor() {
        super()
    }

    connectedCallback() {
        this.songSvg = SVG().addTo(this).viewbox(0, 0, 10, 1).viewrange(-0.5, this.m_bins + .5, -0.5, this.k_bins + .5)
        this.fragSvg = SVG().addTo(this).viewbox(0, 0, 10, 1).viewrange(-0.5, this.m_bins + .5, -0.5, this.k_bins + .5)
        this.frag = this.fragSvg.group()
        this.range = document.createElement('input')
        this.range.setAttribute('type', 'range')
        this.range.setAttribute('value', '0')
        this.range.setAttribute('max', this.m_bins-this.frag_bins)

        this.appendChild(this.range)
        this._grid()
        this._grid_frag()
        this._populate()
        this._populate_frag()

        this.update()
        this.range.addEventListener('input', () => this.update())
    }

    _grid() {
        for (let i = 0; i <= this.m_bins; i++) {
            let point1 = this.songSvg.scale({x: i, y: 0})
            let point2 = this.songSvg.scale({x: i, y: this.k_bins})
            this.songSvg.line(point1.x, point1.y, point2.x, point2.y)
        }
        for (let j = 0; j <= this.k_bins; j++) {
            let point1 = this.songSvg.scale({x: 0, y: j})
            let point2 = this.songSvg.scale({x: this.m_bins, y: j})
            this.songSvg.line(point1.x, point1.y, point2.x, point2.y)
        }
    }

    _grid_frag() {
        for (let i = 0; i <= this.frag_bins; i++) {
            let point1 = this.fragSvg.scale({x: i, y: 0})
            let point2 = this.fragSvg.scale({x: i, y: this.k_bins})
            this.frag.line(point1.x, point1.y, point2.x, point2.y)
        }
        for (let j = 0; j <= this.k_bins; j++) {
            let point1 = this.fragSvg.scale({x: 0, y: j})
            let point2 = this.fragSvg.scale({x: this.frag_bins, y: j})
            this.frag.line(point1.x, point1.y, point2.x, point2.y)
        }
    }

    _populate() {
        this.data = []
        for (let i = 0; i < this.m_bins; i++) {
            for (let j = 0; j < this.k_bins; j++) {
                if (Math.random() < 0.3) {
                    let circle = this.songSvg.circle(.05)
                    .cx(this.songSvg.scale({x: i + 0.5}).x)
                    .cy(this.songSvg.scale({y: j + 0.5}).y)
                    this.data.push({x: i, y: j, circle: circle})
                }
            }
        }
    }

    _populate_frag() {
        this.frag_data = []
        this.data.forEach(point => {
            if (point.x > 4 & point.x <= 4 + this.frag_bins) {
                let circle = this.frag.circle(.05)
                    .cx(this.fragSvg.scale({x: point.x - 5 + 0.5}).x)
                    .cy(this.fragSvg.scale({y: point.y + 0.5}).y)
                this.frag_data.push({x: point.x - 5, y: point.y, circle: circle})
            }
        })
    }

    update() {
        let offset = parseInt(this.range.value)
        this.frag.animate().x(this.fragSvg.scale({x: offset}).x)

        this.data.forEach((point) => point.circle.removeClass('match'))
        this.frag_data.forEach((point) => point.circle.removeClass('match'))

        this.data.forEach((point) => {
            this.frag_data.forEach((fragPoint) => {
                if(fragPoint.x + offset == point.x && fragPoint.y == point.y) {
                    point.circle.addClass('match')
                    fragPoint.circle.addClass('match')
                }
            })
        })
    }
    
}

customElements.define('slide-compare', SlideCompare)
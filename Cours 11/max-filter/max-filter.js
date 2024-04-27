class MaxFilter extends HTMLElement {

    k_bins = 5
    m_bins = 20
    filter_size = [1, 1]

    constructor() {
        super()
    }

    connectedCallback() {
        this.svg = SVG().addTo(this).viewbox(0, 0, 10, 1).viewrange(-1.5, this.m_bins + 1.5, -1.5, this.k_bins + 1.5)

        this.range = document.createElement('input')
        this.range.setAttribute('type', 'range')
        this.range.setAttribute('value', '0')
        this.range.setAttribute('max', (this.m_bins) * (this.k_bins) - 1)

        this.appendChild(this.range)
        // this._grid()
        this._populate()
        
        let point1 = this.svg.scale({x: -this.filter_size[0], y: -this.filter_size[1]})
        let point2 = this.svg.scale({x: 1 + this.filter_size[0], y: 1 + this.filter_size[1]})
        this.filter = this.svg.rect(point2.x - point1.x, Math.abs(point2.y - point1.y)).css({'fill': 'rgba(255,0,0,.1)', 'stroke': 'red'})
        
        this.update()
        this.range.addEventListener('input', () => this.update())
    }

    _grid() {
        for (let i = 0; i <= this.m_bins; i++) {
            let point1 = this.songSvg.scale({x: i, y: 0})
            let point2 = this.songSvg.scale({x: i, y: this.k_bins})
            this.svg.line(point1.x, point1.y, point2.x, point2.y)
        }
        for (let j = 0; j <= this.k_bins; j++) {
            let point1 = this.songSvg.scale({x: 0, y: j})
            let point2 = this.songSvg.scale({x: this.m_bins, y: j})
            this.svg.line(point1.x, point1.y, point2.x, point2.y)
        }
    }

    _populate() {
        this.data = Array(this.m_bins)
        for (let i = 0; i < this.m_bins; i++) {
            this.data[i] = Array(this.k_bins)
            for (let j = 0; j < this.k_bins; j++) {
                let point1 = this.svg.scale({x: i, y: j})
                let point2 = this.svg.scale({x: i+1, y: j+1})
                let value = Math.floor(Math.random() * 255)
                let group = this.svg.group()
                let rect = group.rect(point2.x - point1.x, Math.abs(point2.y - point1.y)).x(point1.x).y(point2.y).css({'fill': 'none', 'stroke': 'white'})
                let text = group.text(value).x(point1.x + 0.23).y(point2.y - .04).attr({'dominant-baseline': 'middle', 'text-anchor': 'middle'}).font({size: 0.1})
                this.data[i][j] = {'value': value, 'text': text}
            }
        }
    }

    update() {
        let v = parseInt(this.range.value)
        let x = Math.floor(v / this.k_bins)
        let y = v % this.k_bins

        let point1 = this.svg.scale({x: x - this.filter_size[0], y: y - this.filter_size[1]})
        let point2 = this.svg.scale({x: x + 1 + this.filter_size[0], y: y + 1 + this.filter_size[1]})
        this.filter.animate().x(point1.x).y(point2.y)

        function checkMax() {
            for (let i = Math.max(0, x - this.filter_size[0]); i <= Math.min(this.m_bins-1, x + this.filter_size[0]); i++) {
                for (let j = Math.max(0, y - this.filter_size[1]); j <= Math.min(this.k_bins-1, y + this.filter_size[1]); j++) {
                    if (this.data[i][j].value > this.data[x][y].value) {
                        return false
                    }
                }
            }
            return true
        }

        if (checkMax.bind(this)()) {
            this.data[x][y].text.css({'stroke': 'red'})
        }
    }
    
}

customElements.define('max-filter', MaxFilter)
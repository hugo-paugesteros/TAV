const template = document.createElement('template')
template.innerHTML = `
    <span id="min"></span>
    <div>
        <input type="range">
        <output id="value"></output>
    </div>
    <span id="max"></span>

    <style>
        :host {
            display: flex;
            align-items: center;
        }

        span {
            margin: 0 1em;
            // line-height: 40px;
        }

        div {
            position: relative;
            input {
                margin: 0;
                display: block
            }
        }

        output {
            position: absolute;
            top: 25px;
            left: 50%;
            transform: translateX(-50%);
        }
    </style>
`

class InputRange extends HTMLElement {
    
    THUMB_SIZE = 19.8333

    constructor() {
        super()
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" })
        shadow.appendChild(template.content.cloneNode(true))

        this.inputRange = shadow.querySelector('input')
        this.rangeMin = shadow.querySelector('#min')
        this.rangeMax = shadow.querySelector('#max')
        this.rangeValue = shadow.querySelector('#value') 

        this.inputRange.addEventListener('input', () => this.update())

        this.inputRange.setAttribute('min', this.getAttribute('min'))
        this.inputRange.setAttribute('max', this.getAttribute('max'))
        this.inputRange.setAttribute('value', this.getAttribute('value'))
        this.inputRange.setAttribute('step', this.getAttribute('step'))

        this.rangeMin.textContent = this.inputRange.min
        this.rangeMax.textContent = this.inputRange.max

        this.update()
    }

    update() {
        this.value = this.inputRange.value
        this.rangeValue.textContent = this.inputRange.value
        let percentage = (this.inputRange.value - this.inputRange.min) / (this.inputRange.max - this.inputRange.min)
        // this.rangeValue.style.left = `calc(${percentage}% + (${10 - percentage * 0.2}px))`
        this.rangeValue.style.left = `calc(${percentage} * (100% - ${this.THUMB_SIZE}px) + ${this.THUMB_SIZE/2}px)`
    }

}

customElements.define('input-range', InputRange)
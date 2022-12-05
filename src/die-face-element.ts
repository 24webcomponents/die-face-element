const html = String.raw
/**
 * An example Custom Element. This documentation ends up in the
 * README so describe how this elements works here.
 *
 * You can event add examples on the element is used with Markdown.
 *
 * ```
 * <die-face></die-face>
 * ```
 */
class DieFaceElement extends HTMLElement {
  static observedAttributes = ['sides']

  #renderRoot!: ShadowRoot

  get sides() {
    return Number(this.getAttribute('sides')) || 6
  }

  set sides(value: number) {
    this.setAttribute('sides', `${value}`)
  }

  connectedCallback(): void {
    this.#renderRoot = this.attachShadow({mode: 'open'})
    this.#renderRoot.innerHTML = html`
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          width: 40px;
          aspect-ratio: 1;
          border: 2px solid grey;
          border-radius: 3px;
          text-align: center;
          user-select: none;
        }
        .roll {
          transition: text-indent 250ms;
          text-indent: -100px;
        }
      </style>
      <div></div>
    `
    this.addEventListener('click', () => this.roll())
  }

  roll() {
    const n = Math.floor(Math.random() * this.sides + 1)
    const el = this.#renderRoot.querySelector('div')
    if (!el) return
    el.addEventListener(
      'transitionend',
      () => {
        el.classList.remove('roll')
      },
      {once: true}
    )
    el.classList.add('roll')
    el.textContent = n
  }

  attributeChangedCallback() {
    this.roll()
  }
}

declare global {
  interface Window {
    DieFaceElement: typeof DieFaceElement
  }
}

export default DieFaceElement

if (!window.customElements.get('die-face')) {
  window.DieFaceElement = DieFaceElement
  window.customElements.define('die-face', DieFaceElement)
}

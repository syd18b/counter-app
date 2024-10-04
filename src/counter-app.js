import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class counterApp extends DDDSuper(LitElement) {
  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.title = "";
    this.min = 0;
    this.max = 10;
    this.count = 0;
  }

  static get properties() {
    return {
      min: { type: Number },
      max: { type: Number },
      count: { type: Number },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
          font-size: var(--counter-app-font-size, var(--ddd-font-size-s));
        }
        .count {
          font-size: 48px;
          margin-bottom: 16px;
        }
        button {
          padding: 8px 16px;
          margin: 0 8px; /* Space between buttons */
          font-size: 16px;
          cursor: pointer;
          border: none;
          border-radius: 4px;
          background-color: #00eaff;
          color: white;
          transition: background-color 0.3s;
        }
        button:hover,
        button:focus {
          background-color: #ad00b3; /* Darker on hover/focus */
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .highlight {
          color: #b3005a; /* Change color when hitting special values */
        }
        .limit {
          color: #5cb300; /* Color for min/max limits */
        }

        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }
        div {
          padding: 0;
          margin: 0;
        }
      `,
    ];
  }

  increment() {
    if (this.count < this.max) this.count++;
  }
  decrement() {
    if (this.count > this.min) {
      this.count--;
    }
  }
  updated(changedProperties) {
    if (changedProperties.has("count")) {
      if (this.count === 10) {
        this.makeItRain();
      }
    }
  }

  makeItRain() {
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        setTimeout(() => {
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      }
    );
  }

  render() {
    let counterClass = "";
    if (this.count === this.min || this.count === this.max) {
      counterClass = "limit"; // Change for min/max
    } else if (this.count === 3 || this.count === 9) {
      counterClass = "highlight"; // Change for specific values
    }
    return html`
      <confetti-container id="confetti">
        <div class="wrapper">
          <div class="count ${counterClass}">${this.count}</div>
          <!-- Counter display -->
          <button
            @click="${this.increment}"
            ?disabled="${this.count === this.max}"
          >
            +
          </button>
          <button
            @click="${this.decrement}"
            ?disabled="${this.count === this.min}"
          >
            -
          </button>
          <div>${this.title}</div>
          <slot></slot>
        </div>
      </confetti-container>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(counterApp.tag, counterApp);

import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

export interface Context {
  htmlProps: any
}

export type ReactElement =
  React.ReactElement<any>

export type WrapElement =
  (renderChildren: () => Promise<null | ReactElement>, context: Context) =>
    Promise<ReactElement>

export type WrapRender =
  (render: Function, context: Context) =>
    void

export interface Middleware {
  createElement?: WrapElement
  wrapClientRender?: WrapRender
  wrapServerRender?: WrapRender
}

export type Config = {
  loadContainer?: () => null | Element,
  renderToDOM?: (element: ReactElement | null, loadContainer: Element | null) => void
  renderToString?: (element: ReactElement) => string
}

async function createBase(renderChildren: null | (() => Promise<ReactElement>), context: Context) {
  const element = renderChildren && await renderChildren()

  class TuxBase extends React.Component<any, any> {
    static childContextTypes = {
      htmlProps: React.PropTypes.object.isRequired,
    }

    static propTypes = {
      context: React.PropTypes.object,
      children: React.PropTypes.node,
    }

    getChildContext() {
      return this.props.nextContext
    }

    render() {
      return element
    }
  }

  return Promise.resolve(React.createElement(TuxBase, { context }))
}

export class Tux {
  protected elementWrappers: Array<WrapElement> = []
  protected wrapClientRenderers: Array<WrapRender> = []
  protected wrapServerRenderers: Array<WrapRender> = []

  private config: Config
  private initialRender: boolean

  constructor(config: Config) {
    this.initialRender = true
    this.config = config
  }

  use(middleware: Middleware) {
    if (typeof middleware.createElement !== 'undefined') {
      this.elementWrappers.push(middleware.createElement)
    }

    if (typeof middleware.wrapClientRender !== 'undefined') {
      this.wrapClientRenderers.push(middleware.wrapClientRender)
    }

    if (typeof middleware.wrapServerRender !== 'undefined') {
      this.wrapServerRenderers.push(middleware.wrapServerRender)
    }

    return this
  }

  async startClient() {
    const { element, context } = await this.getElement()
    const { renderToDOM, loadContainer } = this.config

    if (typeof loadContainer !== 'function' || typeof renderToDOM !== 'function') {
      return
    }

    this.renderWrapper(this.wrapClientRenderers, context, () => {
      renderToDOM(element, loadContainer())
    })
  }

  async startServer() {
    const { element, context } = await this.getElement()
    const { renderToString } = this.config

    if (typeof renderToString !== 'function') {
      return
    }

    this.renderWrapper(this.wrapServerRenderers, context, () => {
      renderToString(element)
    })
  }

  async getElement(): Promise<{ element: ReactElement, context: Context }> {
    const context = { htmlProps: {} }
    const elementWrappers = [createBase, ...this.elementWrappers]

    let index = 0

    async function next(): Promise<any> {
      const createElement = elementWrappers[index]

      if (elementWrappers[index + 1] == null) {
        return createElement(() => Promise.resolve(null), context)
      }

      index += 1

      return createElement(await next, context)
    }

    const element = await next()

    return { element, context }
  }

  private renderWrapper(wrappers: Array<WrapRender>, context: Context, onComplete: () => void) {
    let index = 0

    function render() {
      const wrap = wrappers[index++]
      wrap(wrappers[index] == null ? onComplete : render, context)
    }

    render()
  }
}

export default function createTux(config?: Config) {
  return new Tux(Object.assign({
    loadContainer: () => null,
    renderToDOM: ReactDOM.render,
    renderToString: ReactDOMServer.renderToString,
  }, config || {}))
}

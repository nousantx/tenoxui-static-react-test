import { TenoxUI } from '@tenoxui/static'

export class TenoxUIEngine {
  constructor(config) {
    this.tenoxui = new TenoxUI(config)
    this.processedClasses = new Set()
    this.observer = null
    this.debounceTimer = null
  }

  initialize() {
    this.scanDocument() // intial scan of the document
    this.setupObserver() // set up mutation observer for dynamic changes
  }

  // process found classes
  processClasses(classNames) {
    const newClasses = classNames.filter((className) => !this.processedClasses.has(className))

    if (newClasses.length > 0) {
      // process new classes with TenoxUI
      this.tenoxui.processClassNames(newClasses.join(' '))

      // update stylesheet
      this.updateStylesheet()

      // add to processed classes
      newClasses.forEach((className) => this.processedClasses.add(className))
    }
  }
  // scan document for classes
  scanDocument() {
    const elements = document.querySelectorAll('*')
    const classNames = new Set()

    elements.forEach((element) => {
      if (element.classList.length) {
        element.classList.forEach((className) => {
          classNames.add(className)
        })
      }
    })

    this.processClasses(Array.from(classNames))
  }

  // set up mutation observer for dynamic content
  setupObserver() {
    this.observer = new MutationObserver((mutations) => {
      this.debounce(() => {
        const classNames = new Set()

        mutations.forEach((mutation) => {
          // handle added nodes
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // element node
              if (node.classList) {
                node.classList.forEach((className) => classNames.add(className))
              }
              // check children of added node
              node.querySelectorAll('*').forEach((element) => {
                if (element.classList) {
                  element.classList.forEach((className) => classNames.add(className))
                }
              })
            }
          })

          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const element = mutation.target
            element.classList.forEach((className) => classNames.add(className))
          }
        })

        this.processClasses(Array.from(classNames))
      }, 100)
    })

    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    })
  }

  debounce(func, wait) {
    clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(func, wait)
  }

  updateStylesheet() {
    const styleId = 'tenox-ui-styles'
    let styleElement = document.getElementById(styleId)

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    const stylesheet = this.tenoxui.generateStylesheet()
    styleElement.textContent = stylesheet
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
    clearTimeout(this.debounceTimer)
  }
}

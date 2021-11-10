import Compiler from '../Compiler'
import matchers from './matchers'
import treeBuilder from './treeBuilder'
import interpreter from './interpreter'
import documentBuilder from './documentBuilder'

class DataX {
  static compile (code) {
    return globalDataX.compile(code)
  }

  static parse (code, ctx) {
    return globalDataX.compile(code).execute(ctx)
  }

  static document (code) {
    return globalDataX.compile(code).document()
  }

  constructor (option) {
    const compiler = new Compiler(option)
    this.compile = (code) => compiler.compile(code)
  }
}


const globalDataX = new DataX({
  matchers,
  treeBuilder,
  documentBuilder,
  interpreter,
})

export default DataX

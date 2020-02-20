require('codemirror/mode/xml/xml')
require('codemirror/mode/javascript/javascript')

require('codemirror/addon/dialog/dialog.js')
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/tern/tern.js')
require('codemirror/addon/lint/lint.js')
require('../codemirror-addons-standard')

require('tern/plugin/commonjs.js')
require('tern/plugin/node.js')
require('tern/plugin/modules.js')
require('tern/plugin/es_modules.js')
require('tern/plugin/requirejs.js')
require('tern/plugin/doc_comment.js')
require('tern/plugin/complete_strings.js')

require('codemirror/mode/css/css')
require('codemirror/mode/htmlmixed/htmlmixed')

global.fastn = require('fastn')

global.tern = require('tern')
const code = require('./ecmascript.json')

const CodeMirror = require('codemirror/lib/codemirror')

const monacoElement = document.createElement('textarea')
monacoElement.innerHTML = [
  'function add (x, y) {',
  '  return x + y',
  '}',
  '',
  ''
].join('\n')

document.body.appendChild(monacoElement)

const editor = CodeMirror.fromTextArea(
  monacoElement,
  {
    lineNumbers: true,
    matchBrackets: true,
    mode: 'javascript',
    tabSize: 2,
    indentWithTabs: false,
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
    useWorker: false
  }
)

// const fastnData = require('../fastn/bundle.js')
// console.log(fastnData)

const server = new CodeMirror.TernServer({defs: [code], debug: true, plugins: {
  'modules': true, 
  'commonjs': true, 
  'doc_comments': true, 
  'complete_strings': true
}})
// server.addDoc('fastn.js', new CodeMirror.Doc(fastnData, 'javascript'))

editor.setOption('extraKeys', {
  'Ctrl-Space': function(cm) { server.complete(cm) },
  'Ctrl-I': function(cm) { server.showType(cm) },
  'Ctrl-O': function(cm) { server.showDocs(cm) },
  'Alt-.': function(cm) { server.jumpToDef(cm) },
  'Alt-,': function(cm) { server.jumpBack(cm) },
  'Ctrl-Q': function(cm) { server.rename(cm) },
  'Ctrl-.': function(cm) { server.selectName(cm) }
})
editor.on('cursorActivity', function(cm) { server.updateArgHints(cm) })

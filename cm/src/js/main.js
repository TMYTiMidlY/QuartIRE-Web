import '../scss/styles.scss';

// import Alert from 'bootstrap/js/dist/alert'

import { Tooltip, Toast, Popover } from 'bootstrap'

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(popover => {
    new Popover(popover)
  })

// const resizer = document.querySelector(".resizer");
const sidebar = document.querySelector("#sidebar");
const codemirror = document.querySelector("#codemirror");
const output = document.querySelector("#output");
// resizer.addEventListener("mousedown", (event) => {


var resizers = document.querySelectorAll('.resizer');
resizers[0].addEventListener("mousedown", (event) => {
  document.addEventListener("mousemove", resize_sidebar, false);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", resize_sidebar, false);
  }, false);
});

resizers[1].addEventListener("mousedown", (event) => {
  document.addEventListener("mousemove", resize_output, false);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", resize_output, false);
  }, false);
});


function resize_sidebar(event) {
  const size = `${event.x}px`;
  sidebar.style.flexBasis = size;
}
function resize_output(event) {
  const size = `${window.innerWidth - event.x}px`;
  console.log(size);
  output.style.flexBasis = size;
}

import { basicSetup, EditorView } from "codemirror"
import { EditorState, Compartment } from "@codemirror/state"
import { python } from "@codemirror/lang-python"
// import { markdown } from "@codemirror/lang-markdown"
// import { javascript } from "@codemirror/lang-javascript"

let language = new Compartment, tabSize = new Compartment


let view = new EditorView({
  state: EditorState.create({
    extensions: [
      basicSetup,
      language.of(python()),
      // tabSize.of(EditorState.tabSize.of(8))
    ]
  }),
  parent: codemirror
})
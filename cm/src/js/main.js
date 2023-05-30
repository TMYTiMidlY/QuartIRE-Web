"use strict";

import '../scss/styles.scss';
import 'bootstrap'
// import _ from 'lodash'
Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

Array.prototype.min = function () {
  return Math.min.apply(null, this);
};


// import Alert from 'bootstrap/js/dist/alert'

// import { Tooltip, Toast, Popover } from 'bootstrap'

// // Create an example popover
// document.querySelectorAll('[data-bs-toggle="popover"]')
//   .forEach(popover => {
//     new Popover(popover)
//   })

const sidebar = document.getElementById("sidebar");
const output = document.getElementById("output");
const cmContainer = document.getElementById("cmContainer");
const pdfContainer = document.getElementById("viewerContainer");
// const grammarly = document.querySelector("grammarly-editor-plugin");
const grammarly = document.getElementsByTagName("grammarly-editor-plugin");

var resizers = document.getElementsByClassName('resizer');
resizers[0].addEventListener("mousedown", (event) => {
  document.addEventListener("mousemove", resizeSidebar, false);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", resizeSidebar, false);
  }, false);
});

resizers[1].addEventListener("mousedown", (event) => {
  document.addEventListener("mousemove", resizeOutput, false);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", resizeOutput, false);
  }, false);
});


var sidebar_max_x = refresh_sidebar_max_x()
sidebar.style.flexBasis = sidebar_max_x + 'px';
for (const collapse of sidebar.getElementsByClassName('collapse')) {
  collapse.addEventListener('hidden.bs.collapse', (event) => {
    sidebar_max_x = refresh_sidebar_max_x();
    const size = Math.max(sidebar.style.flexBasis.slice(0, -2), sidebar_max_x);
    sidebar.style.flexBasis = size + 'px';
  })
  collapse.addEventListener('shown.bs.collapse', (event) => {
    sidebar_max_x = refresh_sidebar_max_x();
    const size = Math.max(sidebar.style.flexBasis.slice(0, -2), sidebar_max_x);
    sidebar.style.flexBasis = size + 'px';
  })
}


function refresh_sidebar_max_x() {
  let sidebar_x_array = [];
  for (const btn of sidebar.getElementsByClassName('btn-toggle')) {
    sidebar_x_array.push(btn.offsetLeft + btn.offsetWidth);
  }
  for (const link of sidebar.getElementsByClassName('link-dark rounded')) {
    sidebar_x_array.push(link.offsetLeft + link.offsetWidth);
  }
  return sidebar_x_array.max();
}

let isResizing = false;

function resizeSidebar(event) {
  if (!isResizing) {
    isResizing = true;
    window.requestAnimationFrame(() => {
      let x = Math.max(event.x, sidebar_max_x);
      sidebar.style.flexBasis = x + 'px';
      isResizing = false;
    });
  }
}

function resizeOutput(event) {
  if (!isResizing) {
    isResizing = true;
    window.requestAnimationFrame(() => {
      let x = window.innerWidth - Math.max(event.x, parseInt(sidebar.style.flexBasis.slice(0, -2)) + 150);
      output.style.flexBasis = x + 'px';
      pdfViewer.currentScaleValue = x / 830;
      // grammarly[0].style.setProperty('--grammarly-button-position-right', x + 50 + 'px');
      isResizing = false;
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const quantityTypeSelect = document.getElementById('id_quantity_type');
  const measureQtyFields = document.querySelectorAll('.measureqty-field');
  const targetQtyFields = document.querySelectorAll('.targetqty-field');

  const updateFieldsVisibility = () => {
    const quantityType = quantityTypeSelect.value;
    measureQtyFields.forEach(field => {
      field.style.display = quantityType === 'measureqty' ? 'block' : 'none';
    });
    targetQtyFields.forEach(field => {
      field.style.display = quantityType === 'targetqty' ? 'block' : 'none';
    });
  };

  updateFieldsVisibility();
  quantityTypeSelect.addEventListener('change', updateFieldsVisibility);
  
});

document.getElementById("submitQtyForm").addEventListener("click", function (event) {
  event.preventDefault();

  let form = document.getElementById("addQtyForm"); 
  let formData = new FormData(form);

  fetch(new_qty_url, {
    method: "POST",
    body: formData,
    credentials: "same-origin",
    headers: {
      "X-CSRFToken": "{{ csrf_token }}",
    },
  })
    .then((response) => {
      if (response.status === 201) {
        // Close the modal and refresh the page
        let modalElement = document.getElementById("addQtyModal");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        location.reload();
      } else {
        // Handle errors
        console.error("Error submitting the form.");
      }
    })
    .catch((error) => {
      console.error("Error submitting the form: ", error);
    });
});


// import { python } from "@codemirror/lang-python"
// import { markdown } from "@codemirror/lang-markdown"
// import { javascript } from "@codemirror/lang-javascript"

import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { init } from '@grammarly/editor-sdk'
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  StreamLanguage,
} from '@codemirror/language'
import { stex } from '@codemirror/legacy-modes/mode/stex'
import { autocompletion } from '@codemirror/autocomplete';
// import nativeSpelling from './native-spelling'
import { latexHint } from './latex-hint';
import doc from './doc.txt'


let view = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
      basicSetup,
      EditorView.contentAttributes.of({ spellcheck: 'true' }),
      EditorView.lineWrapping,
      EditorView.theme({
        // '.cm-content': {
        //   maxWidth: '50em',
        // },
        '.cm-scroller': {
          maxHeight: '95vh',
        },
      }),
      // StreamLanguage.define(stex),
      // syntaxHighlighting(defaultHighlightStyle),
      // // nativeSpelling(),
      // autocompletion({ override: [latexHint] }),
    ],
  }),
  parent: cmContainer,
})
view.dom.style.width = '100%'
// init('client_9m1fYK3MPQxwKsib5CxtpB').then((Grammarly) => {
//   Grammarly.withElement(view.contentDOM)
// })

// (async function () {
//   const pdfDocument = await loadingTask.promise;
//   // Document loaded, specifying document for the viewer and
//   // the (optional) linkService.
//   pdfViewer.setDocument(pdfDocument);

//   pdfLinkService.setDocument(pdfDocument, null);

// })();

//   pdfDocument.getPage(1).then((page) => {
//     pdfPageWidth = page.view[2]-page.view[0];
//   });
// console.log(pdfPageWidth)






import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';
import { basicSetup } from 'codemirror';


// The workerSrc property shall be specified.
// However, the 'pdfjs-dist/webpack' handle this.
//
// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "../../node_modules/pdfjs-dist/build/pdf.worker.js";

// Some PDFs need external cmaps.
//
const CMAP_URL = cmap_url;
const CMAP_PACKED = true;

const DEFAULT_URL = pdf_url;
// To test the AcroForm and/or scripting functionality, try e.g. this file:
// "../../test/pdfs/160F-2019.pdf"

const ENABLE_XFA = true;
const SEARCH_FOR = ""; // try "Mozilla";

const SANDBOX_BUNDLE_SRC = sandbox_src_url;

const eventBus = new pdfjsViewer.EventBus();

// (Optionally) enable hyperlinks within PDF files.
const pdfLinkService = new pdfjsViewer.PDFLinkService({
  eventBus,
});

// (Optionally) enable find controller.
const pdfFindController = new pdfjsViewer.PDFFindController({
  eventBus,
  linkService: pdfLinkService,
});

// (Optionally) enable scripting support.
const pdfScriptingManager = new pdfjsViewer.PDFScriptingManager({
  eventBus,
  sandboxBundleSrc: SANDBOX_BUNDLE_SRC,
});

const pdfViewer = new pdfjsViewer.PDFViewer({
  container: pdfContainer,
  eventBus,
  linkService: pdfLinkService,
  findController: pdfFindController,
  scriptingManager: pdfScriptingManager,
  removePageBorders: true,
});
pdfLinkService.setViewer(pdfViewer);
pdfScriptingManager.setViewer(pdfViewer);

eventBus.on("pagesinit", function () {
  // We can use pdfViewer now, e.g. let's change default scale.
  // pdfViewer.currentScaleValue = "page-width";
  pdfViewer.currentScaleValue = 0.8;

  // We can try searching for things.
  if (SEARCH_FOR) {
    eventBus.dispatch("find", { type: "", query: SEARCH_FOR });
  }
});

// Loading document.
const loadingTask = pdfjsLib.getDocument({
  url: DEFAULT_URL,
  cMapUrl: CMAP_URL,
  cMapPacked: CMAP_PACKED,
  enableXfa: ENABLE_XFA,
});
loadingTask.promise.then((pdfDocument) => {
  pdfViewer.setDocument(pdfDocument);

  pdfLinkService.setDocument(pdfDocument, null);

  pdfDocument.getPage(1).then((page) => {
    // var viewport = page.getViewport({ scale: 1.0, });
    // console.log(viewport.width, viewport.height)
    // console.log(page.view[2] - page.view[0]);

  });
});
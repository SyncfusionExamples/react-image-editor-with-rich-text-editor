import './App.css';
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar, NodeSelection  } from '@syncfusion/ej2-react-richtexteditor';
import * as React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { ImageEditorComponent } from '@syncfusion/ej2-react-image-editor';

function App() {
  const dlgButtons = [
    {
      buttonModel: { content: 'Insert', isPrimary: true },
      click: onInsert.bind(this),
    },
    { buttonModel: { content: 'Cancel' }, click: onCancel },
  ];

  const selection = new NodeSelection();
  const header = 'Image Editor';
  var dialogObj;
  var imageEditorObj;
  var rteObj;
  var range;
  var saveSelection;
  const quickToolbarSettings = {
    image: [
      'Replace',
      'Align',
      'Caption',
      'Remove',      
      '-',
      'InsertLink',
      'OpenImageLink',
      'EditImageLink',
      'RemoveImageLink',
      'Display',
      'AltText',
      {
        tooltipText: 'Image Editor',
        template:
          '<button class="e-tbar-btn e-btn" id="imageEditor"><span class="e-btn-icon e-icons e-rte-image-editor"></span>',
      },
    ],
  };

  function onInsert() {
    if (rteObj.formatter.getUndoRedoStack().length === 0) {
      rteObj.formatter.saveData();
    }
    saveSelection.restore();
    var canvas = document.createElement(
      'CANVAS'
    );
    var ctx = canvas.getContext('2d');
    const imgData = imageEditorObj.getImageData();
    canvas.height =imgData.height;
    canvas.width = imgData.width;
    ctx.putImageData(imgData, 0,0);
    rteObj.executeCommand("editImage", { url: canvas.toDataURL(), width:{width: canvas.width}, height:{height:canvas.height}, selection: saveSelection });
    rteObj.formatter.saveData();
    rteObj.formatter.enableUndo(rteObj);
    dialogObj.hide();
  }

  function onCancel() {
    dialogObj.hide();
  }

  function onToolbarClick(args) {
    if (args.item.tooltipText === 'Image Editor') {
      range = selection.getRange(document);
      saveSelection = selection.save(range, document);
      dialogObj.show();
    }
  }

  function toDataURL(url, callback) {
    let xhRequest = new XMLHttpRequest();
    xhRequest.onload = function () {
      let reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhRequest.response);
    };
    xhRequest.open('GET', url);
    xhRequest.responseType = 'blob';
    xhRequest.send();
  }

  function OnBeforeOpen() {
    var imageELement;
    var selectNodes = rteObj.formatter.editorManager.nodeSelection.getNodeCollection(range);
    if(selectNodes.length==1&& selectNodes[0].tagName=="IMG")
    {
      imageELement = selectNodes[0];
      toDataURL(imageELement.src,(a)=>{
        imageEditorObj.open(a);
      })
        
    }
  }

  return (
    <div>
      <RichTextEditorComponent
        id="rteImageEditor"
        ref={(scope) => {
          rteObj = scope;
        }}
        quickToolbarSettings={quickToolbarSettings}
        toolbarClick= {onToolbarClick}>
        <p>
          Integrating an image editor with a React Rich Text Editor can be achieved by using a library such as React-Image-Editor. 
          <img
            id="img1"
            style={{ height: 350 }}
           src="https://ej2.syncfusion.com/demos/src/image-editor/images/bridge.png"
          ></img>
        </p>
        <p>This library provides an easy-to-use API that allows developers to quickly and easily add an image editor to their React Rich Text Editor. It provides a variety of features, including image cropping, resizing, rotation, and more. Additionally, it supports a wide range of image formats, including JPEG, PNG, and GIF. With the help of this library, developers can easily add an image editor to their React Rich Text Editor, allowing users to customize the images they include in their documents.</p>
        <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
      </RichTextEditorComponent>

      <DialogComponent
        id="ImageEditorDialog"
        ref={(scope) => {
          dialogObj = scope;
        }}
        buttons={dlgButtons}
        beforeOpen={OnBeforeOpen}
        header={header}
        visible={false}
        showCloseIcon={true}
        width="800px"
        height="800px"
        isModal={true}
      >
        <div className="dialogContent">
          <ImageEditorComponent
            height="335px"
            ref={(scope) => {
              imageEditorObj = scope;
            }}
          />
        </div>
      </DialogComponent>
    </div>
  );
}

export default App;

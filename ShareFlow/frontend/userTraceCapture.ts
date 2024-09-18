/**
 * Copyright (c) 2024, Centre for Learning Analytics at Monash (CoLAM). 
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, 
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, 
 *    this list of conditions and the following disclaimer in the documentation 
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE 
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
 */


// This file defines the events for capturing and tracking user interactions
// from the front end.
// You should replace the outer libraries with your project's libraries when
// using this file.

import {
  getXPath,
  getCustomsContainingNode,
  sendMessage
} from "outerlibraries";
  
type Destroyable = {
  destroy(): void;
};

class UserEvent implements Destroyable {
  private _element: HTMLElement | Window;
  private _event: string;
  private _handler: (e: Event) => void;

  constructor(element: HTMLElement | Window, event: string, handler: (e: Event) => void) {
    this._element = element;
    this._event = event;
    this._handler = handler;

    this._element.addEventListener(this._event, this._handler);
  }

  destroy(): void {
    this._element.removeEventListener(this._event, this._handler);
  }
}
  
const destroyables = [] as Destroyable[];
let lastEvent : {
  type: string,
  timeStamp: number,
  scrollX?: number,
  scrollY?: number,
  tagName?: string,
  xpath?: string,
  name?: string,
  value?: string,
  code?: string,
  key?: string,
} = {type: 'initial', timeStamp: 0};
let lastSelectEvent = '';
let _lastScrollEvent: {timeStamp: number, scrollX: number, scrollY: number} | null = null;

let enableCapture = false;

function navigate() {
  sendMessage({
    messageType: 'TraceData',
    type: 'navigate',
    tagName: 'Navigate',
    textContent: '',
    interactionContext: '',
    xpath: '',
    eventSource: 'RESOURCE PAGE',
    width: window.innerWidth,
    height: window.innerHeight,
    enableCapture: enableCapture,
  });
}

function getParentDiv(element: HTMLElement | null): HTMLElement | null {
  while (element && element.nodeName.toLowerCase() !== 'div') {
    element = element.parentElement;
  }
  return element; // This will return null if no <div> is found
}

function registerListeners() {
  const clickEvent = new UserEvent(document.body, 'pointerdown', async (event) => {
    const _event = event as PointerEvent;
    const _target = _event.target;
    let parent_target: HTMLDivElement | null = null;
    let orgin_tag = '';

    if (_target instanceof HTMLInputElement) {
      let name = _target.innerText;
      if (_target.labels && _target.labels.length) {\
        name = _target.labels[0].innerText;
      }
      if ((!name || name === '') && _target.textContent){
        name = _target.textContent;
      }
      sendMessage({
        messageType: 'TraceData',
        type: 'click',
        clientX: _event.clientX,
        clientY: _event.clientY,
        tagName: _target.tagName,
        textContent: _target.textContent,
        interactionContext: JSON.stringify({
          type: _target.type,
          name: name,
          value: _target.value,
          inner_text: _target.innerText,
          placeholder: _target.placeholder,
        }),
        xpath: getXPath(_target),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    } else if (_target instanceof HTMLSpanElement) {
      sendMessage({
        messageType: 'TraceData',
        type: 'click',
        clientX: _event.clientX,
        clientY: _event.clientY,
        tagName: _target.tagName,
        textContent: _target.textContent,
        interactionContext: JSON.stringify({name: _target.textContent, inner_text: _target.innerText}),
        xpath: getXPath(_target),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    } else if (_target instanceof HTMLSelectElement) {
      if (_target.labels && _target.labels.length) {
        sendMessage({
          messageType: 'TraceData',
          type: 'click',
          clientX: _event.clientX,
          clientY: _event.clientY,
          tagName: _target.tagName,
          textContent: _target.textContent,
          interactionContext: JSON.stringify({
            type: _target.type,
            name: _target.labels[0].innerText,
            value: _target.options[_target.selectedIndex].innerText,
            inner_text: _target.innerText
          }),
          xpath: getXPath(_target),
          eventSource: 'MOUSE',
          width: window.innerWidth,
          height: window.innerHeight,
          enableCapture: enableCapture,
        });
      } else if (_target.options && _target.options.length) {
        sendMessage({
          messageType: 'TraceData',
          type: 'click',
          clientX: _event.clientX,
          clientY: _event.clientY,
          tagName: _target.tagName,
          textContent: _target.textContent,
          interactionContext: JSON.stringify({
            type: _target.type,
            name: _target.options[0].innerText,
            value: _target.options[_target.selectedIndex].innerText,
            inner_text: _target.innerText
          }),
          xpath: getXPath(_target),
          eventSource: 'MOUSE',
          width: window.innerWidth,
          height: window.innerHeight,
          enableCapture: enableCapture,
        });
      }
    } else if (_target instanceof HTMLAnchorElement) {
      sendMessage({
        messageType: 'TraceData',
        type: 'click',
        clientX: _event.clientX,
        clientY: _event.clientY,
        tagName: _target.tagName,
        textContent: _target.innerText,
        interactionContext: JSON.stringify({
          type: _target.type,
          name: _target.innerText,
          value: _target.href,
          inner_text: _target.innerText,
          text_content: _target.textContent
        }),
        xpath: getXPath(_target),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    } else if (_target instanceof HTMLButtonElement) {
      sendMessage({
        messageType: 'TraceData',
        type: 'click',
        clientX: _event.clientX,
        clientY: _event.clientY,
        tagName: _target.tagName,
        textContent: _target.textContent,
        interactionContext: JSON.stringify({
          type: _target.type,
          name: _target.textContent,
          value: _target.innerText,
          inner_text: _target.innerText
        }),
        xpath: getXPath(_target),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    } else if (_target instanceof SVGElement) {
      orgin_tag = 'svg';
      parent_target = _target.parentElement as HTMLDivElement;
      while (parent_target && parent_target.nodeName.toLowerCase() !== 'div') {
        parent_target = parent_target.parentElement as HTMLDivElement;
      }
      if (!parent_target.innerText || parent_target.innerText === '') {
        let whatWeWant = null;
        let nextSibling = parent_target.nextElementSibling;
        while (nextSibling) {
          if (nextSibling instanceof HTMLDivElement && nextSibling.innerText && nextSibling.innerText !== '') {
            whatWeWant = nextSibling;
            break;
          }
          nextSibling = nextSibling.nextElementSibling;
        }

        let previousSibling = whatWeWant? null : parent_target.previousElementSibling; // no need to find
        while (previousSibling) {
          if (previousSibling instanceof HTMLDivElement && previousSibling.innerText && previousSibling.innerText !== '') {
            whatWeWant = previousSibling;
            break;
          }
          previousSibling = previousSibling.nextElementSibling;
        }

        if (whatWeWant) {
          parent_target = whatWeWant;
        }
      }

    } else if (_target instanceof HTMLElement) {
      if (_target.innerText || _target.textContent) {
        sendMessage({
          messageType: 'TraceData',
          type: 'click',
          clientX: _event.clientX,
          clientY: _event.clientY,
          tagName: _target.tagName,
          textContent: _target.textContent,
          interactionContext: JSON.stringify({
            name: _target.textContent,
            value: _target.innerText,
            inner_text: _target.innerText
          }),
          xpath: getXPath(_target),
          eventSource: 'MOUSE',
          width: window.innerWidth,
          height: window.innerHeight,
          enableCapture: enableCapture,
        });
      }
      else {
        orgin_tag = _target.tagName;
        parent_target = getParentDiv(_target) as HTMLDivElement;
      }
    }

    if (parent_target && parent_target instanceof HTMLDivElement) {
      sendMessage({
        messageType: 'TraceData',
        type: 'click',
        clientX: _event.clientX,
        clientY: _event.clientY,
        tagName: parent_target.tagName,
        textContent: parent_target.textContent,
        interactionContext: JSON.stringify({
          title: parent_target.title,
          name:parent_target.role,
          value: parent_target.textContent,
          inner_text: parent_target.innerText,
          origin: orgin_tag,
        }),
        xpath: getXPath(parent_target),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    }
    lastPointerdownEvent = {type: _event.type, timeStamp: _event.timeStamp, clientX: _event.clientX, clientY: _event.clientY};
  })
  destroyables.push(clickEvent)

  const mousedownEvent = new UserEvent(document.body, 'submit', (event) => {
    const _event = event as SubmitEvent;
    const submitter = _event.submitter;
    if (submitter instanceof HTMLInputElement ) {
      sendMessage({
        messageType: 'TraceData',
        type: 'submit',
        tagName: submitter.tagName,
        textContent: submitter.value,
        interactionContext: JSON.stringify({name: submitter.name, value: submitter.value}),
        xpath: getXPath(submitter),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    }
  })
  destroyables.push(mousedownEvent);

  const mouseoverEvent = new UserEvent(document.body, 'mouseover', (event) => {
    const _event = event as MouseEvent;
    const tags = getCustomsContainingNode(_event.target as Element);
    if (tags.length) {
      tags.map(tag => {
        sendMessage({
          messageType: 'TraceData',
          type: _event.type,
          clientX: _event.clientX,
          clientY: _event.clientY,
          tagName: 'ADDTIONAL_KNOWLEDGE',
          textContent: (_event.target as Node).textContent ?? '',
          interactionContext: (_event.target as HTMLElement).innerText ?? (_event.target as Node).nodeType ?? '',
          xpath: getXPath(_event.target as HTMLElement),
          eventSource: 'MOUSE',
          width: window.innerWidth,
          height: window.innerHeight,
          enableCapture: enableCapture,
        });
      })
    }
    lastEvent = {type: _event.type, timeStamp: _event.timeStamp};
  })
  destroyables.push(mouseoverEvent);

  const selectEvent = new UserEvent(document.body, 'mouseup', (event) => {
    const selection = document.getSelection();
    const _event = event as PointerEvent;
    const selected = selection && selection.toString().trim() !== '';
    const current = selected ? selection.toString().trim() : ''

    if (selected && (lastSelectEvent != current)) {
      lastSelectEvent = current;
      sendMessage({
        messageType: 'TraceData',
        type: 'select',
        clientX: _event.clientX,
        clientY: _event.clientY,
        tagName: (_event.target as Element).tagName ?? (_event.target as Node).nodeName ?? '',
        textContent: selection.toString(),
        interactionContext: '',
        xpath: _event.target? getXPath(_event.target as Element) : '',
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    }
    lastEvent = {type: event.type, timeStamp: _event.timeStamp};
  })
  destroyables.push(selectEvent);

  const dropEvent = new UserEvent(document.body, 'drop', (event) => {
    const _event = event as DragEvent;
    const _target = event.target;

    if (_target instanceof HTMLInputElement) {
      let name = _target.name;
      if (_target.labels && _target.labels[0]) {
        name = _target.labels[0].innerText;
      }
      sendMessage({
        messageType: 'TraceData',
        type: event.type,
        xpath: getXPath(_target),
        tagName: 'INPUT',
        textContent: _target.value,
        interactionContext: JSON.stringify({type: _target.type, name: name, value: _target.value, inner_text: _target.innerText}),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    } else if (_target instanceof HTMLDivElement) {
      sendMessage({
        messageType: 'TraceData',
        type: 'click',
        clientX: _event.clientX,
        clientY: _event.clientY,
        tagName: _target.tagName,
        textContent: _target.textContent,
        interactionContext: JSON.stringify({
          title: _target.title,
          name:_target.role,
          value: _target.textContent,
          inner_text: _target.innerText,
        }),
        xpath: getXPath(_target),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    } else {
      sendMessage({
        messageType: 'TraceData',
        type: _event.type,
        clientX: _event.clientX,
        clientY: _event.clientY,
        tagName: (_event.target as Element).tagName ?? (_event.target as Node).nodeName ?? '',
        textContent: (_event.target as Text).data ?? (_event.target as Element).outerHTML ?? '',
        xpath: _event.target? getXPath(_event.target as Element) : '',
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    lastEvent = {type: event.type, timeStamp: _event.timeStamp};
    })
    destroyables.push(dropEvent);

  const scrollEvent = new UserEvent(window, 'scroll', (event) => {
    if (!_lastScrollEvent) {
      _lastScrollEvent = {timeStamp: event.timeStamp, scrollX: window.scrollX, scrollY: window.scrollY}
    }
    if (event.timeStamp - _lastScrollEvent.timeStamp > 20) {
      const _diffX = window.scrollX - _lastScrollEvent.scrollX;
      const _diffY = window.scrollY - _lastScrollEvent.scrollY;
      sendMessage({
        messageType: 'TraceData',
        type: event.type,
        diffX: _diffX,
        diffY: _diffY,
        diffTimeStamp: event.timeStamp - _lastScrollEvent.timeStamp,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        tagName: 'Window',
        xpath: '',
        interactionContext: JSON.stringify({diffX: _diffX, diffY: _diffY, diffTimeStamp:event.timeStamp - _lastScrollEvent.timeStamp,}),
        textContent: (
          _diffY < 0? 'SCROLL UP' : _diffY > 0? 'SCROLL DOWN': '') +
          (_diffX < 0? 'SCROLL LEFT' : _diffX > 0? ':SCROLL RIGHT': ''),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    }
    _lastScrollEvent = {
      timeStamp: event.timeStamp,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
    lastEvent = {type: event.type, timeStamp: event.timeStamp, scrollX: window.scrollX, scrollY: window.scrollY};
  })
  destroyables.push(scrollEvent);

  const pasteEvent = new UserEvent(window, "paste", (event) => {
    const _event = event as ClipboardEvent;
    const _target = _event.target;
    if (_target instanceof HTMLTextAreaElement) {
      let name = 'Textarea';
      if (_target.labels && _target.labels[0]) {
        name = _target.labels[0].innerText;
      }
      let value = _target.value;
      sendMessage({
        messageType: 'TraceData',
        type: event.type,
        xpath: getXPath(_target),
        tagName: 'TEXTAREA',
        textContent: value,
        interactionContext: JSON.stringify({type: _target.type, name: name, value: value}),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    } else if (_target instanceof HTMLInputElement) {
      let name = _target.name;
      if (_target.labels && _target.labels[0]) {
        name = _target.labels[0].innerText;
      }
      sendMessage({
        messageType: 'TraceData',
        type: event.type,
        xpath: getXPath(_target),
        tagName: 'INPUT',
        textContent: _target.value,
        interactionContext: JSON.stringify({type: _target.type, name: name, value: _target.value}),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    }
  });
  destroyables.push(pasteEvent)

  const changeEvent = new UserEvent(window, "change", (event) => {
    const _target = event.target;
    if (_target instanceof HTMLInputElement) {
      let name = _target.name;
      if (_target.labels && _target.labels[0]) {
        name = _target.labels[0].innerText;
      }
      if (_target.type == "checkbox") {
        sendMessage({
          messageType: 'TraceData',
          type: event.type,
          xpath: getXPath(_target),
          tagName: 'INPUT',
          textContent: _target.checked,
          interactionContext: JSON.stringify({type: _target.type, name: name, value: _target.checked}),
          eventSource: 'MOUSE',
          width: window.innerWidth,
          height: window.innerHeight,
          enableCapture: enableCapture,
        });
      }
      else {
        sendMessage({
          messageType: 'TraceData',
          type: event.type,
          xpath: getXPath(_target),
          tagName: 'INPUT',
          textContent: _target.value,
          interactionContext: JSON.stringify({type: _target.type, name: name, value: _target.value}),
          eventSource: 'MOUSE',
          width: window.innerWidth,
          height: window.innerHeight,
          enableCapture: enableCapture,
        });
      }
    } else if (_target instanceof HTMLSelectElement) {
      sendMessage({
        messageType: 'TraceData',
        type: event.type,
        xpath: getXPath(_target)?? '',
        tagName: 'SELECT',
        textContent: _target.value,
        interactionContext: JSON.stringify({type: _target.type, name: _target.labels[0].innerText, value: _target.options[_target.selectedIndex].innerText}),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
      });
    } else if (_target instanceof HTMLTextAreaElement) {
      let name = 'Textarea';
      let value = _target.value;
      if (_target.labels && _target.labels[0]) {
        name = _target.labels[0].innerText;
      }
      sendMessage({
        messageType: 'TraceData',
        type: event.type,
        xpath: getXPath(_target),
        tagName: 'TEXTAREA',
        textContent: value,
        interactionContext: JSON.stringify({type: _target.type, name: name, value: value}),
        eventSource: 'MOUSE',
        width: window.innerWidth,
        height: window.innerHeight,
        enableCapture: enableCapture,
        shouldCapture: true,
      });
    }
  });
  destroyables.push(changeEvent)

  const keyupEvent = new UserEvent(document.body, 'keyup', (event) => {
    const _event = event as KeyboardEvent;

    let value = '';
    let name = null;

    if (_event.target instanceof HTMLInputElement) {
      value = _event.target.value;
      name = _event.target.name;
    } else if (_event.target instanceof HTMLTextAreaElement) {
      value = _event.target.innerText;
    } else if (_event.target instanceof HTMLDivElement){
      value = _event.target.innerText;
    } else {
      name = (_event.target as HTMLElement).nodeName;
      value = (_event.target as HTMLElement).innerText;
    }

    sendMessage({
      messageType: 'TraceData',
      type: event.type,
      code: _event.code,
      key: _event.key,
      xpath: _event.target? getXPath(_event.target as Element) : '',
      tagName: (_event.target as Node).nodeName ?? '',
      textContent: _event.code,
      interactionContext: JSON.stringify({code: _event.code,key: _event.key, name:name, value:value}),
      eventSource: 'KEYBOARD',
      width: window.innerWidth,
      height: window.innerHeight,
      enableCapture: enableCapture,
    });
    lastEvent = {
      type: event.type,
      timeStamp: event.timeStamp,
      tagName: (_event.target as Node).nodeName ?? '',
      code: _event.code,
      key: _event.key,
      xpath: _event.target? getXPath(_event.target as Element) : '',
      name: name?? undefined,
      value: value,
    };
  })
  destroyables.push(keyupEvent)

  const beforeunloadEvent = new UserEvent(window, 'beforeunload', (event) => {
    sendMessage({
      messageType: 'TraceData',
      type: event.type,
      tagName: 'CLOSE',
      textContent: '',
      interactionContext: '',
      xpath: '',
      eventSource: 'RESOURCE PAGE',
      width: window.innerWidth,
      height: window.innerHeight,
      enableCapture: enableCapture,
    });
    lastEvent = {type: event.type, timeStamp: event.timeStamp};
  })
  destroyables.push(beforeunloadEvent)
}

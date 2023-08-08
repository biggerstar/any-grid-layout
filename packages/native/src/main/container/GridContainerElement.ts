export class GridContainerElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    console.log('Custom square element added to page.');
    console.log(this);


  }

  disconnectedCallback() {
    console.log(22222222222222222222);
    console.log('Custom square element removed from page.');
  }

  adoptedCallback() {
    console.log(33333333333333333333333);
    console.log('Custom square element moved to new page.');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log(name,oldValue,newValue);
    console.log('Custom square element attributes changed.');
  }


}



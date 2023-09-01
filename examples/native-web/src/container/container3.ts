import {Container} from "@biggerstar/layout";
import {layoutData} from "@/stores/layout";

const container3 = new Container({
  el: '#container3',
  // el: document.getElementById('container'),
  layouts: {
    from: '来自layout2',
    ratioCol: 0.1,
    col: 9,
    row: 39,
    margin: [10, 10],
    size: [60, 50],
    minCol: 2,
    exchange: true,
    items: layoutData,
    // items: layoutData11,
    responsive: true,
    edit: true,
    animation: true,
    follow: true,
  },
  events: {
    // error(type){
    //     // console.log(type);
    // },
  },
})

export default container3

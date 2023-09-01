import {Container} from "@biggerstar/layout";
import {layoutData} from "@/stores/layout";

const container4 = new Container({
  el: '#container4',
  // el: document.getElementById('container'),
  layouts: {
    from: '来自layout3',
    ratioCol: 0.1,
    // col: 6,
    row: 6,
    margin: [10, 10],
    size: [50, 50],
    // minCol: 2,
    // maxCol: 6,
    exchange: true,
    responsive: true,
    items: layoutData,
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
export default container4

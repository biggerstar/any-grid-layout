import GridItem from '@/components/GridItem.vue';
import GridContainer from '@/components/GridContainer.vue';
import GridItemLoader from '@/components/GridItemLoader.vue';

const Components = {
    GridContainer,
    GridItem,
    GridItemLoader
}
export {
    GridContainer,
    GridItem,
    GridItemLoader
}


export const install = (app) =>{
    if (install.installed) return
    install.installed = true
    Object.keys(Components).forEach(name => app.component(name, Components[name]));
    // registerDirective(app)
}

const registerDirective = (app) => {
    app.directive('grid', {
        created: (el, binding, vNode, oldVNode) => {
            // console.log('绑定指令成功');
            // el.addEventListener('click',function(){
            //     console.log(el, binding.value)
            // })
            // console.log(binding.value,vNode);
        }
    })
}

export default {
    install
}

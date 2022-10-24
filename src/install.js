import GridItem from '@/components/GridItem.vue';
import GridContainer from '@/components/GridContainer.vue';


const Components = {
    GridContainer,
    GridItem
}

export function install(app) {
    // console.log(app);
    if (install.installed) return;
    install.installed = true;
    Object.keys(Components).forEach(name => app.component(name, Components[name]));
    registerDirective(app)
}
const registerDirective = (app)=>{
    app.directive('grid',{
        created:function(el, binding, vNode, oldVNode){
            console.log('绑定指令成功');
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

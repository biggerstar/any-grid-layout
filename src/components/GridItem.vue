<template>
  <div class="grid-item"  :style="genGridItemStyle()" draggable="true" >
    <slot></slot>
  </div>
</template>
<!--@load = 'initContainerItem($event)'-->
<script setup>
const props = defineProps(['itemData'])
const gridItemData = props.itemData
// console.log(gridItemData);

const genGridItemStyle = () => {
  return {
    // gridArea: ` span ${ gridItemData.h} / span ${ gridItemData.w}`
    // width: gridItemData.w * 100 + 'px',
    // height: gridItemData.h * 100 + 'px',
    // width: '100px',
    // height:'100px',
    // gridColumn: `${gridItemData.x } / span ${ gridItemData.w }`,
    // gridRow: `${ gridItemData.y } / span ${ gridItemData.h}`,
    gridColumn: `${ gridItemData.xStart } / span ${ gridItemData.w }`,
    gridRow: `${ gridItemData.yStart } / span ${ gridItemData.h}`,
    // gridArea: 'a' +  gridItemData.i
    // gridArea: ` span ${ gridItemData.h} / span ${ gridItemData.w}`
  }
}


</script>
<style>
/*.item0 {*/
/*  !*grid-row: 0 / span 3 !important;*!*/
/*  !*grid-column: 0 / span 3 !important;*!*/
/*  grid-row: 1 / span 2;*/
/*  grid-column: 1 / span 2;*/
/*}*/
/*.item1 {*/
/*  grid-row:    span 5;*/
/*  grid-column:  span 3;*/
/*}*/
/*.item15 {*/
/*  grid-row: 6 /  span 3;*/
/*  grid-column: 2 / span 5;*/
/*}*/
</style>

<style scoped>
.grid-item {
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 30px;
}

</style>

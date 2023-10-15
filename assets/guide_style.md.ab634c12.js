import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.eb963252.js";const C=JSON.parse('{"title":"CSS 风格自定义","description":"","frontmatter":{},"headers":[],"relativePath":"guide/style.md","filePath":"guide/style.md","lastUpdated":1697325057000}'),p={name:"guide/style.md"},o=l(`<h1 id="css-风格自定义" tabindex="-1">CSS 风格自定义 <a class="header-anchor" href="#css-风格自定义" aria-label="Permalink to &quot;CSS 风格自定义&quot;">​</a></h1><h3 id="必要样式" tabindex="-1">必要样式 <a class="header-anchor" href="#必要样式" aria-label="Permalink to &quot;必要样式&quot;">​</a></h3><p>请注意： Item成员在布局后无任何样式，您需要编写以下基础样式才会显示内容</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@biggerstar/layout/dist/default-style.css&#39;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@biggerstar/layout/dist/default-style.css&#39;</span></span></code></pre></div><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/* Container的默认样式,定义宽高会被忽略 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-container</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">border-radius</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">10</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">background-color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">skyblue</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 所有Item的默认样式,定义宽高会被忽略 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-item</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">background-color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">rgb</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">148</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">145</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">145</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/* Container的默认样式,定义宽高会被忽略 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-container</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">border-radius</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">10</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">background-color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">skyblue</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 所有Item的默认样式,定义宽高会被忽略 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-item</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">background-color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">rgb</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">148</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">145</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">145</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="所有样式" tabindex="-1">所有样式 <a class="header-anchor" href="#所有样式" aria-label="Permalink to &quot;所有样式&quot;">​</a></h3><p>另外开发者可以在外部自行编写以下类名的 css</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/* 仅编辑模式(drag,resize,close)生效*/</span></span>
<span class="line"><span style="color:#6A737D;">/* 鼠标编辑模式默认样式 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-cursor-default</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">cursor</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">default</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 鼠标在容器中的样式 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-cursor-in-container</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">cursor</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">grab</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 鼠标点击时的鼠标样式 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-cursor-mousedown</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">cursor</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">grabbing</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* Item移动到Item关闭按钮上的鼠标样式 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-cursor-item-close</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">cursor</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">pointer</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* Item移动到resize按钮上的鼠标样式 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-cursor-item-resize</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">cursor</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">nw-resize</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* Item拖动时在容器外禁止放置的鼠标样式(该样式只有编辑模式有) */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-cursor-no-drop</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">cursor</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">no-drop</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* Item拖动时移动到不可放置的静态Item成员上的鼠标样式(该样式只有编辑模式有) */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-cursor-drag-to-item</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">cursor</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">no-drop</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 鼠标移动到静态Item上面显示的鼠标样式(该样式只有编辑模式有) */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-cursor-static-item</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">cursor</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">no-drop</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* ----永久性生效的鼠标样式------  */</span></span>
<span class="line"><span style="color:#6A737D;">/*.grid-item {*/</span></span>
<span class="line"><span style="color:#6A737D;">/*    cursor: move;*/</span></span>
<span class="line"><span style="color:#6A737D;">/*}*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/*.grid-item:active {*/</span></span>
<span class="line"><span style="color:#6A737D;">/*    cursor: no-drop;*/</span></span>
<span class="line"><span style="color:#6A737D;">/*}*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/*.grid-container {*/</span></span>
<span class="line"><span style="color:#6A737D;">/*    cursor: grab;*/</span></span>
<span class="line"><span style="color:#6A737D;">/*}*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/*.grid-item-close-btn {*/</span></span>
<span class="line"><span style="color:#6A737D;">/*    cursor: pointer;*/</span></span>
<span class="line"><span style="color:#6A737D;">/*}*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/*.grid-item-resizable-handle {*/</span></span>
<span class="line"><span style="color:#6A737D;">/*    cursor: nw-resize;*/</span></span>
<span class="line"><span style="color:#6A737D;">/*}*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/*------------------------------------------------------*/</span></span>
<span class="line"><span style="color:#6A737D;">/* Container的默认样式,定义宽高会被忽略 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-container</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">border-radius</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">10</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">background-color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">skyblue</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 所有Item的默认样式,定义宽高会被忽略 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-item</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">background-color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">rgb</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">148</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">145</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">145</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 拖动(drag)时克隆出来跟随鼠标移动的对应元素 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-dragging-clone-el</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">opacity</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">0.8</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">transform</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">scale</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1.1</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">z-index</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 点击进行拖动(drag)的来源元素，也就是容器内的Item，正在拖动时候的样式*/</span></span>
<span class="line"><span style="color:#B392F0;">.grid-dragging-source-el</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">opacity</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">0.3</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 重置大小(resize)时克隆出来跟随鼠标移动的对应元素 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-resizing-clone-el</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">background-color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">red</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 点击进行重置大小(resize)的来源元素，也就是容器内的Item，正在拖动时候的样式*/</span></span>
<span class="line"><span style="color:#B392F0;">.grid-resizing-source-el</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">opacity</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">0.3</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 重置大小(resize)按钮样式 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-item-resizable-handle</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">font-size</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">1.1</span><span style="color:#F97583;">rem</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 关闭Item按钮的样式 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-item-close-btn</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">background-color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">skyblue</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 点击Item按钮的样式 */</span></span>
<span class="line"><span style="color:#B392F0;">.grid-item-close-btn:active</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">background-color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">blue</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/* 仅编辑模式(drag,resize,close)生效*/</span></span>
<span class="line"><span style="color:#6A737D;">/* 鼠标编辑模式默认样式 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-cursor-default</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">cursor</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">default</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 鼠标在容器中的样式 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-cursor-in-container</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">cursor</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">grab</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 鼠标点击时的鼠标样式 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-cursor-mousedown</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">cursor</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">grabbing</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* Item移动到Item关闭按钮上的鼠标样式 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-cursor-item-close</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">cursor</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">pointer</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* Item移动到resize按钮上的鼠标样式 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-cursor-item-resize</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">cursor</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">nw-resize</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* Item拖动时在容器外禁止放置的鼠标样式(该样式只有编辑模式有) */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-cursor-no-drop</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">cursor</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">no-drop</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* Item拖动时移动到不可放置的静态Item成员上的鼠标样式(该样式只有编辑模式有) */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-cursor-drag-to-item</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">cursor</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">no-drop</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 鼠标移动到静态Item上面显示的鼠标样式(该样式只有编辑模式有) */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-cursor-static-item</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">cursor</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">no-drop</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* ----永久性生效的鼠标样式------  */</span></span>
<span class="line"><span style="color:#6A737D;">/*.grid-item {*/</span></span>
<span class="line"><span style="color:#6A737D;">/*    cursor: move;*/</span></span>
<span class="line"><span style="color:#6A737D;">/*}*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/*.grid-item:active {*/</span></span>
<span class="line"><span style="color:#6A737D;">/*    cursor: no-drop;*/</span></span>
<span class="line"><span style="color:#6A737D;">/*}*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/*.grid-container {*/</span></span>
<span class="line"><span style="color:#6A737D;">/*    cursor: grab;*/</span></span>
<span class="line"><span style="color:#6A737D;">/*}*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/*.grid-item-close-btn {*/</span></span>
<span class="line"><span style="color:#6A737D;">/*    cursor: pointer;*/</span></span>
<span class="line"><span style="color:#6A737D;">/*}*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/*.grid-item-resizable-handle {*/</span></span>
<span class="line"><span style="color:#6A737D;">/*    cursor: nw-resize;*/</span></span>
<span class="line"><span style="color:#6A737D;">/*}*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/*------------------------------------------------------*/</span></span>
<span class="line"><span style="color:#6A737D;">/* Container的默认样式,定义宽高会被忽略 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-container</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">border-radius</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">10</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">background-color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">skyblue</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 所有Item的默认样式,定义宽高会被忽略 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-item</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">background-color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">rgb</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">148</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">145</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">145</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 拖动(drag)时克隆出来跟随鼠标移动的对应元素 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-dragging-clone-el</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">opacity</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">0.8</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">transform</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">scale</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1.1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">z-index</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 点击进行拖动(drag)的来源元素，也就是容器内的Item，正在拖动时候的样式*/</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-dragging-source-el</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">opacity</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">0.3</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 重置大小(resize)时克隆出来跟随鼠标移动的对应元素 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-resizing-clone-el</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">background-color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">red</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 点击进行重置大小(resize)的来源元素，也就是容器内的Item，正在拖动时候的样式*/</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-resizing-source-el</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">opacity</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">0.3</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 重置大小(resize)按钮样式 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-item-resizable-handle</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">font-size</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">1.1</span><span style="color:#D73A49;">rem</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 关闭Item按钮的样式 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-item-close-btn</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">background-color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">skyblue</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 点击Item按钮的样式 */</span></span>
<span class="line"><span style="color:#6F42C1;">.grid-item-close-btn:active</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">background-color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">blue</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,8),e=[o];function c(r,t,y,E,i,d){return n(),a("div",null,e)}const g=s(p,[["render",c]]);export{C as __pageData,g as default};

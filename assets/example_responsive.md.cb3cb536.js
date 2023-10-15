import{_ as a,C as n,o as l,c as p,H as o,Q as e}from"./chunks/framework.eb963252.js";const m=JSON.parse('{"title":"响应式插件","description":"","frontmatter":{},"headers":[],"relativePath":"example/responsive.md","filePath":"example/responsive.md","lastUpdated":1697325057000}'),t={name:"example/responsive.md"},c=e(`<h1 id="响应式插件" tabindex="-1">响应式插件 <a class="header-anchor" href="#响应式插件" aria-label="Permalink to &quot;响应式插件&quot;">​</a></h1><p>响应式插件会让Item往主轴方向进行紧凑排列</p><h3 id="代码" tabindex="-1">代码 <a class="header-anchor" href="#代码" aria-label="Permalink to &quot;代码&quot;">​</a></h3><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> {Container, createResponsiveLayoutPlugin, fillItemLayoutList} </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;@biggerstar/layout&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> container</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Container</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Container</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">  el: </span><span style="color:#9ECBFF;">&#39;#basic-container&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  layouts: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    autoGrow: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      vertical: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      horizontal: </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// direction: &#39;row&#39;,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// align: &#39;start&#39;,</span></span>
<span class="line"><span style="color:#E1E4E8;">    items: </span><span style="color:#B392F0;">fillItemLayoutList</span><span style="color:#E1E4E8;">(layoutData, {</span></span>
<span class="line"><span style="color:#E1E4E8;">      draggable: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      resize: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      close: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    }),</span></span>
<span class="line"><span style="color:#E1E4E8;">    margin: [</span><span style="color:#79B8FF;">5</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">5</span><span style="color:#E1E4E8;">],</span></span>
<span class="line"><span style="color:#E1E4E8;">    size: [</span><span style="color:#79B8FF;">80</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">50</span><span style="color:#E1E4E8;">],</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"><span style="color:#6A737D;">//  使用响应式布局插件</span></span>
<span class="line"><span style="color:#E1E4E8;">container.</span><span style="color:#B392F0;">use</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">createResponsiveLayoutPlugin</span><span style="color:#E1E4E8;">())</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> {Container, createResponsiveLayoutPlugin, fillItemLayoutList} </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;@biggerstar/layout&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">let</span><span style="color:#24292E;"> container</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Container</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Container</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">  el: </span><span style="color:#032F62;">&#39;#basic-container&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  layouts: {</span></span>
<span class="line"><span style="color:#24292E;">    autoGrow: {</span></span>
<span class="line"><span style="color:#24292E;">      vertical: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      horizontal: </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// direction: &#39;row&#39;,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// align: &#39;start&#39;,</span></span>
<span class="line"><span style="color:#24292E;">    items: </span><span style="color:#6F42C1;">fillItemLayoutList</span><span style="color:#24292E;">(layoutData, {</span></span>
<span class="line"><span style="color:#24292E;">      draggable: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      resize: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      close: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    }),</span></span>
<span class="line"><span style="color:#24292E;">    margin: [</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">5</span><span style="color:#24292E;">],</span></span>
<span class="line"><span style="color:#24292E;">    size: [</span><span style="color:#005CC5;">80</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">50</span><span style="color:#24292E;">],</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">})</span></span>
<span class="line"><span style="color:#6A737D;">//  使用响应式布局插件</span></span>
<span class="line"><span style="color:#24292E;">container.</span><span style="color:#6F42C1;">use</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">createResponsiveLayoutPlugin</span><span style="color:#24292E;">())</span></span></code></pre></div><h3 id="演示" tabindex="-1">演示 <a class="header-anchor" href="#演示" aria-label="Permalink to &quot;演示&quot;">​</a></h3>`,5);function r(E,y,i,u,d,F){const s=n("Responsive",!0);return l(),p("div",null,[c,o(s)])}const h=a(t,[["render",r]]);export{m as __pageData,h as default};

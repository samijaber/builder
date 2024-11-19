export const JSCODE_ASYNC = {
  lastUpdatedBy: 'OcOewqA7uqVVlVfqY453F8vgcc33',
  folders: [],
  data: {
    title: 'test-jscode',
    themeId: false,
    blocks: [],
    inputs: [],
    tsCode: `/*
  * Global objects available:
  *
  * state - builder state object - learn about state https://www.builder.io/c/docs/guides/state-and-actions
  * context - builder context object - learn about state https://github.com/BuilderIO/builder/tree/main/packages/react#passing-data-and-functions-down
  * fetch - Fetch API - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API'
  * Builder - Builder object - useful values include: Builder.isServer, Builder.isBrowser, Builder.isPreviewing, Builder.isEditing
  *
  * visit https://www.builder.io/c/docs/guides/custom-code
  * for more information on writing custom code
  */
 async function main () {
  if (Builder.isServer) {
    // Place any code here you want to only run on the server. Any  
    // data fetched on the server will be available to re-hydrate on the client
    // if added to the state object
  }

  if (Builder.isBrowser) {
    console.log('hello world')
    // Place code that you only want to run in the browser (client side only) here
    // For example, anything that uses document/window access or DOM manipulation
  }
}

export default main();`,
    jsCode: `var __awaiter=function(e,n,t,r){return new(t||(t=Promise))((function(o,i){function a(e){try{l(r.next(e))}catch(e){i(e)}}function u(e){try{l(r.throw(e))}catch(e){i(e)}}function l(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(a,u)}l((r=r.apply(e,n||[])).next())}))},__generator=function(e,n){var t,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(t)throw new TypeError("Generator is already executing.");for(;a;)try{if(t=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=n.call(e,a)}catch(e){i=[6,e],r=0}finally{t=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}};function main(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(e){return Builder.isServer,Builder.isBrowser&&console.log("hello world"),[2]}))}))}var _virtual_index=main();return _virtual_index`,
  },
  modelId: '240a12053d674735ac2a384dcdc561b5',
  query: [
    {
      '@type': '@builder.io/core:Query',
      property: 'urlPath',
      value: '/jscode-async',
      operator: 'is',
    },
  ],
  published: 'draft',
};

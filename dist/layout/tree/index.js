"use strict";!function(e,n){if("function"==typeof define&&define.amd)define(["exports","../hierarchy","mmvis"],n);else if("undefined"!=typeof exports)n(exports,require("../hierarchy"),require("mmvis"));else{var r={};n(r,e.hierarchy,e.mmvis),e.undefined=r}}(void 0,function(e,n,r){Object.defineProperty(e,"__esModule",{value:!0});var t,_=(t=n)&&t.__esModule?t:{default:t};function i(){var h=(0,_.default)().sort(null).value(null),m=l,d=[1,1],s=null;function n(e,n){var r=h.call(this,e,n),t=r[0],i=function(e){var n,r={A:null,children:[e]},t=[r];for(;null!=(n=t.pop());)for(var i,l=n.children,u=0,a=l.length;u<a;++u)t.push((l[u]=i={_:l[u],parent:n,children:(i=l[u].children)&&i.slice()||[],A:null,a:null,z:0,m:0,c:0,s:0,t:null,i:u}).a=i);return r.children[0]}(t);if(_.default.layout_hierarchyVisitAfter(i,p),i.parent.m=-i.z,_.default.layout_hierarchyVisitBefore(i,v),s)_.default.layout_hierarchyVisitBefore(t,y);else{var l=t,u=t,a=t;_.default.layout_hierarchyVisitBefore(t,function(e){e.x<l.x&&(l=e),e.x>u.x&&(u=e),e.depth>a.depth&&(a=e)});var f=m(l,u)/2-l.x,o=d[0]/(u.x+m(u,l)/2+f),c=d[1]/(a.depth||1);_.default.layout_hierarchyVisitBefore(t,function(e){e.x=(e.x+f)*o,e.y=e.depth*c})}return r}function p(e){var n=e.children,r=e.parent.children,t=e.i?r[e.i-1]:null;if(n.length){!function(e){var n,r=0,t=0,i=e.children,l=i.length;for(;0<=--l;)(n=i[l]).z+=r,n.m+=r,r+=n.s+(t+=n.c)}(e);var i=(n[0].z+n[n.length-1].z)/2;t?(e.z=t.z+m(e._,t._),e.m=e.z-i):e.z=i}else t&&(e.z=t.z+m(e._,t._));e.parent.A=function(e,n,r){if(n){for(var t,i=e,l=e,u=n,a=i.parent.children[0],f=i.m,o=l.m,c=u.m,h=a.m;u=x(u),i=z(i),u&&i;)a=z(a),(l=x(l)).a=e,0<(t=u.z+c-i.z-f+m(u._,i._))&&(g((s=e,p=r,(d=u).a.parent===s.parent?d.a:p),e,t),f+=t,o+=t),c+=u.m,f+=i.m,h+=a.m,o+=l.m;u&&!x(l)&&(l.t=u,l.m+=c-o),i&&!z(a)&&(a.t=i,a.m+=f-h,r=e)}var d,s,p;return r}(e,t,e.parent.A||r[0])}function v(e){e._.x=e.z+e.parent.m,e.m+=e.parent.m}function y(e){e.x*=d[0],e.y=e.depth*d[1]}return n.separation=function(e){return arguments.length?(m=e,n):m},n.size=function(e){return arguments.length?(s=null==(d=e)?y:null,n):s?null:d},n.nodeSize=function(e){return arguments.length?(s=null==(d=e)?null:y,n):s?d:null},_.default.layout_hierarchyRebind(n,h)}function l(e,n){return e.parent==n.parent?1:2}function z(e){var n=e.children;return n.length?n[0]:e.t}function x(e){var n,r=e.children;return(n=r.length)?r[n-1]:e.t}function g(e,n,r){var t=r/(n.i-e.i);n.c-=t,n.s+=r,e.c+=t,n.z+=r,n.m+=r}r.global.registerLayout("tree",i),e.default=i});
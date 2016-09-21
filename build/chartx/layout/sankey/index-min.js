define("chartx/layout/sankey/index",[],function(){return function(){function a(a,b){return a=+a,b=+b,function(c){return a*(1-c)+b*c}}function b(){A.forEach(function(a){a.sourceLinks=[],a.targetLinks=[]}),B.forEach(function(a){var b=a.source,c=a.target;"number"==typeof b&&(b=a.source=A[a.source]),"number"==typeof c&&(c=a.target=A[a.target]),b.sourceLinks.push(a),c.targetLinks.push(a)})}function c(a,b){var c,d=0,e=a.length,f=-1;if(1===arguments.length)for(;++f<e;)isNaN(c=+a[f])||(d+=c);else for(;++f<e;)isNaN(c=+b.call(a,a[f],f))||(d+=c);return d}function d(a,b){var c,d,e=-1,f=a.length;if(1===arguments.length){for(;++e<f&&(null==(c=a[e])||c!=c);)c=void 0;for(;++e<f;)null!=(d=a[e])&&c>d&&(c=d)}else{for(;++e<f&&(null==(c=b.call(a,a[e],e))||c!=c);)c=void 0;for(;++e<f;)null!=(d=b.call(a,a[e],e))&&c>d&&(c=d)}return c}function e(){A.forEach(function(a){a.value=Math.max(c(a.sourceLinks,v),c(a.targetLinks,v))})}function f(){for(var a,b=A,c=0;b.length;)a=[],b.forEach(function(b){b.x=c,b.dx=x,b.sourceLinks.forEach(function(b){a.indexOf(b.target)<0&&a.push(b.target)})}),b=a,++c;g(c),h((z[0]-x)/(c-1))}function g(a){A.forEach(function(b){b.sourceLinks.length||(b.x=a-1)})}function h(a){A.forEach(function(b){b.x*=a})}function i(a,b){if(Object.defineProperty)for(var c in b)Object.defineProperty(a.prototype,c,{value:b[c],enumerable:!1});else _.extend(a.prototype,b)}function j(){this._=Object.create(null)}function k(a){return(a+="")===E||a[0]===F?F+a:a}function l(a){return(a+="")[0]===F?a.slice(1):a}function m(a){return k(a)in this._}function n(a){return(a=k(a))in this._&&delete this._[a]}function o(){var a=[];for(var b in this._)a.push(l(b));return a}function p(){var a=0;for(var b in this._)++a;return a}function q(){for(var a in this._)return!1;return!0}function r(a,b){return b>a?-1:a>b?1:a>=b?0:NaN}function s(a){function b(){var a=d(i,function(a){return(z[1]-(a.length-1)*y)/c(a,v)});i.forEach(function(b){b.forEach(function(b,c){b.y=c,b.dy=b.value*a})}),B.forEach(function(b){b.dy=b.value*a})}function e(a){function b(a){return u(a.source)*a.value}i.forEach(function(d,e){d.forEach(function(d){if(d.targetLinks.length){var e=c(d.targetLinks,b)/c(d.targetLinks,v);d.y+=(e-u(d))*a}})})}function f(a){function b(a){return u(a.target)*a.value}i.slice().reverse().forEach(function(d){d.forEach(function(d){if(d.sourceLinks.length){var e=c(d.sourceLinks,b)/c(d.sourceLinks,v);d.y+=(e-u(d))*a}})})}function g(){i.forEach(function(a){var b,c,d,e=0,f=a.length;for(a.sort(h),d=0;f>d;++d)b=a[d],c=e-b.y,c>0&&(b.y+=c),e=b.y+b.dy+y;if(c=e-y-z[1],c>0)for(e=b.y-=c,d=f-2;d>=0;--d)b=a[d],c=b.y+b.dy+y-e,c>0&&(b.y-=c),e=b.y})}function h(a,b){return a.y-b.y}var i=C().key(function(a){return a.x}).sortKeys(r).entries(A).map(function(a){return a.values});b(),g();for(var j=1;a>0;--a)f(j*=.99),g(),e(j),g()}function t(){function a(a,b){return a.source.y-b.source.y}function b(a,b){return a.target.y-b.target.y}A.forEach(function(c){c.sourceLinks.sort(b),c.targetLinks.sort(a)}),A.forEach(function(a){var b=0,c=0;a.sourceLinks.forEach(function(a){a.sy=b,b+=a.dy}),a.targetLinks.forEach(function(a){a.ty=c,c+=a.dy})})}function u(a){return a.y+a.dy/2}function v(a){return a.value}var w={},x=24,y=8,z=[1,1],A=[],B=[];w.nodeWidth=function(a){return arguments.length?(x=+a,w):x},w.nodePadding=function(a){return arguments.length?(y=+a,w):y},w.nodes=function(a){return arguments.length?(A=a,w):A},w.links=function(a){return arguments.length?(B=a,w):B},w.size=function(a){return arguments.length?(z=a,w):z},w.layout=function(a){return b(),e(),f(),s(a),t(),w},w.relayout=function(){return t(),w},w.link=function(){function b(b){var d=b.source.x+b.source.dx,e=b.target.x,f=a(d,e),g=f(c),h=f(1-c),i=b.source.y+b.sy+b.dy/2,j=b.target.y+b.ty+b.dy/2;return"M"+d+","+i+"C"+g+","+i+" "+h+","+j+" "+e+","+j}var c=.5;return b.curvature=function(a){return arguments.length?(c=+a,b):c},b};var C=function(){function a(b,g,h){if(h>=f.length)return d?d.call(e,g):c?g.sort(c):g;for(var i,k,l,m,n=-1,o=g.length,p=f[h++],q=new j;++n<o;)(m=q.get(i=p(k=g[n])))?m.push(k):q.set(i,[k]);return b?(k=b(),l=function(c,d){k.set(c,a(b,d,h))}):(k={},l=function(c,d){k[c]=a(b,d,h)}),q.forEach(l),k}function b(a,c){if(c>=f.length)return a;var d=[],e=g[c++];return a.forEach(function(a,e){d.push({key:a,values:b(e,c)})}),e?d.sort(function(a,b){return e(a.key,b.key)}):d}var c,d,e={},f=[],g=[];return e.map=function(b,c){return a(c,b,0)},e.entries=function(c){return b(a(D,c,0),0)},e.key=function(a){return f.push(a),e},e.sortKeys=function(a){return g[f.length-1]=a,e},e.sortValues=function(a){return c=a,e},e.rollup=function(a){return d=a,e},e},D=function(a,b){var c=new j;if(a instanceof j)a.forEach(function(a,b){c.set(a,b)});else if(Array.isArray(a)){var d,e=-1,f=a.length;if(1===arguments.length)for(;++e<f;)c.set(e,a[e]);else for(;++e<f;)c.set(b.call(a,d=a[e],e),d)}else for(var g in a)c.set(g,a[g]);return c},E="__proto__",F="\x00";return i(j,{has:m,get:function(a){return this._[k(a)]},set:function(a,b){return this._[k(a)]=b},remove:n,keys:o,values:function(){var a=[];for(var b in this._)a.push(this._[b]);return a},entries:function(){var a=[];for(var b in this._)a.push({key:l(b),value:this._[b]});return a},size:p,empty:q,forEach:function(a){for(var b in this._)a.call(this,l(b),this._[b])}}),w}});
define("chartx/utils/datasection",[],function(){function a(a,b){var c,d,e=[1,2,5,10];for(c=a/b,d=0;d<e.length&&(a=e[d],!(c<=(e[d]+(e[d+1]||e[d]))/2));d++);return a*=b}function b(a){return parseFloat(a.toPrecision(14))}function c(c,d,e){c=_.without(c,void 0,null,"");var f=e&&e.scale?parseFloat(e.scale):1,g=e&&e.isInt?1:0;isNaN(f)&&(f=1);var h=_.max(c),i=h;h*=f;var j=_.min(c);if(j==h)return h>0?(j=0,[j,h]):0>h?[h,0]:(h=1,[0,h]);var k=h-j;if(k){var l=j;j-=.05*k,0>j&&l>=0&&(j=0),h+=.05*k}var m=.3*(h-j),n=Math.pow(10,Math.floor(Math.log(m)/Math.LN10));m=a(m,n),g&&(m=Math.ceil(m));var o,p,q=b(Math.floor(j/m)*m),r=b(Math.ceil(h/m)*m),s=[];for(o=q;r>=o&&(s.push(o),o=b(o+m),o!==p);)p=o;return s.length>=3&&s[s.length-2]>=i&&s.pop(),s}var d={section:function(a,b,d){return _.uniq(c(a,b,d))}};return d});
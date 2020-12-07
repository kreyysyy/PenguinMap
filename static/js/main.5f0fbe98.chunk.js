(this.webpackJsonppenguin_map=this.webpackJsonppenguin_map||[]).push([[0],{34:function(e,t,a){},36:function(e,t,a){},45:function(e,t,a){"use strict";a.r(t);var n=a(2),r=a(0),s=a.n(r),o=a(25),c=a.n(o),i=(a(34),a(23)),l=a(20),p=a.n(l),u=a(16),h=a(6),d=a(26),g=a(13),m=a(14),j=a(11),f=a(17),b=a(15),v=(a(36),a(37),a(27)),y=a(28),x=a(9),O=a(7),L=a(21),k=a.n(L),C=a(22),S=a.n(C),w="./Place_PenguinList.geojson",_=function(e){Object(f.a)(a,e);var t=Object(b.a)(a);function a(e){var n;return Object(g.a)(this,a),(n=t.call(this,e)).SELECT_ALL="\uff1c\u5168\u3066\uff1e",n.state={lng:136,lat:37,zoom:3.5,dropdownPlace:[],dropdownPlaceSelected:n.SELECT_ALL,checkboxPenguin:(new Map).set(n.SELECT_ALL,!0),geojson:null},n.map=null,n.df_enkan_latlon=null,n.df_data_enkans=null,n.penguins=null,n.places=null,n.checkboxPenguinChanged=n.checkboxPenguinChanged.bind(Object(j.a)(n)),n.dropdownPlaceChanged=n.dropdownPlaceChanged.bind(Object(j.a)(n)),n}return Object(m.a)(a,[{key:"componentDidMount",value:function(){this.createMap(),this.readGeoJSON()}},{key:"render",value:function(){var e,t,a=this;return t=Object(n.jsx)(O.a,{children:Object(n.jsxs)(O.a.Group,{controlId:"exampleForm.SelectCustom",children:[Object(n.jsx)(O.a.Label,{children:"\u52d5\u7269\u5712\u30fb\u6c34\u65cf\u9928"}),Object(n.jsx)(O.a.Control,{as:"select",custom:!0,value:this.state.dropdownPlaceSelected,onChange:this.dropdownPlaceChanged,children:this.state.dropdownPlace.map((function(e){return Object(n.jsx)("option",{value:e,children:e},e)}))})]})}),e=Object(n.jsxs)(O.a,{children:[Object(n.jsx)(O.a.Label,{children:"\u30da\u30f3\u30ae\u30f3"}),Array.from(this.state.checkboxPenguin.keys()).map((function(e){var t=a.state.checkboxPenguin.get(e);return Object(n.jsx)(O.a.Check,{value:e,type:"checkbox",checked:t,label:e.replace(/\u30da\u30f3\u30ae\u30f3$/,""),onChange:a.checkboxPenguinChanged},e)}))]}),Object(n.jsx)(v.a,{fluid:!0,children:Object(n.jsxs)(y.a,{children:[Object(n.jsx)(x.a,{xs:12,sm:8,md:9,lg:5,xl:6,children:Object(n.jsxs)("div",{className:"container-frame",children:[Object(n.jsx)("div",{ref:function(e){return a.mapContainer=e},className:"map-container"}),Object(n.jsxs)("div",{className:"map-overlay",children:[Object(n.jsxs)("div",{className:"map-title",children:[Object(n.jsx)("h5",{children:"\u30da\u30f3\u30ae\u30f3\u30de\u30c3\u30d7"}),"\u30da\u30f3\u30ae\u30f3\u304c\u3044\u308b\u52d5\u7269\u5712\u30fb\u6c34\u65cf\u9928"]}),Object(n.jsxs)("div",{id:"legend",className:"map-legend",children:["\u98fc\u80b2\u3055\u308c\u3066\u3044\u308b\u30da\u30f3\u30ae\u30f3\u306e\u7a2e\u985e\u6570",Object(n.jsx)("div",{className:"map-legend-bar"}),Object(n.jsx)("div",{className:"map-legend-bar-text",children:"1 8"})]})]})]})}),Object(n.jsx)(x.a,{xs:4,sm:4,md:3,lg:3,xl:2,children:Object(n.jsx)("div",{className:"container-frame",children:Object(n.jsxs)("div",{className:"selector-container",children:[t,e]})})}),Object(n.jsxs)(x.a,{xs:8,sm:12,md:12,lg:4,xl:4,children:[Object(n.jsx)(P,{geojson:this.state.geojson}),Object(n.jsx)(E,{geojson:this.state.geojson})]})]})})}},{key:"readGeoJSON",value:function(){var e=Object(d.a)(p.a.mark((function e(){var t,a,n,r,s,o,c,i,l,d,g,m,j,f,b;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(w);case 2:return t=e.sent,e.next=5,t.json();case 5:a=e.sent,console.log("read file: "+w),n=Array.from(new Set(a.features.map((function(e){return e.properties.place})))).sort(),r=new Set,s=Object(h.a)(a.features);try{for(s.s();!(o=s.n()).done;){c=o.value,i=Object(h.a)(c.properties.penguin.split("_"));try{for(i.s();!(l=i.n()).done;)d=l.value,r.add(d)}catch(p){i.e(p)}finally{i.f()}}}catch(p){s.e(p)}finally{s.f()}g=Array.from(r).sort(),(m=new Map).set(this.SELECT_ALL,!0),j=Object(h.a)(g);try{for(j.s();!(f=j.n()).done;)b=f.value,m.set(b,!0)}catch(p){j.e(p)}finally{j.f()}this.setState({geojson:a,dropdownPlace:[this.SELECT_ALL].concat(Object(u.a)(n)),dropdownPlaceSelected:this.SELECT_ALL,checkboxPenguin:m});case 17:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"createMap",value:function(){var e=this;this.map=new k.a.Map({container:this.mapContainer,style:{version:8,sources:{OSM:{type:"raster",tiles:["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png","https://b.tile.openstreetmap.org/{z}/{x}/{y}.png","https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"],tileSize:256}},layers:[{id:"OSM",type:"raster",source:"OSM"}],glyphs:"https://fonts.openmaptiles.org/{fontstack}/{range}.pbf"},attributionControl:!0,customAttribution:['Map: \xa9 <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors','Data: refer to <a href="https://www.jaza.jp/" target="_blank">JAZA (2020/12/7)</a>'],center:[this.state.lng,this.state.lat],zoom:this.state.zoom}),this.map.on("load",(function(){e.map.addSource("source-place",{type:"geojson",data:w}),e.map.addLayer({id:"layer-place",type:"circle",source:"source-place",layout:{},paint:{"circle-stroke-width":1,"circle-stroke-color":"black","circle-color":["interpolate",["linear"],["get","penguin_num"],1,"blue",4.5,"yellow",8,"red"]}}),e.map.addLayer({id:"layer-place-label",type:"symbol",source:"source-place",layout:{"text-field":["format",["get","place"]],"text-anchor":"bottom","text-radial-offset":.7,"text-font":["Open Sans Regular"]},paint:{"text-halo-width":2,"text-halo-color":"rgba(255, 255, 255, 255)"}})})),this.map.on("move",(function(){e.setState({lng:e.map.getCenter().lng,lat:e.map.getCenter().lat,zoom:e.map.getZoom()})}));var t=new k.a.Popup({closeButton:!1,closeOnClick:!1});this.map.on("mouseenter","layer-place",(function(a){e.map.getCanvas().style.cursor="pointer";for(var n=a.features[0].geometry.coordinates.slice(),r="<ul>"+a.features[0].properties.penguin.split("_").map((function(e){return"<li>"+e+"</li>"})).join("")+"</ul>",s="<h6>"+a.features[0].properties.place+"</h6>"+r;Math.abs(a.lngLat.lng-n[0])>180;)n[0]+=a.lngLat.lng>n[0]?360:-360;t.setLngLat(n).setHTML(s).addTo(e.map)})),this.map.on("mouseleave","layer-place",(function(){e.map.getCanvas().style.cursor="",t.remove()}))}},{key:"dropdownPlaceChanged",value:function(e){var t=e.target.value;this.map.loaded()&&(t===this.SELECT_ALL?(this.map.setFilter("layer-place",null),this.map.setFilter("layer-place-label",null)):(this.map.setFilter("layer-place",["==",["get","place"],t]),this.map.setFilter("layer-place-label",["==",["get","place"],t]))),this.setState({dropdownPlaceSelected:t})}},{key:"checkboxPenguinChanged",value:function(e){var t=this.state.checkboxPenguin,a=e.target.value,n=e.target.checked;if(t.set(a,!t.get(a)),a===this.SELECT_ALL){var r,s=Object(h.a)(t.keys());try{for(s.s();!(r=s.n()).done;){var o=r.value;t.set(o,n)}}catch(f){s.e(f)}finally{s.f()}}else if(n){var c,l=!0,p=Object(h.a)(t);try{for(p.s();!(c=p.n()).done;){var u=Object(i.a)(c.value,2),d=u[0],g=u[1];if(d!==this.SELECT_ALL&&!1===g){l=!1;break}}}catch(f){p.e(f)}finally{p.f()}l&&t.set(this.SELECT_ALL,!0)}else t.set(this.SELECT_ALL,!1);var m=[];if(t.forEach((function(e,t){return e?m.push(t):null})),this.map.loaded()){var j=this.df_data_enkans.where((function(e){return m.includes(e.JP_Common_Name)})).getSeries("commonname").distinct().toArray();this.map.setFilter("layer-place",["in",["get","place"],["literal",j]]),this.map.setFilter("layer-place-label",["in",["get","place"],["literal",j]])}this.setState({checkboxPenguin:t})}}]),a}(s.a.Component),P=function(e){Object(f.a)(a,e);var t=Object(b.a)(a);function a(e){var n;return Object(g.a)(this,a),(n=t.call(this,e)).state={geojson:e.geojson},n}return Object(m.a)(a,[{key:"componentWillReceiveProps",value:function(e){this.setState({geojson:e.geojson})}},{key:"render",value:function(){var e=this,t=this.state.geojson;if(null!=t){var a=Object(u.a)(t.features);return a.sort((function(e,t){return e.properties.penguin_num-t.properties.penguin_num})),Object(n.jsx)("div",{className:"container-frame",children:Object(n.jsx)("div",{className:"graph-container",children:Object(n.jsx)(S.a,{className:"graph",ref:function(t){return e.graph=t},data:[{type:"bar",x:a.map((function(e){return e.properties.penguin_num})),y:a.map((function(e){return e.properties.place})),orientation:"h"}],layout:{title:"\u98fc\u80b2\u7a2e\u985e\u6570",showlegend:!1,margin:{t:50},height:2e3,xaxis:{side:"top"},yaxis:{automargin:!0}},config:{responsive:!0,displayModeBar:!1}})})})}return null}}]),a}(s.a.Component),E=function(e){Object(f.a)(a,e);var t=Object(b.a)(a);function a(e){var n;return Object(g.a)(this,a),(n=t.call(this,e)).state={geojson:e.geojson},n}return Object(m.a)(a,[{key:"componentWillReceiveProps",value:function(e){this.setState({geojson:e.geojson})}},{key:"render",value:function(){var e=this,t=this.state.geojson;if(null!=t){var a,r=Object(u.a)(t.features),s=new Map,o=Object(h.a)(r);try{for(o.s();!(a=o.n()).done;){var c,l=a.value.properties.penguin.split("_"),p=Object(h.a)(l);try{for(p.s();!(c=p.n()).done;){var d=c.value;d=d.replace(/\u30da\u30f3\u30ae\u30f3$/,""),s.has(d)?s.set(d,s.get(d)+1):s.set(d,0)}}catch(y){p.e(y)}finally{p.f()}}}catch(y){o.e(y)}finally{o.f()}var g,m=[],j=Object(h.a)(s);try{for(j.s();!(g=j.n()).done;){var f=Object(i.a)(g.value,2),b=f[0],v=f[1];m.push({pen:b,num:v})}}catch(y){j.e(y)}finally{j.f()}return m.sort((function(e,t){return e.num-t.num})),Object(n.jsx)("div",{className:"container-frame",children:Object(n.jsx)("div",{className:"graph-container",children:Object(n.jsx)(S.a,{className:"graph",ref:function(t){return e.graph=t},data:[{type:"bar",x:m.map((function(e){return e.num})),y:m.map((function(e){return e.pen})),orientation:"h"}],layout:{title:"\u98fc\u80b2\u9928\u6570",showlegend:!1,margin:{t:50},height:400,xaxis:{side:"top"},yaxis:{automargin:!0}},config:{responsive:!0,displayModeBar:!1}})})})}return null}}]),a}(s.a.Component),A=_,N=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,46)).then((function(t){var a=t.getCLS,n=t.getFID,r=t.getFCP,s=t.getLCP,o=t.getTTFB;a(e),n(e),r(e),s(e),o(e)}))};c.a.render(Object(n.jsx)(s.a.StrictMode,{children:Object(n.jsx)(A,{})}),document.getElementById("root")),N()}},[[45,1,2]]]);
//# sourceMappingURL=main.5f0fbe98.chunk.js.map
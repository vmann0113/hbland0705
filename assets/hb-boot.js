window.HB_ROULETTE_ENABLED = (window.HB_ROULETTE_ENABLED !== false);
(function(){
  var _params, HB_BRANCH='bs', _rp='', _adminOff=false, _defaultBenefitsHTML=null, _hasBParam=false, _forcePick=false;
  try{ _params=new URLSearchParams(location.search); HB_BRANCH=_params.get('b')||'bs'; _rp=(_params.get('roulette')||'').toLowerCase(); _hasBParam=_params.has('b'); _forcePick=(_params.get('pick')==='1'); }catch(e){}
  try{ var _m=JSON.parse(localStorage.getItem('hbBranchRoulette')||'null'); if(_m&&typeof _m==='object'&&_m[HB_BRANCH]===false) _adminOff=true; }catch(e){}
  window.HB_BRANCH = HB_BRANCH;

  var NAVER_MAP_KEY='pgxefrkkuy';
  var _naverLoading=false, _naverReady=false, _naverDone=false, _mapQueue=[], _hbMaps=[];
  function _osmURL(g){ var lat=g[0], lon=g[1]; return 'https://www.openstreetmap.org/export/embed.html?bbox='+(lon-0.004).toFixed(4)+'%2C'+(lat-0.003).toFixed(4)+'%2C'+(lon+0.004).toFixed(4)+'%2C'+(lat+0.003).toFixed(4)+'&layer=mapnik&marker='+lat.toFixed(4)+'%2C'+lon.toFixed(4); }
  function _osmInto(el,g){ el.innerHTML='<iframe src="'+_osmURL(g)+'" style="width:100%;height:100%;border:0;display:block;" loading="lazy"></iframe>'; }
  function _osmFallbackAll(){ _naverReady=false; _hbMaps.forEach(function(m){ if(!m.el.querySelector('iframe')) _osmInto(m.el,m.g); }); }
  function _flushMaps(){ _naverDone=true; var q=_mapQueue.slice(); _mapQueue=[]; q.forEach(function(f){ try{f();}catch(e){} }); }
  function _loadNaver(cb){
    if(_naverDone) return cb();
    _mapQueue.push(cb);
    if(_naverLoading) return;
    _naverLoading=true;
    window.navermap_authFailure=function(){ _osmFallbackAll(); };
    var s=document.createElement('script');
    s.src='https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId='+NAVER_MAP_KEY;
    s.onload=function(){ _naverReady=(typeof naver!=='undefined'&&!!naver.maps); _flushMaps(); };
    s.onerror=function(){ _naverReady=false; _flushMaps(); };
    document.head.appendChild(s);
    setTimeout(function(){ if(!_naverDone){ _naverReady=(typeof naver!=='undefined'&&!!naver.maps); _flushMaps(); } }, 6000);
    setTimeout(function(){ _hbMaps.forEach(function(m){ if(!m.el.querySelector('iframe') && !m.el.querySelector('canvas,img')) _osmInto(m.el,m.g); }); }, 3500);
  }

  var ROULETTE_ENABLED = (window.HB_ROULETTE_ENABLED !== false) && !_adminOff && _rp!=='off';
  if(_rp==='on') ROULETTE_ENABLED = true;
  var evResult = "";
  var LINKS = {
    call: { bs: "tel:0516342325", ct: "tel:01030522325", title: "전화상담 지점 선택", colorBS: "#0A1D37", colorCT: "#1b4b9b" },
    kakao: { bs: "https://open.kakao.com/o/soq7Ns4d", ct: "https://open.kakao.com/o/sIrXajUf", title: "카톡문의 지점 선택", colorBS: "#FEE500", colorCT: "#FEE500", text: "#3C1E1E" },
    reserve: { bs: "https://m.booking.naver.com/booking/6/bizes/661812", ct: "https://booking.naver.com/booking/6/bizes/1577219", title: "네이버예약 지점 선택", colorBS: "#03C75A", colorCT: "#03C75A" }
  };
  function _cfgNow(){ return (window.HB_BRANCHES&&window.HB_BRANCHES[window.HB_BRANCH])||null; }
  function _linksFor(type){
    var cfg=_cfgNow(); if(!cfg) return null;
    if(type==='call'){ var t=cfg.tel||[]; return { bs:'tel:'+t[0], ct:'tel:'+(t[1]||t[0]), title:"전화상담 지점 선택", colorBS:"#0A1D37", colorCT:"#1b4b9b" }; }
    if(type==='kakao'){ var k=cfg.kakao||[]; return { bs:'https://open.kakao.com/o/'+k[0], ct:'https://open.kakao.com/o/'+(k[1]||k[0]), title:"카톡문의 지점 선택", colorBS:"#FEE500", colorCT:"#FEE500", text:"#3C1E1E" }; }
    var r=cfg.reserve||[]; return { bs:r[0], ct:r[1]||r[0], title:"네이버예약 지점 선택", colorBS:"#03C75A", colorCT:"#03C75A" };
  }
  function openModal(type){
    var cfg=_cfgNow(); if(!cfg) return;
    var data=_linksFor(type); if(!data) return;
    var names=cfg.dual||[cfg.name];
    var single=!(cfg.reserve&&cfg.reserve[1]);
    var verb=(type==='call'?"전화하기":type==='kakao'?"카톡하기":"예약하기");
    if(single){ if(type==='call'){ location.href=data.bs; } else { window.open(data.bs,'_blank','noopener'); } return; }
    var btnBS=document.getElementById('btnBS'), btnCT=document.getElementById('btnCT');
    document.getElementById('modalTitle').innerText=data.title;
    btnBS.href=data.bs; btnBS.style.background=data.colorBS; btnBS.style.color=data.text||"#fff";
    btnBS.innerText=names[0]+" "+verb;
    btnCT.href=data.ct; btnCT.style.background=data.colorCT; btnCT.style.color=data.text||"#fff";
    btnCT.innerText=(names[1]||names[0])+" "+verb;
    document.getElementById('selectModal').style.display='flex';
  }
  function closeModal(){ document.getElementById('selectModal').style.display='none'; }
  function submitEvData(){
    var name=document.getElementById('evName').value.trim();
    var phone=document.getElementById('evPhone').value.trim();
    var branch=document.getElementById('evBranch').value;
    var GAS_URL="https://script.google.com/macros/s/AKfycbzFX0_bpw0It_r6uon9km3qzfYjnoCwoZx_y5GsOwyDcJCUSlcxhHCbXs2FwmoNyhvE/exec";
    if(!name || phone.replace(/-/g,"").length<11) return alert("성함과 연락처 11자리를 정확히 입력해주세요.");
    var btn=document.querySelector('.ev-btn'); btn.innerText="처리 중..."; btn.disabled=true;
    var cb='__hbSubmit_'+Date.now();
    var finalURL=GAS_URL+"?name="+encodeURIComponent(name)+"&phone="+encodeURIComponent(phone)+"&prize="+encodeURIComponent(evResult)+"&branch="+encodeURIComponent(branch)+"&callback="+cb;
    var s=document.createElement('script'), done=false;
    function finish(msg,label){ if(done)return; done=true; try{delete window[cb];}catch(e){} if(s&&s.parentNode)s.parentNode.removeChild(s); alert(msg); btn.innerText=label; }
    window[cb]=function(data){ if(data&&data.result==="duplicate"){ finish("이미 참여하신 내역이 있습니다.","참여 완료"); } else { finish("프리미엄 혜택이 성공적으로 신청되었습니다! 담당자가 곧 연락드리겠습니다.","혜택 신청 완료"); } };
    s.onload=function(){ setTimeout(function(){ finish("신청이 접수되었습니다! 확인 후 빠른 안내 도와드리겠습니다.","신청 완료"); },400); };
    s.onerror=function(){ finish("신청이 접수되었습니다! 확인 후 빠른 안내 도와드리겠습니다.","신청 완료"); };
    s.src=finalURL;
    document.body.appendChild(s);
    setTimeout(function(){ finish("신청이 접수되었습니다! 확인 후 빠른 안내 도와드리겠습니다.","신청 완료"); },10000);
  }

  var WHEEL = ["10만원 상품권","5만원 상품권","진주귀걸이 증정","10만원 상품권","5만원 상품권","진주귀걸이 증정"];
  var MARQUEE = ["10만원 상품권","5만원 상품권","진주귀걸이 증정"];
  var SEQUENCE = [ ["5만원 상품권","진주귀걸이 증정"], ["10만원 상품권"] ];
  var DEFAULT_AFTER = ["10만원 상품권"];
  var spinCount = 0;
  var ONCE_PER_DEVICE = false;
  var STORE_KEY = 'hbRoulettePlayed';
  var OPEN_DELAY = 1500;
  var isSpinning=false, currentRotation=0;
  function fmtDeadline(ts){return '사용기한: 당첨일로부터 30일 이내';}

  function esc(s){return String(s).replace(/[<>&'"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c];});}
  function splitLabel(name){
    var w=String(name).split(/\s+/).filter(Boolean);
    if(w.length<=1) return [name.length>9?name.slice(0,8)+'…':name];
    var bi=1,bd=Infinity;
    for(var k=1;k<w.length;k++){var a=w.slice(0,k).join(' ').length,b=w.slice(k).join(' ').length,d=Math.abs(a-b);if(d<bd){bd=d;bi=k;}}
    var l1=w.slice(0,bi).join(' '),l2=w.slice(bi).join(' ');
    if(l1.length>10)l1=l1.slice(0,9)+'…'; if(l2.length>10)l2=l2.slice(0,9)+'…';
    return [l1,l2];
  }
  function drawWheel(prizes){
    var svg=document.getElementById('roulette-img'); if(!svg)return;
    var n=prizes.length, cx=160, cy=160, r=154, slice=Math.PI*2/n;
    var palette=['#0A1D37','#132a4a'], altPal=['#B8977E','#d8c4b2'], wedges='', labels='';
    for(var i=0;i<n;i++){
      var a0=-Math.PI/2+i*slice, a1=a0+slice;
      var x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1);
      var large=slice>Math.PI?1:0, isAlt=i%2===1;
      var fill=isAlt?altPal[(i/2|0)%altPal.length]:palette[i%palette.length];
      wedges+='<path d="M'+cx+','+cy+' L'+x0.toFixed(2)+','+y0.toFixed(2)+' A'+r+','+r+' 0 '+large+' 1 '+x1.toFixed(2)+','+y1.toFixed(2)+' Z" fill="'+fill+'"/>';
      var midA=a0+slice/2, tx=cx+r*0.64*Math.cos(midA), ty=cy+r*0.64*Math.sin(midA), rot=midA*180/Math.PI;
      if(rot>90&&rot<270)rot-=180;
      var textColor=isAlt?'#0A1D37':'#d8c4b2', lines=splitLabel((prizes[i]||'').trim()), fs=16, maxW=98;
      var tspans=lines.map(function(ln,li){
        var est=ln.length*fs*0.92, clamp=est>maxW?' textLength="'+maxW+'" lengthAdjust="spacingAndGlyphs"':'';
        var dy=lines.length===1?'0.32em':(li===0?'-0.32em':'1.16em');
        return '<tspan x="'+tx.toFixed(2)+'" dy="'+dy+'"'+clamp+'>'+esc(ln)+'</tspan>';
      }).join('');
      labels+='<text x="'+tx.toFixed(2)+'" y="'+ty.toFixed(2)+'" transform="rotate('+rot.toFixed(2)+' '+tx.toFixed(2)+' '+ty.toFixed(2)+')" fill="'+textColor+'" font-family="Pretendard,sans-serif" font-size="'+fs+'" font-weight="700" text-anchor="middle" dominant-baseline="middle">'+tspans+'</text>';
    }
    var ln='';
    for(var j=0;j<n;j++){var a=-Math.PI/2+j*slice,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);ln+='<line x1="'+cx+'" y1="'+cy+'" x2="'+x.toFixed(2)+'" y2="'+y.toFixed(2)+'" stroke="rgba(184,151,126,0.42)" stroke-width="0.5"/>';}
    svg.setAttribute('viewBox','0 0 320 320');
    svg.innerHTML='<g id="wheel-rotate">'+wedges+ln+labels+'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#B8977E" stroke-width="1.5"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(r-8)+'" fill="none" stroke="rgba(184,151,126,0.25)" stroke-width="0.5"/></g><circle cx="'+cx+'" cy="'+cy+'" r="26" fill="#0A1D37" stroke="#B8977E" stroke-width="1.2"/><circle cx="'+cx+'" cy="'+cy+'" r="20" fill="none" stroke="rgba(184,151,126,0.35)" stroke-width="0.5"/><circle cx="'+cx+'" cy="'+cy+'" r="6" fill="#B8977E"/>';
  }
  function drawBulbs(count){
    var svg=document.querySelector('.roulette-bulbs'); if(!svg)return;
    var cx=180,cy=180,r=168,html='';
    for(var i=0;i<count;i++){var a=Math.PI*2*i/count-Math.PI/2,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a),d=((i%4)*0.4).toFixed(2);html+='<circle class="bulb" cx="'+x.toFixed(2)+'" cy="'+y.toFixed(2)+'" r="3.4" style="animation-delay:'+d+'s"/>';}
    svg.innerHTML=html;
  }
  function drawMarquee(prizes){
    var t=document.getElementById('roulette-marquee-track'); if(!t)return;
    var labels=prizes.map(function(p){return (typeof p==='string')?p:(p.name||'');}).filter(Boolean);
    var html=labels.map(function(n){return '<span class="m-item">'+esc(n)+'</span>';}).join('');
    t.innerHTML=html+html;
  }
  function openRoulette(){var o=document.getElementById('roulette-overlay');if(o)o.classList.add('is-open');}
  function closeRoulette(){
    var o=document.getElementById('roulette-overlay'); if(!o)return;
    o.style.opacity='0';
    setTimeout(function(){o.classList.remove('is-open');o.classList.remove('is-result');o.style.opacity='';},400);
  }
  function spinRoulette(){
    if(isSpinning)return;
    var wheel=document.querySelector('#roulette-img #wheel-rotate'); if(!wheel)return;
    isSpinning=true;
    var c=document.getElementById('canvas-container'); if(c)c.classList.add('is-spinning');
    var b=document.getElementById('spin-button'); if(b)b.classList.add('is-spinning');
    var rbox=document.getElementById('roulette-result'); if(rbox)rbox.classList.remove('is-shown');
    var pool=SEQUENCE[spinCount]||DEFAULT_AFTER;
    var targetName=pool[Math.random()*pool.length|0];
    var matches=[]; for(var i=0;i<WHEEL.length;i++){ if(WHEEL[i]===targetName) matches.push(i); }
    var idx=matches.length?matches[Math.random()*matches.length|0]:0;
    spinCount++;
    var isFinal=spinCount>=SEQUENCE.length;
    var slice=360/WHEEL.length;
    var target=(360-(idx*slice+slice/2))%360, jitter=(Math.random()-0.5)*(slice*0.4), spins=10*360;
    var base=currentRotation-(currentRotation%360);
    var finalAngle=base+spins+target+jitter;
    wheel.style.transformOrigin='160px 160px';
    wheel.style.transition='transform 4.6s cubic-bezier(0.17,0.84,0.22,1)';
    wheel.style.transform='rotate('+finalAngle+'deg)';
    currentRotation=finalAngle;
    setTimeout(function(){
      var won=WHEEL[idx];
      if(c)c.classList.remove('is-spinning');
      burst();
      if(isFinal){
        if(b){ b.classList.add('is-spinning'); b.disabled=true; }
        if(c){ c.style.pointerEvents='none'; }
        if(ONCE_PER_DEVICE){try{localStorage.setItem(STORE_KEY,'1');}catch(e){}}
        showResult(won);
      } else {
        if(b)b.classList.remove('is-spinning');
        isSpinning=false;
        showInterim(won);
      }
    },4600);
  }
  function showInterim(prizeName){
    var box=document.getElementById('roulette-result');
    if(box){
      box.innerHTML='<span class="label">1st Draw</span><span class="prize-name">'+esc(prizeName)+' 당첨!</span><span class="kr-note">행운의 기회 한 번 더! 아래 버튼을 눌러 다시 돌려보세요</span>';
      box.classList.add('is-shown');
    }
    var lbl=document.querySelector('.spin-button-label'); if(lbl) lbl.textContent='한 번 더';
    var hint=document.querySelector('.roulette-hint span'); if(hint) hint.textContent='마지막 찬스 — 큰 선물이 기다려요!';
  }
  function showResult(prizeName){
    var o=document.getElementById('roulette-overlay'); if(o)o.classList.add('is-result');
    var box=document.getElementById('roulette-result');
    if(box){
      box.innerHTML='<span class="label">Congratulations</span><span class="prize-name">'+esc(prizeName)+'</span><span class="kr-note">잠시 후 신청 폼이 열립니다</span>';
      box.classList.add('is-shown');
    }
    setTimeout(function(){
      closeRoulette();
      evResult = prizeName; window.evResult = prizeName;
      try{localStorage.setItem('hbWonPrize',prizeName);var _now=Date.now();localStorage.setItem('hbWonDate',String(_now));var _dl=document.getElementById('evDeadline');if(_dl)_dl.innerText=fmtDeadline(_now);}catch(e){}
      var pt=document.getElementById('evPrizeText'); if(pt) pt.innerText="당첨 혜택 : "+prizeName;
      var fs=document.getElementById('evFormSec'); if(fs){ fs.style.display='block'; }
      setTimeout(function(){ if(fs){ var top=fs.getBoundingClientRect().top+window.scrollY-20; window.scrollTo({top:top,behavior:'smooth'}); } },350);
    },2800);
  }
  var cctx=null, parts=[], raf=null;
  function setupConfetti(){
    var cv=document.getElementById('roulette-confetti'); if(!cv)return;
    function rs(){cv.width=innerWidth*devicePixelRatio;cv.height=innerHeight*devicePixelRatio;cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';}
    rs(); addEventListener('resize',rs); cctx=cv.getContext('2d');
  }
  function burst(){
    if(!cctx)return;
    var colors=['#b89968','#d4bc8e','#f3dca6','#fff7e0','#927649'], ox=innerWidth*0.5, oy=innerHeight*0.46;
    for(var i=0;i<120;i++){var ang=Math.random()*Math.PI*2,sp=4+Math.random()*9;
      parts.push({x:ox,y:oy,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp-3,g:0.18+Math.random()*0.1,w:4+Math.random()*6,h:6+Math.random()*8,rot:Math.random()*Math.PI*2,vr:(Math.random()-0.5)*0.3,color:colors[Math.random()*colors.length|0],life:0,maxLife:140+Math.random()*60,shape:Math.random()<0.4?'rect':(Math.random()<0.6?'diamond':'line')});}
    if(!raf)loop();
  }
  function loop(){
    var ctx=cctx; if(!ctx)return; var cw=ctx.canvas.width,ch=ctx.canvas.height; ctx.clearRect(0,0,cw,ch); var dpr=devicePixelRatio;
    for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;p.life++;
      var fade=p.life>p.maxLife-30?Math.max(0,(p.maxLife-p.life)/30):1;
      ctx.save();ctx.globalAlpha=fade;ctx.translate(p.x*dpr,p.y*dpr);ctx.rotate(p.rot);ctx.fillStyle=p.color;ctx.strokeStyle=p.color;
      if(p.shape==='rect'){ctx.fillRect(-p.w/2*dpr,-p.h/2*dpr,p.w*dpr,p.h*dpr);}
      else if(p.shape==='diamond'){ctx.beginPath();ctx.moveTo(0,-p.h/2*dpr);ctx.lineTo(p.w/2*dpr,0);ctx.lineTo(0,p.h/2*dpr);ctx.lineTo(-p.w/2*dpr,0);ctx.closePath();ctx.fill();}
      else{ctx.lineWidth=1.6*dpr;ctx.beginPath();ctx.moveTo(-p.h/2*dpr,0);ctx.lineTo(p.h/2*dpr,0);ctx.stroke();}
      ctx.restore();
      if(p.life>=p.maxLife||p.y>innerHeight+60)parts.splice(i,1);
    }
    if(parts.length>0)raf=requestAnimationFrame(loop); else{raf=null;ctx.clearRect(0,0,cw,ch);}
  }
  function initRoulette(){
    var _q=(location.search+' '+location.hash).toLowerCase();
    if(_q.indexOf('resetroulette')!==-1){try{localStorage.removeItem(STORE_KEY);}catch(e){}}
    else if(ONCE_PER_DEVICE){try{if(localStorage.getItem(STORE_KEY))return;}catch(e){}}
    drawWheel(WHEEL); drawBulbs(24); drawMarquee(MARQUEE); setupConfetti();
    setTimeout(openRoulette, OPEN_DELAY);
  }
  function _escH(s){ return String(s==null?'':s).replace(/[<>&]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c];}); }
  function _bigWrap(s){ return _escH(s).replace(/(\d+)/, '<span class="mag-big">$1</span>'); }
  function _benefitBlock(ev, idx){
    var rn=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ'][idx]||String(idx+1);
    var hasBig=/[0-9]/.test(String(ev.hot||''));
    var cls='ev-block'+(ev.before?' tight lead':(hasBig?' tight':''));
    var hotHtml='<span class="hot">'+_bigWrap(ev.hot||'')+'</span>';
    var benefit=ev.before ? '<s>'+_escH(ev.before)+'</s> → '+hotHtml+_escH(ev.tail||'') : hotHtml+_escH(ev.tail||'');
    return '<div class="'+cls+'"><div class="ev-head"><span class="ev-tag">이벤트 <span class="rn">'+rn+'</span></span><span class="ev-line"></span></div>'
      +'<div class="mag-label">'+_escH(ev.label||'')+'</div>'
      +'<div class="mag-benefit">'+benefit+'</div></div>';
  }
  function _buildBenefits(data){ if(!data||!data.events||!data.events.length) return ''; var evs=data.events.filter(function(e){ return (e.label&&String(e.label).trim())||(e.hot&&String(e.hot).trim()); }); if(!evs.length) return ''; var h=evs.map(_benefitBlock).join(''); if(data.note) h+='<div class="mag-note">'+data.note+'</div>'; return h; }
  function _benefitsData(code){
    try{ var m=JSON.parse(localStorage.getItem('hbBranchBenefits')||'null'); if(m&&m[code]&&m[code].events&&m[code].events.length) return m[code]; }catch(e){}
    var D=window.HB_BENEFITS_DATA||{}; return D[code]||D._default||null;
  }
  function applyBranch(){
    var cfg=(window.HB_BRANCHES&&window.HB_BRANCHES[window.HB_BRANCH]); if(!cfg) return;
    var t=cfg.tel||[], k=cfg.kakao||[], r=cfg.reserve||[];
    if(t[0]){ LINKS.call.bs='tel:'+t[0]; LINKS.call.ct='tel:'+(t[1]||t[0]); }
    if(k[0]){ LINKS.kakao.bs='https://open.kakao.com/o/'+k[0]; LINKS.kakao.ct='https://open.kakao.com/o/'+(k[1]||k[0]); }
    if(r[0]){ LINKS.reserve.bs=r[0]; LINKS.reserve.ct=r[1]||r[0]; }
    try{
      var addr=cfg.addr||[]; var geo=cfg.geo||[];
      function _renderMap(el,g){
        if(_hbMaps.indexOf(el.__m)<0){ el.__m={el:el,g:g}; _hbMaps.push(el.__m); }
        if(_naverReady && typeof naver!=='undefined' && naver.maps){
          try{ el.innerHTML=''; var pos=new naver.maps.LatLng(g[0],g[1]); var map=new naver.maps.Map(el,{center:pos,zoom:16,scrollWheel:false}); new naver.maps.Marker({position:pos,map:map}); return; }catch(e){}
        }
        _osmInto(el,g);
      }
      function _setMap(card,g){ if(!card||!g) return; var el=card.querySelector('.naver-map,iframe'); if(!el) return; if(el.tagName==='IFRAME'){ var d=document.createElement('div'); d.className='naver-map'; el.parentNode.replaceChild(d,el); el=d; } el.__mg=g; _loadNaver(function(){ _renderMap(el,g); }); }
      var h2=document.querySelector('.info-sec h2'); if(h2) h2.innerText='한빔한복 '+cfg.name+' 위치안내';
      var cards=document.querySelectorAll('.map-card');
      if(cards[0]){ var h0=cards[0].querySelector('h3'); if(h0) h0.innerText=(cfg.dual?cfg.dual[0]:cfg.name); var a0=cards[0].querySelector('.addr-text'); if(a0&&addr[0]) a0.innerText=addr[0]; _setMap(cards[0],geo[0]); }
      if(cards[1]){ if(cfg.dual&&addr[1]){ cards[1].style.display=''; var h1=cards[1].querySelector('h3'); if(h1) h1.innerText=cfg.dual[1]; var a1=cards[1].querySelector('.addr-text'); if(a1) a1.innerText=addr[1]; _setMap(cards[1],geo[1]); var mc0=document.querySelector('.dual-map-container'); if(mc0) mc0.style.gridTemplateColumns=''; } else { cards[1].style.display='none'; var mc=document.querySelector('.dual-map-container'); if(mc) mc.style.gridTemplateColumns='1fr'; } }
      var biz=document.querySelectorAll('.biz-item'); var st=document.querySelectorAll('.ft-strong');
      var _names=cfg.dual||[cfg.name], _ceo=cfg.ceo||[], _reg=cfg.reg||[], _tel=cfg.tel||[];
      function _fmtTel(d){ d=String(d||'').replace(/[^0-9]/g,''); if(!d) return ''; if(d.length===11&&d.charAt(0)==='0'&&d.charAt(1)==='1') return d.slice(0,3)+'-'+d.slice(3,7)+'-'+d.slice(7); if(d.length===10&&d.slice(0,2)==='02') return d.slice(0,2)+'-'+d.slice(2,6)+'-'+d.slice(6); if(d.length===10) return d.slice(0,3)+'-'+d.slice(3,6)+'-'+d.slice(6); if(d.length===9&&d.slice(0,2)==='02') return d.slice(0,2)+'-'+d.slice(2,5)+'-'+d.slice(5); return d; }
      function _bizHTML(i){ var h='<span class="ft-strong">한빔한복 '+_names[i]+'</span>'; if(_ceo[i]) h+='대표자: '+_ceo[i]+'<br>'; if(_reg[i]) h+='등록번호: '+_reg[i]+'<br>'; if(_tel[i]) h+='TEL.'+_fmtTel(_tel[i]); return h; }
      if(biz[0]) biz[0].innerHTML=_bizHTML(0);
      if(biz[1]){ if(_names[1]){ biz[1].style.display=''; biz[1].innerHTML=_bizHTML(1); } else { biz[1].style.display='none'; } }
      var bsel=document.getElementById('evBranch');
      if(bsel){ bsel.innerHTML=''; (cfg.dual||[cfg.name]).forEach(function(nm){ var o=document.createElement('option'); o.value=nm; o.text='당첨지급지점: '+nm; bsel.appendChild(o); }); }
      var mlines=document.querySelector('.mag-lines');
      if(mlines){ var _bd=_benefitsData(window.HB_BRANCH); var _bhtml=_bd?_buildBenefits(_bd):''; if(_bhtml) mlines.innerHTML=_bhtml; }
    }catch(e){}
  }
  window.hbSetBranch=function(c){ window.HB_BRANCH=c; applyBranch(); };
  function startCountdown(){
    var el=document.getElementById('hbCountdown'); if(!el) return;
    var end=new Date(2026,6,31,23,59,59).getTime();
    function tick(){ var d=end-Date.now(); if(d<=0){ el.textContent='이벤트 종료'; clearInterval(window._hbCd); return; } var days=Math.floor(d/86400000),h=Math.floor(d%86400000/3600000),m=Math.floor(d%3600000/60000),s=Math.floor(d%60000/1000); el.textContent='마감 D-'+days+' · '+('0'+h).slice(-2)+':'+('0'+m).slice(-2)+':'+('0'+s).slice(-2); }
    tick(); clearInterval(window._hbCd); window._hbCd=setInterval(tick,1000);
  }
  function boot(){
    applyBranch();
    startCountdown();
    try{ if(window.HB_BRANCHES && _forcePick && !document.getElementById('hbPreviewPick')){ var sel=document.createElement('select'); sel.id='hbPreviewPick'; sel.title='미리보기 지점 선택'; sel.style.cssText='position:fixed;top:8px;left:8px;z-index:99999;padding:7px 10px;border-radius:8px;border:1px solid #B8977E;background:#0A1D37;color:#E7CE93;font-family:Pretendard,sans-serif;font-size:13px;box-shadow:0 4px 14px rgba(0,0,0,.35);'; Object.keys(window.HB_BRANCHES).forEach(function(c){ var o=document.createElement('option'); o.value=c; o.text=window.HB_BRANCHES[c].name+' ('+c+')'; if(c===window.HB_BRANCH)o.selected=true; sel.appendChild(o); }); sel.addEventListener('change',function(){ window.hbSetBranch(sel.value); }); document.body.appendChild(sel); } }catch(e){}
    var q=function(s){return document.querySelector(s);};
    [['.btn-call','call'],['.btn-kakao','kakao'],['.btn-reserve','reserve']].forEach(function(p){var el=q(p[0]); if(el) el.addEventListener('click',function(){openModal(p[1]);});});
    var sm=document.getElementById('selectModal');
    if(sm){ sm.addEventListener('click',closeModal); var mc=sm.querySelector('.modal-content'); if(mc)mc.addEventListener('click',function(e){e.stopPropagation();}); var cl=sm.querySelector('.modal-close'); if(cl)cl.addEventListener('click',closeModal); }
    var evb=q('.ev-btn'); if(evb) evb.addEventListener('click',submitEvData);
    var ph=document.getElementById('evPhone'); if(ph) ph.addEventListener('input',function(e){var v=e.target.value.replace(/[^0-9]/g,''); if(v.length>11)v=v.substring(0,11); if(v.length<4)e.target.value=v; else if(v.length<8)e.target.value=v.substr(0,3)+'-'+v.substr(3); else e.target.value=v.substr(0,3)+'-'+v.substr(3,4)+'-'+v.substr(7);});
    try{ var _wp=localStorage.getItem('hbWonPrize'); if(_wp){ evResult=_wp; window.evResult=_wp; var _pt=document.getElementById('evPrizeText'); if(_pt) _pt.innerText="당첨 혜택 : "+_wp; var _fs=document.getElementById('evFormSec'); if(_fs) _fs.style.display='block'; var _wd=parseInt(localStorage.getItem('hbWonDate')||'0',10); var _dl=document.getElementById('evDeadline'); if(_dl&&_wd) _dl.innerText=fmtDeadline(_wd); } }catch(e){}
    if(!ROULETTE_ENABLED) return;
    var cc=document.getElementById('canvas-container'); if(cc) cc.addEventListener('click',spinRoulette);
    var sb=document.getElementById('spin-button'); if(sb) sb.addEventListener('click',function(e){e.stopPropagation();spinRoulette();});
    document.querySelectorAll('.roulette-close,.roulette-later').forEach(function(el){el.addEventListener('click',closeRoulette);});
    initRoulette();
  }
  window.__hbBoot = boot;
})();

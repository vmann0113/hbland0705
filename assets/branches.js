window.HB_BRANCHES = {
  bs: { name:"부산/센텀", dual:["부산점","센텀점"], tel:["0516342325","01030522325"], kakao:["soq7Ns4d","sz1xltbi"],
        ceo:["김태현","이명진"], reg:["637-48-00829","410-10-03229"],
        geo:[[35.1432,129.0645],[35.1693,129.1303]],
        reserve:["https://m.booking.naver.com/booking/6/bizes/661812","https://booking.naver.com/booking/6/bizes/1577219"],
        addr:["부산광역시 부산진구 자유평화로 17, 3층 (범천동)","부산광역시 해운대구 센텀3로 20, 3층 304호 (우동, 센텀호텔)"] },
  cm: { name:"창원/마산", dual:["창원점","마산점"], tel:["0552632325","01088322325"], kakao:["sdcvbh5e","ssWvuvYh"],
        ceo:["이은수","김미경"], reg:["537-02-01903","405-03-97036"],
        geo:[[35.2274,128.6811],[35.2201,128.5744]],
        reserve:["https://booking.naver.com/booking/6/bizes/843111","https://booking.naver.com/booking/6/bizes/1526541"],
        addr:["경상남도 창원시 성산구 동산로 208-2, 1층 (사파동)","경상남도 창원시 마산합포구 합포로 236, 1층 105호 (산호동)"] },
  us: { name:"울산점", tel:["01098072325"], kakao:["sKjCbA0h"],
        ceo:["강주석"], reg:["785-16-02736"], geo:[[35.5583,129.3621]],
        reserve:["https://booking.naver.com/booking/6/bizes/1534767"],
        addr:["울산광역시 북구 명촌23길 71, 2층"] },
  gh: { name:"김해점", tel:["01080652325"], kakao:["sHM2wwsh"],
        ceo:["최현일"], reg:["564-10-02888"], geo:[[35.2343,128.8722]],
        reserve:["https://booking.naver.com/booking/6/bizes/1402679"],
        addr:["경상남도 김해시 내외중앙로 137, 1층 146, 147호"] },
  ys: { name:"양산점", tel:["0559120425"], kakao:["sp44Hxaf"],
        ceo:[""], reg:[""], geo:[[35.3345,129.0205]],
        reserve:["https://booking.naver.com/booking/13/bizes/868629"],
        addr:["경상남도 양산시 물금읍 부산대학로 144, 2층"] },
  jj: { name:"진주점", tel:["01056542407"], kakao:["sbxBToNh"],
        ceo:["김태현"], reg:["509-08-03228"], geo:[[35.1802,128.1481]],
        reserve:["https://m.booking.naver.com/booking/6/bizes/1485854"],
        addr:["경상남도 진주시 에나로 103-7, 1층 102호"] },
  ic: { name:"인천점", tel:["0322832325"], kakao:["sIrXajUf"],
        ceo:["손현희"], reg:["518-05-02862"], geo:[[37.5074,126.7371]],
        reserve:["https://m.booking.naver.com/booking/13/bizes/1039475"],
        addr:["인천광역시 부평구 체육관로 34, 4층 402호 (삼산동 이리옴프라자)"] },
  as: { name:"안산점", tel:["01065912322"], kakao:["s5l7eK5h"],
        ceo:["진서효"], reg:["685-25-02234"], geo:[[37.3101,126.8306]],
        reserve:["https://m.booking.naver.com/booking/6/bizes/1500008"],
        addr:["경기도 안산시 단원구 고잔동 이삭5길 13, 2층"] },
  dg: { name:"대구점", tel:["01084922328"], kakao:["sqPdeNfi"],
        ceo:["이은수"], reg:["564-86-03994"], geo:[[35.8753,128.7456]],
        reserve:["https://m.place.naver.com/place/2043617700/ticket"],
        addr:["대구광역시 동구 메디밸리로 19, 대동타워 303호 (혁신도시)"] }
};

// 지점별 히어로 혜택 (구조화 데이터). 관리페이지에서 편집 시 localStorage 'hbBranchBenefits'가 우선.
// 이벤트: { label:항목, before:정가(선택·취소선), hot:강조혜택, tail:뒤 일반텍스트(선택) }
window.HB_BENEFITS_DATA = {
  _default: { events:[
    { label:"웨딩촬영용 한복 대여", before:"20만원", hot:"11만원", tail:"" },
    { label:"최고급 혼주한복", hot:"라벨 업그레이드 or 룰렛상품권", tail:"" },
    { label:"한복 대여", hot:"무료 피팅 3회", tail:" 서비스" }
  ], note:"" },
  jj: { events:[
    { label:"웨딩촬영용 한복 대여", before:"20만원", hot:"11만원", tail:"" },
    { label:"최고급 혼주한복 대여", before:"33만원", hot:"22만원", tail:"" }
  ], note:"원단·라벨·종류 상관없이 <b>추가금 NO!</b>" }
};

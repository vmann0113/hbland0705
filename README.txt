══════════════════════════════════════════════════════════
한빔한복 통합 랜딩 · 배포 패키지 (hbland0705)
══════════════════════════════════════════════════════════

■ 구성 (이 폴더 전체를 리포지토리 루트에 올리세요)
  index.html            공개 페이지 (전 지점 공통, ?b=지점코드로 분기)
  admin.html            관리 페이지 (룰렛 ON/OFF · 지점별 이미지 · 지점별 혜택 · 당첨 리드)
  support.js            런타임
  assets/               이미지 + branches.js / hb-boot.js / image-slot.js

■ 지점 접속 URL   (도메인 예: https://<사용자>.github.io/hbland0705/)
  부산/센텀   /?b=bs      울산   /?b=us      진주   /?b=jj      안산   /?b=as
  창원/마산   /?b=cm      김해   /?b=gh      인천   /?b=ic      대구   /?b=dg
  양산        /?b=ys
  * ?b 가 없으면 부산/센텀(bs)로 뜹니다. 광고/QR엔 지점별 ?b= URL을 쓰세요.
  * ?b 가 있으면 좌상단 미리보기 선택탭은 자동으로 숨겨집니다. (강제표시: ?pick=1)

  관리 페이지  /admin.html

■ GitHub Pages 배포
  1) 이 폴더의 파일들을 hbland0705 리포 루트에 push
  2) Settings → Pages → Source: Deploy from a branch → main / (root) → Save
  3) 1~2분 후 https://<사용자>.github.io/hbland0705/?b=bs 접속 확인

■ 지점별 혜택 편집
  admin.html → "지점별 혜택" 탭 → 지점 선택 → 편집 → 저장
  (같은 브라우저의 공개 페이지에 반영. 전 직원 공유가 필요하면 아래 서버연동 참고)

■ 당첨/신청 데이터 (구글 시트)
  - 사이트는 신청 시 GAS로 확실히 전송(JSONP)합니다. 저장은 기존 시트 그대로.
  - admin.html "당첨 · 리드" 탭에서 실데이터를 보려면, 구글 Apps Script에
    조회(doGet) 엔드포인트가 필요합니다 → 프로젝트의 docs/GAS-읽기엔드포인트.txt 참고.

■ 참고
  - 혜택/룰렛 설정은 현재 브라우저 localStorage 기반(기기별)입니다.
    모든 방문자/직원에게 공통 적용하려면 branches.js 값을 직접 수정해 재배포하거나,
    서버(구글시트/DB) 연동이 필요합니다 — 원하시면 방식 제안드립니다.

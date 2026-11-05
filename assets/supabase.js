/* ═══════════════════════════════════════════════════════════
   supabase.js — 한빔한복 랜딩/관리자 공용 데이터 계층

   아래 anon 키는 브라우저에 노출되는 공개 키다. 정상이며,
   실제 보호는 서버의 RLS 정책이 담당한다.
     leads            INSERT 익명 허용 / SELECT 로그인만
     branch_settings  SELECT 공개      / UPDATE 로그인만
   ═══════════════════════════════════════════════════════════ */
(function (w) {
  'use strict';

  var URL_BASE = 'https://icdjtwtbeymmsxvbzrtb.supabase.co';
  var ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZGp0d3RiZXltbXN4dmJ6cnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzkwNzEsImV4cCI6MjEwMzg1NTA3MX0.ij9syLuyAaG32n2ZtdHfINBoW_D8hBoI8FvYOjfIYwY';

  var REST = URL_BASE + '/rest/v1';
  var AUTH = URL_BASE + '/auth/v1';

  function headers(token, extra) {
    var h = {
      'apikey': ANON_KEY,
      'Authorization': 'Bearer ' + (token || ANON_KEY),
      'Content-Type': 'application/json'
    };
    for (var k in (extra || {})) h[k] = extra[k];
    return h;
  }

  /* 전화번호는 숫자만 저장한다. 하이픈 유무로 중복이 새는 걸 막는다. */
  function normPhone(p) { return String(p || '').replace(/[^0-9]/g, ''); }

  /* ─── 신청 등록 ───────────────────────────────────────────
     반환: {ok:true} | {duplicate:true} | {ok:false, status, message}
     RLS 상 anon 은 SELECT 불가이므로 return=minimal 이 필수다.  */
  function insertLead(data) {
    return fetch(REST + '/leads', {
      method: 'POST',
      headers: headers(null, { 'Prefer': 'return=minimal' }),
      body: JSON.stringify({
        name: String(data.name || '').trim(),
        phone: normPhone(data.phone),
        prize: data.prize || null,
        branch: data.branch || null,
        source: 'web'
      })
    }).then(function (r) {
      if (r.status === 201) return { ok: true };
      if (r.status === 409) return { duplicate: true };
      return r.text().then(function (t) {
        return { ok: false, status: r.status, message: t };
      });
    });
  }

  /* ─── 지점별 룰렛 ON/OFF 조회 ─────────────────────────────
     실패 시 null 을 돌려주고, 호출측은 기존 동작(노출)을 유지한다. */
  function getSettings() {
    return fetch(REST + '/branch_settings?select=branch,roulette_on,benefits', {
      headers: headers()
    }).then(function (r) {
      if (!r.ok) return null;
      return r.json();
    }).then(function (rows) {
      if (!rows) return null;
      var m = { roulette: {}, benefits: {} };
      rows.forEach(function (x) {
        m.roulette[x.branch] = x.roulette_on;
        if (x.benefits) m.benefits[x.branch] = x.benefits;
      });
      return m;
    }).catch(function () { return null; });
  }

  /* ─── 관리자 로그인 ──────────────────────────────────────── */
  function signIn(email, password) {
    return fetch(AUTH + '/token?grant_type=password', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email: email, password: password })
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) {
          var e = new Error(j.error_description || j.msg || j.message || '로그인 실패');
          e.code = j.error_code || j.error || ('http_' + r.status);
          throw e;
        }
        return j.access_token;
      });
    });
  }

  /* ─── 명단 조회 (로그인 필요) ─────────────────────────────── */
  function listLeads(token) {
    return fetch(REST + '/leads?select=*&order=created_at.desc', {
      headers: headers(token)
    }).then(function (r) {
      if (!r.ok) throw new Error('조회 실패 (' + r.status + ')');
      return r.json();
    });
  }

  /* ─── 룰렛 토글 (로그인 필요) ─────────────────────────────── */
  function setRoulette(branch, on, token) {
    return fetch(REST + '/branch_settings?branch=eq.' + encodeURIComponent(branch), {
      method: 'PATCH',
      headers: headers(token, { 'Prefer': 'return=representation' }),
      body: JSON.stringify({ roulette_on: !!on, updated_at: new Date().toISOString() })
    }).then(function (r) {
      if (!r.ok) throw new Error('저장 실패 (' + r.status + ')');
      return r.json();
    }).then(function (rows) {
      /* 정책상 0건이 갱신돼도 200 이 온다. 실제 반영 여부를 확인한다. */
      if (!rows || !rows.length) throw new Error('권한이 없어 저장되지 않았습니다.');
      return rows[0];
    });
  }

  /* ─── 지점 혜택 저장 (로그인 필요) ───────────────────────── */
  function setBenefits(branch, benefits, token) {
    return fetch(REST + '/branch_settings?branch=eq.' + encodeURIComponent(branch), {
      method: 'PATCH',
      headers: headers(token, { 'Prefer': 'return=representation' }),
      body: JSON.stringify({ benefits: benefits, updated_at: new Date().toISOString() })
    }).then(function (r) {
      if (!r.ok) throw new Error('저장 실패 (' + r.status + ')');
      return r.json();
    }).then(function (rows) {
      /* 권한이 없으면 0건 갱신되고도 200 이 온다. 실제 반영을 확인한다. */
      if (!rows || !rows.length) throw new Error('권한이 없어 저장되지 않았습니다.');
      return rows[0];
    });
  }

  w.HBDB = {
    insertLead: insertLead,
    getSettings: getSettings,
    signIn: signIn,
    listLeads: listLeads,
    setRoulette: setRoulette,
    setBenefits: setBenefits,
    normPhone: normPhone
  };
})(window);

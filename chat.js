/* Popup chat CatSociety. Pasang di halaman dengan: <script src="chat.js" defer></script> */
(function () {
  // ====== GANTI ALAMAT INI dengan alamat Worker Anda + /chat ======
  var CFG = {
    api: (window.CS_WORKER || "") + "/chat",
    wa: "6289654978033",
    max: 5,
    links: [
      ["🛍️ Katalog", "katalog.html"],
      ["Shopee", "https://s.shopee.co.id/7zx8YazCsb"],
      ["Blibli", "https://blibli.onelink.me/GNtk/5qwj2i03"],
      ["Toco", "https://toco.id/link/3gtC7879R7nbFtY5GxPBy1"]
    ]
  };

  // Belum diisi: popup tidak ditampilkan (halaman tetap normal)
  if (!window.CS_WORKER || window.CS_WORKER.indexOf("GANTI") > -1) return;

  var css = ".cc-btn{position:fixed;right:18px;bottom:18px;z-index:9999;width:60px;height:60px;border-radius:50%;border:0;background:#93371d;color:#fff;font-size:28px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3)}" +
    ".cc-btn:focus-visible,.cc-box button:focus-visible,.cc-box input:focus-visible,.cc-box a:focus-visible{outline:3px solid #1a73e8;outline-offset:2px}" +
    ".cc-box{position:fixed;right:18px;bottom:90px;z-index:9999;width:340px;max-width:calc(100vw - 24px);height:480px;max-height:calc(100vh - 110px);background:#fff;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.3);display:none;flex-direction:column;overflow:hidden;font-family:Nunito,Arial,sans-serif;font-size:14px;color:#333}" +
    ".cc-box.cc-buka{display:flex}" +
    ".cc-head{background:#93371d;color:#fff;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px}" +
    ".cc-head b{display:block;font-size:15px}.cc-head small{opacity:.9}" +
    ".cc-head a,.cc-head button{color:#fff;background:rgba(255,255,255,.18);border:0;border-radius:99px;padding:5px 10px;font:inherit;font-size:12px;text-decoration:none;cursor:pointer}" +
    ".cc-log{flex:1;overflow-y:auto;padding:12px;background:#fff4ea;display:flex;flex-direction:column;gap:8px}" +
    ".cc-m{max-width:85%;padding:8px 12px;border-radius:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}" +
    ".cc-bot{background:#fff;align-self:flex-start;border-bottom-left-radius:4px}" +
    ".cc-me{background:#93371d;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}" +
    ".cc-chips{display:flex;flex-wrap:wrap;gap:6px}.cc-chips button{border:1px dashed #93371d;background:#fff;color:#93371d;border-radius:99px;padding:5px 10px;font:inherit;font-size:12px;cursor:pointer}" +
    ".cc-menu{background:#fff8c9;border:2px dashed #93371d;border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:6px}" +
    ".cc-menu a{display:block;text-align:center;padding:8px;border-radius:99px;background:#fff;color:#93371d;font-weight:700;text-decoration:none;border:1px solid #93371d}" +
    ".cc-menu a.cc-wa{background:#25d366;color:#fff;border-color:#25d366}" +
    ".cc-menu .cc-row{display:flex;gap:6px}.cc-menu .cc-row a{flex:1;font-size:12px}" +
    ".cc-foot{padding:8px;border-top:1px solid #eee;background:#fff}" +
    ".cc-form{display:flex;gap:6px}.cc-form input{flex:1;padding:9px 12px;border:1px solid #ccc;border-radius:99px;font:inherit}" +
    ".cc-form button{border:0;background:#93371d;color:#fff;border-radius:99px;padding:0 16px;font:inherit;font-weight:700;cursor:pointer}" +
    ".cc-form button:disabled,.cc-form input:disabled{opacity:.5;cursor:not-allowed}" +
    ".cc-note{font-size:11px;color:#666;margin:6px 4px 0}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; }
  function acak() { return Math.random().toString(36).slice(2, 12) + Date.now().toString(36); }
  var sid; try { sid = localStorage.getItem("cs_sid"); if (!sid) { sid = acak(); localStorage.setItem("cs_sid", sid); } } catch (e) { sid = acak(); }
  var pesanPertama = "", selesai = false;

  var tombol = el("button", "cc-btn", "🐾"); tombol.type = "button";
  tombol.setAttribute("aria-label", "Buka chat dengan Buncil"); tombol.setAttribute("aria-expanded", "false");
  var box = el("div", "cc-box"); box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Chat dengan Buncil, asisten CatSociety");

  var head = el("div", "cc-head"), judul = el("div");
  judul.appendChild(el("b", "", "Buncil 🐱")); judul.appendChild(el("small", "", "Asisten otomatis (AI) CatSociety"));
  var aksi = el("div"), admin = el("a", "", "💬 Admin"); admin.target = "_blank"; admin.rel = "noopener";
  function waLink() { return "https://wa.me/" + CFG.wa + "?text=" + encodeURIComponent("Halo CatSociety! Saya habis ngobrol dengan Buncil di website." + (pesanPertama ? " Cerita saya: " + pesanPertama.slice(0, 150) : "")); }
  admin.href = waLink(); admin.onclick = function () { admin.href = waLink(); };
  var tutup = el("button", "", "✕"); tutup.type = "button"; tutup.setAttribute("aria-label", "Tutup chat"); tutup.style.marginLeft = "6px";
  aksi.appendChild(admin); aksi.appendChild(tutup); head.appendChild(judul); head.appendChild(aksi);

  var log = el("div", "cc-log"); log.setAttribute("role", "log"); log.setAttribute("aria-live", "polite");
  var foot = el("div", "cc-foot"), form = el("form", "cc-form"), inp = el("input"), kirim = el("button", "", "Kirim");
  inp.type = "text"; inp.maxLength = 500; inp.placeholder = "Ceritakan juraganmu…"; inp.setAttribute("aria-label", "Pesan untuk Buncil");
  kirim.type = "submit"; form.appendChild(inp); form.appendChild(kirim);
  var cat = el("p", "cc-note", "Buncil adalah AI. Jangan kirim data pribadi. Balasan 0/" + CFG.max);
  foot.appendChild(form); foot.appendChild(cat);
  box.appendChild(head); box.appendChild(log); box.appendChild(foot);
  document.body.appendChild(tombol); document.body.appendChild(box);

  function gelembung(teks, me) { var m = el("div", "cc-m " + (me ? "cc-me" : "cc-bot"), teks); log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
  function menu() {
    var d = el("div", "cc-menu"); d.appendChild(el("b", "", "Mau lanjut? 🐾"));
    var a = el("a", "cc-wa", "💬 Ngobrol dengan admin (WhatsApp)"); a.href = waLink(); a.target = "_blank"; a.rel = "noopener"; d.appendChild(a);
    d.appendChild(el("span", "", "Yuk order:"));
    var row = el("div", "cc-row");
    CFG.links.forEach(function (l) { var x = el("a", "", l[0]); x.href = l[1]; if (l[1].indexOf("http") === 0) { x.target = "_blank"; x.rel = "noopener"; } row.appendChild(x); });
    d.appendChild(row); log.appendChild(d); log.scrollTop = log.scrollHeight;
  }
  function akhiri() { selesai = true; inp.disabled = true; kirim.disabled = true; inp.placeholder = "Obrolan hari ini selesai. Sampai besok! 🐾"; menu(); }

  var mulai = false;
  function sapa() {
    if (mulai) return; mulai = true;
    gelembung("Halo, Pawrent! 🐾 Aku Buncil, asisten otomatis CatSociety. Siapa nama juragan kecilmu, dan apa kebiasaan lucunya?");
    var c = el("div", "cc-chips");
    ["Kucingku suka tidur di laptop 😹", "Juraganku lagi susah makan", "Aku sibuk, juragan kesepian"].forEach(function (t) {
      var b = el("button", "", t); b.type = "button"; b.onclick = function () { c.remove(); kirimPesan(t); }; c.appendChild(b);
    });
    log.appendChild(c);
  }
  function kirimPesan(teks) {
    if (selesai || !teks) return;
    if (!pesanPertama) pesanPertama = teks;
    gelembung(teks, true); inp.value = ""; inp.disabled = true; kirim.disabled = true;
    var tunggu = gelembung("Buncil sedang mengetik… ✍️");
    fetch(CFG.api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sid: sid, msg: teks }) })
      .then(function (r) { if (!r.ok) throw new Error("http"); return r.json(); })
      .then(function (d) {
        tunggu.textContent = d.reply; cat.textContent = "Buncil adalah AI. Jangan kirim data pribadi. Balasan " + Math.min(d.n, d.max) + "/" + d.max;
        if (d.done) akhiri(); else { inp.disabled = false; kirim.disabled = false; inp.focus(); }
      })
      .catch(function () { tunggu.textContent = "Buncil sedang istirahat 😴 Yuk ngobrol dengan admin lewat WhatsApp!"; akhiri(); });
  }
  form.onsubmit = function (e) { e.preventDefault(); kirimPesan(inp.value.trim()); };

  function buka(b) {
    box.classList.toggle("cc-buka", b); tombol.setAttribute("aria-expanded", b);
    if (b) { sapa(); if (!inp.disabled) inp.focus(); } else tombol.focus();
  }
  tombol.onclick = function () { buka(!box.classList.contains("cc-buka")); };
  tutup.onclick = function () { buka(false); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && box.classList.contains("cc-buka")) buka(false); });
})();

// ==UserScript==
// @name         PokéSurvivor 自動十連
// @namespace    m2_poke.pokesurvivor-auto-pull
// @version      1.0.1
// @description  自己選好卡池後按 F8，重複按還能按的十連，直到票券不夠或再按一次 F8。
// @match        https://pokesurvivor.com/*
// @match        https://www.pokesurvivor.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // ---------- 可以改的設定 ----------

  // 開始 / 停止。F7 是 Firefox 的「鍵盤瀏覽」，網頁收不到那個鍵。
  // 遊戲進行中的按鍵是 WASD、1–4、Q、E、Esc，F8 不會撞到。
  const HOTKEY = 'F8';

  // 兩個都能按時，排前面的先按。
  // pull-10  = 中間那顆，10 張普通券
  // pull-10b = 右邊那顆，1 張 ×10 券
  // 想先花 ×10 券，把這兩行對調即可。
  const PULL_BUTTONS = ['pull-10', 'pull-10b'];

  // 拉霸支援「點一下加速」。開著會少等很多；想看完整動畫就改成 false。
  const SPEED_UP = true;

  // 十張結果都出來之後，停多久再按「繼續」。想看清楚就調大，例如 2500。
  const RESULT_PAUSE_MS = 800;

  // 按完「繼續」、回到抽卡畫面後，隔多久按下一抽。
  const GAP_MS = 400;

  // 單次十連最久等多久。分頁被切到背景時動畫會變慢，所以留得比較寬。
  const CLOSE_TIMEOUT_MS = 90000;

  // ---------- 以下不用改 ----------

  const SCREEN_ID = 'scr-gacha';
  const OVERLAY_ID = 'pull-fx';
  const CLOSE_ID = 'pull-close';
  const SLOT_ID = 'slot';
  const POLL_MS = 150;

  const LABEL = {
    'pull-10': '普通券 ×10',
    'pull-10b': '×10 券',
  };

  let running = false;
  let stopRequested = false;
  let hideTimer = 0;

  function $(id) {
    return document.getElementById(id);
  }

  function gachaOpen() {
    const screen = $(SCREEN_ID);
    return !!(screen && !screen.classList.contains('hidden'));
  }

  function overlayOpen() {
    const overlay = $(OVERLAY_ID);
    return !!(overlay && !overlay.classList.contains('hidden'));
  }

  function closeReady() {
    const close = $(CLOSE_ID);
    return overlayOpen() && !!(close && !close.classList.contains('hidden'));
  }

  function nextButton() {
    for (const id of PULL_BUTTONS) {
      const button = $(id);
      if (button && !button.disabled) return button;
    }
    return null;
  }

  function sleep(ms) {
    return new Promise((resolve) => {
      const step = 100;
      let left = ms;
      const tick = () => {
        if (stopRequested || left <= 0) {
          resolve();
          return;
        }
        const wait = Math.min(step, left);
        left -= wait;
        setTimeout(tick, wait);
      };
      tick();
    });
  }

  function waitUntil(predicate, timeout) {
    const start = Date.now();
    return new Promise((resolve) => {
      const tick = () => {
        if (stopRequested || predicate()) {
          resolve(true);
          return;
        }
        if (Date.now() - start >= timeout) {
          resolve(false);
          return;
        }
        setTimeout(tick, POLL_MS);
      };
      tick();
    });
  }

  function pill() {
    let el = $('ps-auto-pull-status');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'ps-auto-pull-status';
    el.style.cssText = [
      'position:fixed',
      'top:14px',
      'left:50%',
      'transform:translateX(-50%)',
      'z-index:99999',
      'padding:8px 14px',
      'border-radius:999px',
      'background:rgba(16, 28, 58, 0.94)',
      'color:#f4f7ff',
      'border:1px solid #ffd23f',
      'font:600 14px/1.3 "Segoe UI", sans-serif',
      'letter-spacing:0.02em',
      'pointer-events:none',
      'box-shadow:0 8px 24px rgba(0,0,0,.35)',
    ].join(';');
    document.body.appendChild(el);
    return el;
  }

  function setStatus(text, persist) {
    const el = pill();
    el.textContent = text;
    el.style.display = 'block';
    clearTimeout(hideTimer);
    if (!persist) {
      hideTimer = setTimeout(() => {
        el.style.display = 'none';
      }, 8000);
    }
  }

  async function loop() {
    let done = 0;
    try {
      while (!stopRequested) {
        if (!gachaOpen()) {
          setStatus(done ? `抽卡畫面關了，已完成 ${done} 次十連` : `請先打開抽卡畫面，選好卡池再按 ${HOTKEY}`);
          return;
        }

        const button = nextButton();
        if (!button) {
          setStatus(done ? `票券不夠再抽十連了，已完成 ${done} 次` : '兩個十連按鈕現在都不能按');
          return;
        }

        const kind = LABEL[button.id] || '十連';
        setStatus(`第 ${done + 1} 次十連（${kind}）· 再按 ${HOTKEY} 停止`, true);
        button.click();

        const started = await waitUntil(overlayOpen, 2500);
        if (stopRequested) {
          setStatus(done ? `已停止，完成 ${done} 次十連` : '已停止');
          return;
        }
        if (!started) {
          setStatus('按了沒有進入抽卡，已停止');
          return;
        }

        if (SPEED_UP) {
          const slot = $(SLOT_ID);
          if (slot) slot.click();
        }

        const revealed = await waitUntil(closeReady, CLOSE_TIMEOUT_MS);
        if (stopRequested) {
          setStatus('已停止，這次結果留在畫面上');
          return;
        }
        if (!revealed) {
          setStatus('這次結果等太久，已停止。畫面還在的話，自己按繼續');
          return;
        }

        await sleep(RESULT_PAUSE_MS);
        if (stopRequested) {
          setStatus('已停止，這次結果留在畫面上');
          return;
        }

        const close = $(CLOSE_ID);
        if (close) close.click();
        done += 1;
        await sleep(GAP_MS);
      }

      setStatus(done ? `已停止，完成 ${done} 次十連` : '已停止');
    } catch (err) {
      console.error('[自動十連]', err);
      setStatus('腳本出錯，已停止');
    } finally {
      running = false;
      stopRequested = false;
    }
  }

  function onKey(event) {
    if (event.key !== HOTKEY || event.repeat) return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    event.preventDefault();
    event.stopPropagation();

    if (running) {
      stopRequested = true;
      setStatus('這次結束後停止…', true);
      return;
    }

    if (!gachaOpen()) {
      setStatus(`請先打開抽卡畫面，選好卡池再按 ${HOTKEY}`);
      return;
    }

    if (!PULL_BUTTONS.some((id) => $(id))) {
      setStatus('找不到十連按鈕。請確認是在 pokesurvivor.com 的抽卡畫面');
      return;
    }

    if (!nextButton() && !overlayOpen()) {
      setStatus('兩個十連按鈕現在都不能按');
      return;
    }

    running = true;
    stopRequested = false;
    loop();
  }

  window.addEventListener('keydown', onKey, true);
})();

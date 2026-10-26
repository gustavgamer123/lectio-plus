const DEFAULTS = { enabled: true, theme: 'auto', dashboard: true, skema: true, views: true, hideDone: false };
chrome.storage.sync.get(DEFAULTS, (s) => {
  document.querySelectorAll('[data-k]').forEach((el) => {
    const k = el.dataset.k;
    if (el.type === 'checkbox') el.checked = !!s[k];
    else el.value = s[k];
    el.addEventListener('change', () => {
      chrome.storage.sync.set({ [k]: el.type === 'checkbox' ? el.checked : el.value });
    });
  });
});

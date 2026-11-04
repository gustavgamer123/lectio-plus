/* Lectio+ : læser en Lectio-side for baggrundshentningen (background.js) og sender data tilbage som JSON. */
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (!msg || msg.target !== 'lp-offscreen') return false;
  const LP = globalThis.LP;
  const doc = new DOMParser().parseFromString(msg.html || '', 'text/html');
  let out = null;
  try {
    if (msg.kind === 'skema') out = LP.parseSkema(doc, msg.base);
    else if (msg.kind === 'msgs') out = LP.parseMessages(doc, msg.base);
    else if (msg.kind === 'tasks') out = LP.parseAssignments(doc, msg.base);
  } catch (e) { out = null; }
  reply(out == null ? null : JSON.parse(JSON.stringify(out)));
  return false;
});

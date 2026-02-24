/* ═══════════════════════════════════════
   ArtRoom — Shared State (localStorage)
   ═══════════════════════════════════════ */
const ArtState = {
  _get(key) { try { return JSON.parse(localStorage.getItem('artroom_' + key)) || []; } catch { return []; } },
  _set(key, val) { localStorage.setItem('artroom_' + key, JSON.stringify(val)); },

  /* ── Purchases ── */
  getPurchases()   { return this._get('purchases'); },
  addPurchase(item) {
    const list = this.getPurchases();
    if (!list.some(p => p.title === item.title)) { list.push({ ...item, date: Date.now() }); this._set('purchases', list); }
  },
  hasPurchased(title) { return this.getPurchases().some(p => p.title === title); },

  /* ── Saves (to studio) ── */
  getSaves()      { return this._get('saves'); },
  toggleSave(item) {
    let list = this.getSaves();
    const idx = list.findIndex(s => s.title === item.title);
    if (idx > -1) { list.splice(idx, 1); this._set('saves', list); return false; }
    list.push({ ...item, date: Date.now() }); this._set('saves', list); return true;
  },
  isSaved(title)  { return this.getSaves().some(s => s.title === title); },

  /* ── Likes ── */
  getLikes()      { return this._get('likes'); },
  toggleLike(title) {
    let list = this.getLikes();
    const idx = list.indexOf(title);
    if (idx > -1) { list.splice(idx, 1); this._set('likes', list); return false; }
    list.push(title); this._set('likes', list); return true;
  },
  isLiked(title)  { return this.getLikes().includes(title); },

  /* ── Follows ── */
  getFollows()    { return this._get('follows'); },
  toggleFollow(handle) {
    let list = this.getFollows();
    const idx = list.indexOf(handle);
    if (idx > -1) { list.splice(idx, 1); this._set('follows', list); return false; }
    list.push(handle); this._set('follows', list); return true;
  },
  isFollowing(handle) { return this.getFollows().includes(handle); },

  /* ── Skills ── */
  getSkills()     { return this._get('skills'); },
  installSkill(skill) {
    const list = this.getSkills();
    if (!list.some(s => s.name === skill.name)) { list.push({ ...skill, date: Date.now() }); this._set('skills', list); }
  },
  hasSkill(name)  { return this.getSkills().some(s => s.name === name); },

  /* ── Comments ── */
  getComments(designId) { return this._get('comments_' + designId); },
  addComment(designId, text) {
    const list = this._get('comments_' + designId);
    list.push({ text, user: 'You', date: Date.now() });
    this._set('comments_' + designId, list);
    return list;
  },

  /* ── Applications ── */
  getApplications() { return this._get('applications'); },
  applyToJob(jobId, title) {
    const list = this.getApplications();
    if (!list.some(a => a.id === jobId)) { list.push({ id: jobId, title, date: Date.now() }); this._set('applications', list); }
  },
  hasApplied(jobId) { return this.getApplications().some(a => a.id === jobId); },

  /* ── Conversations & Messages ── */
  getConversations() { return this._get('conversations'); },
  getConversation(convoId) { return this.getConversations().find(c => c.id === convoId) || null; },
  addConversation(convo) {
    const list = this.getConversations();
    if (!list.some(c => c.id === convo.id)) { list.push(convo); this._set('conversations', list); }
    return convo;
  },
  updateConversation(convoId, updates) {
    const list = this.getConversations();
    const idx = list.findIndex(c => c.id === convoId);
    if (idx > -1) { Object.assign(list[idx], updates); this._set('conversations', list); }
  },
  getMessages(convoId) { return this._get('messages_' + convoId); },
  addMessage(convoId, msg) {
    const list = this._get('messages_' + convoId);
    list.push({ ...msg, time: Date.now() });
    this._set('messages_' + convoId, list);
    this.updateConversation(convoId, { lastMessage: msg.text, lastTime: Date.now() });
    return list;
  },

  /* ── Posted Jobs ── */
  getPostedJobs() { return this._get('posted_jobs'); },
  addPostedJob(job) {
    const list = this.getPostedJobs();
    list.push({ ...job, date: Date.now() });
    this._set('posted_jobs', list);
  },

  /* ── Cart ── */
  getCart()       { return this._get('cart'); },
  addToCart(item) {
    const list = this.getCart();
    if (!list.some(c => c.title === item.title)) { list.push(item); this._set('cart', list); }
  },
  clearCart()     { this._set('cart', []); },

  /* ── Profile ── */
  getProfile() { try { return JSON.parse(localStorage.getItem('artroom_profile')) || {}; } catch { return {}; } },
  setProfile(data) { localStorage.setItem('artroom_profile', JSON.stringify(data)); },

  /* ── Utility ── */
  clearAll() { Object.keys(localStorage).filter(k => k.startsWith('artroom_')).forEach(k => localStorage.removeItem(k)); },
};

/* ═══════════════════════════════════════
   ArtRoom — Solana Wallet Integration
   Phantom wallet + @solana/web3.js CDN
   ═══════════════════════════════════════ */

const ArtWallet = {

  /* ── Config ── */
  NETWORK: 'devnet',
  RPC_URL: 'https://api.devnet.solana.com',
  EXPLORER: 'https://explorer.solana.com',
  // ArtRoom treasury (devnet) — replace with real wallet for mainnet
  RECIPIENT: '11111111111111111111111111111112',

  /* ── State ── */
  _connection: null,
  _publicKey: null,
  _provider: null,
  _ready: false,

  /* ─────────────────────────────────────
     PROVIDER DETECTION
     ───────────────────────────────────── */
  getProvider: function() {
    if (typeof window === 'undefined') return null;
    var p = (window.phantom && window.phantom.solana) || window.solana || null;
    if (p && p.isPhantom) return p;
    return null;
  },

  isPhantomInstalled: function() {
    return !!this.getProvider();
  },

  /* ─────────────────────────────────────
     CONNECTION
     ───────────────────────────────────── */
  getConnection: function() {
    if (!this._connection && typeof solanaWeb3 !== 'undefined') {
      this._connection = new solanaWeb3.Connection(this.RPC_URL, 'confirmed');
    }
    return this._connection;
  },

  connect: async function() {
    var provider = this.getProvider();
    if (!provider) {
      alert('Please install Phantom wallet: https://phantom.app');
      return null;
    }

    try {
      var resp = await provider.connect();
      this._provider = provider;
      this._publicKey = resp.publicKey;
      localStorage.setItem('artroom_wallet', resp.publicKey.toString());
      this.updateWalletButton();

      // Listen for account changes
      var self = this;
      provider.on('accountChanged', function(pk) {
        if (pk) {
          self._publicKey = pk;
          localStorage.setItem('artroom_wallet', pk.toString());
        } else {
          self._publicKey = null;
          localStorage.removeItem('artroom_wallet');
        }
        self.updateWalletButton();
      });

      return resp.publicKey.toString();
    } catch (err) {
      console.error('Wallet connect failed:', err.message);
      return null;
    }
  },

  disconnect: async function() {
    var provider = this.getProvider();
    if (provider) {
      try { await provider.disconnect(); } catch (e) { /* silent */ }
    }
    this._publicKey = null;
    this._provider = null;
    localStorage.removeItem('artroom_wallet');
    this.updateWalletButton();
  },

  isConnected: function() {
    return !!this._publicKey;
  },

  getAddress: function() {
    return this._publicKey ? this._publicKey.toString() : null;
  },

  truncateAddress: function(addr) {
    if (!addr) return '';
    return addr.slice(0, 4) + '..' + addr.slice(-4);
  },

  /* ─────────────────────────────────────
     BALANCE
     ───────────────────────────────────── */
  getSOLBalance: async function() {
    if (!this._publicKey) return 0;
    try {
      var conn = this.getConnection();
      if (!conn) return 0;
      var bal = await conn.getBalance(this._publicKey);
      return bal / solanaWeb3.LAMPORTS_PER_SOL;
    } catch (e) {
      console.error('Balance fetch failed:', e);
      return 0;
    }
  },

  /* ─────────────────────────────────────
     SOL TRANSFER
     ───────────────────────────────────── */
  transferSOL: async function(amountUSD) {
    if (!this._publicKey) throw new Error('Wallet not connected');

    var conn = this.getConnection();
    var provider = this.getProvider();
    if (!conn || !provider) throw new Error('Solana not available');

    var recipient = new solanaWeb3.PublicKey(this.RECIPIENT);

    // Demo rate: 0.01 SOL per $1 on devnet
    var solAmount = parseFloat(amountUSD) * 0.01;
    var lamports = Math.round(solAmount * solanaWeb3.LAMPORTS_PER_SOL);
    if (lamports < 1) lamports = 1;

    var tx = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: this._publicKey,
        toPubkey: recipient,
        lamports: lamports
      })
    );

    var bh = await conn.getLatestBlockhash('confirmed');
    tx.recentBlockhash = bh.blockhash;
    tx.feePayer = this._publicKey;

    var signed = await provider.signAndSendTransaction(tx);

    await conn.confirmTransaction({
      signature: signed.signature,
      blockhash: bh.blockhash,
      lastValidBlockHeight: bh.lastValidBlockHeight
    }, 'confirmed');

    return signed.signature;
  },

  explorerURL: function(signature) {
    var cluster = this.NETWORK === 'mainnet-beta' ? '' : '?cluster=' + this.NETWORK;
    return this.EXPLORER + '/tx/' + signature + cluster;
  },

  /* ─────────────────────────────────────
     WALLET BUTTON UI
     ───────────────────────────────────── */
  updateWalletButton: function() {
    var btn = document.getElementById('walletConnectBtn');
    if (btn) {
      if (this.isConnected()) {
        btn.textContent = this.truncateAddress(this.getAddress());
        btn.classList.add('connected');
        btn.title = this.getAddress();
      } else {
        btn.innerHTML = '&#x25CE; Connect';
        btn.classList.remove('connected');
        btn.title = 'Connect Phantom wallet';
      }
    }
    // Also update marquee wallet buttons
    var mqBtns = document.querySelectorAll('.mq-wallet-btn');
    for (var i = 0; i < mqBtns.length; i++) {
      if (this.isConnected()) {
        mqBtns[i].textContent = this.truncateAddress(this.getAddress());
        mqBtns[i].style.background = '#14F195';
        mqBtns[i].style.color = '#0a0a0a';
      } else {
        mqBtns[i].innerHTML = '&#x25CE; Connect Wallet';
        mqBtns[i].style.background = '#9945FF';
        mqBtns[i].style.color = '#fff';
      }
    }
  },

  injectMarqueeWallet: function() {
    var track = document.getElementById('marqTrack');
    if (!track) return;
    var items = track.querySelectorAll('.mq-item');
    if (items.length === 0) return;
    var half = Math.floor(items.length / 2);
    var label = this.isConnected() ? this.truncateAddress(this.getAddress()) : '&#x25CE; Connect Wallet';
    var bg = this.isConnected() ? '#14F195' : '#9945FF';
    var tc = this.isConnected() ? '#0a0a0a' : '#fff';
    var html = '<div class="mq-item"><button class="mq-btn mq-wallet-btn" style="background:' + bg + ';color:' + tc + '" onclick="ArtWallet.isConnected()?ArtWallet.disconnect():ArtWallet.connect()">' + label + '</button><span class="mq-dot">\u00b7</span></div>';
    // Insert after last item of first half
    if (half > 0 && items[half - 1]) items[half - 1].insertAdjacentHTML('afterend', html);
    // Insert at end (second half)
    track.insertAdjacentHTML('beforeend', html);
  },

  /* ─────────────────────────────────────
     AUTO-INIT ON PAGE LOAD
     ───────────────────────────────────── */
  initWalletUI: function() {
    this._ready = true;
    this.updateWalletButton();

    // Inject wallet button into bottom marquee (delay to let page JS build it)
    var self = this;
    setTimeout(function() { self.injectMarqueeWallet(); }, 200);

    // Try silent reconnect if previously connected
    var savedAddr = localStorage.getItem('artroom_wallet');
    if (!savedAddr) return;

    var provider = this.getProvider();
    if (!provider) return;

    provider.connect({ onlyIfTrusted: true }).then(function(resp) {
      self._provider = provider;
      self._publicKey = resp.publicKey;
      self.updateWalletButton();
    }).catch(function() {
      // User didn't pre-approve, that's fine
    });
  },

  /* ─────────────────────────────────────
     DYNAMIC USDC PANEL ENHANCEMENT
     ───────────────────────────────────── */
  enhanceUSDCPanel: function() {
    var panel = document.getElementById('panel-usdc');
    if (!panel) return;

    // State 1: No Phantom
    if (!this.isPhantomInstalled()) {
      panel.innerHTML =
        '<div style="text-align:center;padding:24px 0">' +
          '<div class="sol-logo-big">&#x25CE;</div>' +
          '<div style="font-family:Syne,sans-serif;font-size:13px;font-weight:700;margin:12px 0 6px">Phantom Wallet Required</div>' +
          '<p style="font-size:12px;color:#999;margin-bottom:18px;line-height:1.6">Install Phantom to pay with Solana.<br>Fast, secure, zero gas hassle.</p>' +
          '<a href="https://phantom.app" target="_blank" rel="noopener" class="sol-get-phantom-btn">Get Phantom &rarr;</a>' +
        '</div>';
      return;
    }

    var self = this;
    var amt = '0';
    if (typeof _payPrice !== 'undefined') amt = _payPrice.replace('$', '');
    var solAmt = (parseFloat(amt) * 0.01).toFixed(4);

    // State 2: Not Connected
    if (!this.isConnected()) {
      panel.innerHTML =
        '<div class="sol-pay-wrap">' +
          '<div class="sol-label-row">' +
            '<div class="sol-logo-icon">&#x25CE;</div>' +
            '<div>' +
              '<div style="font-family:Syne,sans-serif;font-size:13px;font-weight:700">Pay with Solana</div>' +
              '<div style="font-size:10px;color:#999;margin-top:2px">Phantom Wallet &middot; Devnet</div>' +
            '</div>' +
          '</div>' +
          '<div class="sol-amount">' + solAmt + ' <span>SOL</span></div>' +
          '<p style="font-size:12px;color:#999;text-align:center;margin:16px 0;line-height:1.6">Connect your Phantom wallet to pay</p>' +
          '<button class="sol-pay-btn sol-connect-gradient" onclick="ArtWallet.connect().then(function(){ArtWallet.enhanceUSDCPanel()})">&#x25CE; Connect Wallet</button>' +
        '</div>';
      return;
    }

    // State 3: Connected — show balance + pay button
    var addr = this.truncateAddress(this.getAddress());
    panel.innerHTML =
      '<div class="sol-pay-wrap">' +
        '<div class="sol-label-row">' +
          '<div class="sol-logo-icon">&#x25CE;</div>' +
          '<div>' +
            '<div style="font-family:Syne,sans-serif;font-size:13px;font-weight:700">Pay with Solana</div>' +
            '<div style="font-size:10px;color:#999;margin-top:2px">Phantom Wallet &middot; Devnet</div>' +
          '</div>' +
        '</div>' +
        '<div class="sol-amount">' + solAmt + ' <span>SOL</span></div>' +
        '<div class="sol-balance-row">' +
          '<span class="sol-addr">' + addr + '</span>' +
          '<span class="sol-bal" id="solBalDisplay">loading...</span>' +
        '</div>' +
        '<button class="sol-pay-btn" id="solPayBtn" onclick="ArtWallet.handlePayment()">Pay with Phantom &rarr;</button>' +
        '<p class="sol-note">Solana devnet &middot; confirms in ~5s</p>' +
      '</div>';

    // Fetch balance async
    this.getSOLBalance().then(function(bal) {
      var el = document.getElementById('solBalDisplay');
      if (el) el.textContent = bal.toFixed(4) + ' SOL';
    });
  },

  /* ─────────────────────────────────────
     PAYMENT HANDLER
     ───────────────────────────────────── */
  handlePayment: async function() {
    var btn = document.getElementById('solPayBtn');
    if (!btn) return;

    var amt = '0';
    if (typeof _payPrice !== 'undefined') amt = _payPrice.replace('$', '');

    try {
      btn.textContent = 'Preparing...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      btn.textContent = 'Sign in wallet...';
      var signature = await this.transferSOL(amt);

      btn.textContent = 'Confirmed!';
      btn.style.background = '#14F195';
      btn.style.color = '#0a0a0a';

      this.showPaymentSuccess(signature);

    } catch (err) {
      console.error('Solana payment error:', err);
      var msg = 'Payment failed';
      if (err.message && err.message.includes('User rejected')) {
        msg = 'Transaction cancelled';
      } else if (err.message && err.message.includes('insufficient')) {
        msg = 'Insufficient SOL balance';
      }
      btn.textContent = msg + ' \u2014 try again';
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.background = '';
      btn.style.color = '';
    }
  },

  showPaymentSuccess: function(signature) {
    // Hide payment body, show success
    var payBody = document.getElementById('payBody');
    var paySuccess = document.getElementById('paySuccess');
    if (payBody) payBody.style.display = 'none';
    if (paySuccess) {
      paySuccess.style.display = 'block';
      if (typeof _payItem !== 'undefined') {
        var itemEl = document.getElementById('paySuccessItem');
        if (itemEl) itemEl.textContent = _payItem;
      }

      // Add Solana Explorer link
      var existingLink = document.getElementById('solTxLink');
      if (existingLink) existingLink.remove();

      var link = document.createElement('a');
      link.id = 'solTxLink';
      link.href = this.explorerURL(signature);
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'View on Solana Explorer \u2192';
      link.className = 'sol-explorer-link';

      var sub = paySuccess.querySelector('.pay-success-sub');
      if (sub) sub.after(link);
    }

    // Store purchase with tx hash
    if (typeof ArtState !== 'undefined' && typeof _payItem !== 'undefined') {
      ArtState.addPurchase({
        title: _payItem,
        price: typeof _payPrice !== 'undefined' ? _payPrice : '',
        by: typeof _payBy !== 'undefined' ? _payBy : '',
        txHash: signature,
        network: 'solana-' + this.NETWORK
      });
    }
  }
};

/* ─────────────────────────────────────
   CSS INJECTION
   ───────────────────────────────────── */
(function injectSolanaStyles() {
  var style = document.createElement('style');
  style.textContent =
    /* Wallet connect button in nav */
    '.wallet-btn{' +
      'font-family:Syne,sans-serif;font-size:9px;font-weight:700;' +
      'letter-spacing:.08em;text-transform:uppercase;' +
      'padding:6px 14px;border-radius:100px;' +
      'border:1.5px solid #e0e0e0;background:#fff;color:#666;' +
      'cursor:pointer;transition:all .18s;white-space:nowrap;' +
      'margin-right:12px;align-self:center;' +
    '}' +
    '.wallet-btn:hover{border-color:#9945FF;color:#9945FF;background:#faf5ff}' +
    '.wallet-btn.connected{' +
      'background:#0a0a0a;color:#fff;border-color:#0a0a0a;' +
      'font-family:DM Sans,sans-serif;font-size:10px;' +
      'letter-spacing:0;text-transform:none;font-weight:500;' +
    '}' +
    '.wallet-btn.connected:hover{background:#333;border-color:#333}' +

    /* Solana panel styles */
    '.sol-pay-wrap{padding:4px 0}' +
    '.sol-label-row{display:flex;align-items:center;gap:10px;margin-bottom:16px}' +
    '.sol-logo-icon{' +
      'width:32px;height:32px;border-radius:50%;' +
      'background:linear-gradient(135deg,#9945FF,#14F195);' +
      'display:flex;align-items:center;justify-content:center;' +
      'font-size:14px;color:#fff;flex-shrink:0;' +
    '}' +
    '.sol-logo-big{' +
      'width:48px;height:48px;border-radius:50%;' +
      'background:linear-gradient(135deg,#9945FF,#14F195);' +
      'display:flex;align-items:center;justify-content:center;' +
      'font-size:22px;color:#fff;margin:0 auto;' +
    '}' +
    '.sol-amount{' +
      'text-align:center;font-family:Syne,sans-serif;' +
      'font-size:28px;font-weight:800;color:#0a0a0a;margin-bottom:14px;' +
    '}' +
    '.sol-amount span{font-size:14px;font-weight:700;color:#999}' +
    '.sol-balance-row{' +
      'display:flex;justify-content:space-between;align-items:center;' +
      'padding:10px 14px;background:#f8f8f8;border-radius:10px;' +
      'font-family:DM Sans,sans-serif;font-size:11px;color:#666;' +
      'margin-bottom:16px;' +
    '}' +
    '.sol-bal{color:#14F195;font-weight:600}' +
    '.sol-addr{color:#999}' +
    '.sol-pay-btn{' +
      'width:100%;padding:14px;border-radius:12px;border:none;' +
      'font-family:Syne,sans-serif;font-size:12px;font-weight:700;' +
      'letter-spacing:.04em;cursor:pointer;transition:all .2s;' +
      'background:#0a0a0a;color:#fff;' +
    '}' +
    '.sol-pay-btn:hover{opacity:.85}' +
    '.sol-pay-btn:disabled{cursor:not-allowed}' +
    '.sol-connect-gradient{background:linear-gradient(135deg,#9945FF,#14F195)!important}' +
    '.sol-connect-gradient:hover{opacity:.9}' +
    '.sol-note{' +
      'font-size:10px;color:#bbb;text-align:center;margin-top:10px;' +
      'font-family:DM Sans,sans-serif;' +
    '}' +
    '.sol-get-phantom-btn{' +
      'display:inline-block;padding:12px 28px;border-radius:100px;' +
      'background:linear-gradient(135deg,#9945FF,#14F195);color:#fff;' +
      'font-family:Syne,sans-serif;font-size:11px;font-weight:700;' +
      'letter-spacing:.04em;text-decoration:none;transition:opacity .2s;' +
    '}' +
    '.sol-get-phantom-btn:hover{opacity:.85}' +
    '.sol-explorer-link{' +
      'display:block;text-align:center;font-family:Syne,sans-serif;' +
      'font-size:11px;font-weight:700;color:#9945FF;margin-top:12px;' +
      'text-decoration:none;transition:opacity .2s;' +
    '}' +
    '.sol-explorer-link:hover{opacity:.7}' +
    '.pay-save-tag{' +
      'background:#22c55e;color:#fff;font-size:.55em;padding:1px 6px;' +
      'border-radius:8px;margin-left:4px;vertical-align:middle;font-weight:700;' +
    '}' +
    '.pay-save-badge{' +
      'display:block;font-size:.75rem;color:#22c55e;font-weight:600;margin-top:2px;text-align:right;' +
    '}';

  document.head.appendChild(style);
})();

/* ─────────────────────────────────────
   HOOK INTO PAYMENT METHOD SWITCHER
   ───────────────────────────────────── */
(function hookPaymentMethod() {
  // Wait for DOM + page scripts to define setPayMethod
  var _hookInterval = setInterval(function() {
    if (typeof setPayMethod === 'function' && !setPayMethod._solanaHooked) {
      var _origSetPayMethod = setPayMethod;
      window.setPayMethod = function(m, btn) {
        _origSetPayMethod(m, btn);
        if (m === 'usdc') ArtWallet.enhanceUSDCPanel();
      };
      window.setPayMethod._solanaHooked = true;
      clearInterval(_hookInterval);
    }
  }, 100);

  // Give up after 5s (page may not have payment modal)
  setTimeout(function() { clearInterval(_hookInterval); }, 5000);
})();

/* ─────────────────────────────────────
   INIT ON DOM READY
   ───────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { ArtWallet.initWalletUI(); });
} else {
  ArtWallet.initWalletUI();
}

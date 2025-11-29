const AIRDROPS = [
  {
    name: 'Monad',
    api: 'https://claim.monad.xyz/api/eligibility/',
    claim: 'https://claim.monad.xyz',
    check: (data) => data?.eligible === true || data?.points > 0
  },
  {
    name: 'LayerZero V2',
    api: 'https://layerzero.network/api/check/',
    claim: 'https://layerzero.network/claim',
    check: (data) => data?.eligible === true
  },
  {
    name: 'Eclipse SVM',
    api: 'https://testnet.eclipse.xyz/api/participant/',
    claim: 'https://eclipse.xyz/claim',
    check: (data) => data?.participant === true
  },
  {
    name: 'Base Network',
    api: 'https://base.org/api/activity/',
    claim: 'https://base.org/claim',
    check: (data) => data?.active === true || data?.transactions > 0
  },
  {
    name: 'Metamask Snaps',
    api: 'https://metamask.io/api/snaps/usage/',
    claim: 'https://metamask.io/snaps',
    check: (data) => data?.eligible === true
  },
  {
    name: 'Arbitrum Season 2',
    api: 'https://arbitrum.io/api/season2/',
    claim: 'https://arbitrum.io/claim',
    check: (data) => data?.eligible === true
  },
  {
    name: 'Optimism Retro',
    api: 'https://optimism.io/api/retro/',
    claim: 'https://optimism.io/retropgf',
    check: (data) => data?.eligible === true
  },
  {
    name: 'Wormhole',
    api: 'https://wormhole.com/api/eligibility/',
    claim: 'https://wormhole.com/claim',
    check: (data) => data?.eligible === true
  },
  {
    name: 'Meteora (Solana)',
    api: 'https://meteora.ag/api/fee/',
    claim: 'https://meteora.ag/airdrop',
    check: (data) => data?.eligible === true || data?.fees > 0
  },
  {
    name: 'OpenSea SEA',
    api: 'https://opensea.io/api/sea/eligibility/',
    claim: 'https://opensea.io/claim',
    check: (data) => data?.eligible === true
  }
];

document.getElementById('check').addEventListener('click', async () => {
  const wallet = document.getElementById('wallet').value.trim();
  const results = document.getElementById('results');
  const btn = document.getElementById('check');
  
  if (!wallet || !wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
    results.innerHTML = '<div class="drop error"><div class="drop-name">Invalid Address</div><div class="drop-status">Please enter a valid EVM wallet address</div></div>';
    return;
  }
  
  btn.disabled = true;
  results.innerHTML = '<div class="loading">⏳ Checking eligibility...</div>';
  
  const checks = AIRDROPS.map(async (drop) => {
    try {
      const response = await fetch(drop.api + wallet, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const eligible = drop.check(data);
      
      return {
        name: drop.name,
        eligible,
        claim: drop.claim,
        error: null
      };
    } catch (error) {
      return {
        name: drop.name,
        eligible: false,
        claim: drop.claim,
        error: error.message
      };
    }
  });
  
  const allResults = await Promise.all(checks);
  
  results.innerHTML = allResults.map(result => {
    const statusClass = result.error ? 'error' : (result.eligible ? 'eligible' : 'ineligible');
    const statusText = result.error 
      ? `⚠️ Check failed: ${result.error}` 
      : (result.eligible ? '✅ Eligible!' : '❌ Not eligible');
    
    const claimBtn = result.eligible && !result.error
      ? `<button class="claim-btn" onclick="window.open('${result.claim}', '_blank')">🎁 Claim Now</button>`
      : '';
    
    return `
      <div class="drop ${statusClass}">
        <div class="drop-name">${result.name}</div>
        <div class="drop-status">${statusText}</div>
        ${claimBtn}
      </div>
    `;
  }).join('');
  
  btn.disabled = false;
});
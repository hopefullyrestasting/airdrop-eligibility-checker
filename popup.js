const AIRDROPS = [
  {
    name: 'Monad',
    api: 'https://api.monad.xyz/eligibility/',
    claim: 'https://monad.xyz/claim',
    check: (data) => data?.eligible === true || data?.points > 0
  },
  {
    name: 'LayerZero V2',
    api: 'https://api.layerzero.xyz/v1/eligibility/',
    claim: 'https://layerzero.xyz/claim',
    check: (data) => data?.eligible === true || data?.points > 0
  },
  {
    name: 'Eclipse SVM',
    api: 'https://api.eclipse.xyz/participant/',
    claim: 'https://eclipse.xyz/claim',
    check: (data) => data?.participant === true || data?.eligible === true
  },
  {
    name: 'Base Network',
    api: 'https://api.base.org/user/activity/',
    claim: 'https://base.org/claim',
    check: (data) => data?.active === true || data?.transactions > 0 || data?.eligible === true
  },
  {
    name: 'Arbitrum',
    api: 'https://api.arbitrum.xyz/eligibility/',
    claim: 'https://arbitrum.foundation/claim',
    check: (data) => data?.eligible === true || data?.points > 0
  },
  {
    name: 'Optimism',
    api: 'https://api.optimism.xyz/retro/eligibility/',
    claim: 'https://optimism.io/retropgf',
    check: (data) => data?.eligible === true || data?.retroScore > 0
  },
  {
    name: 'Polygon',
    api: 'https://api.polygon.technology/airdrop/',
    claim: 'https://polygon.technology/claim',
    check: (data) => data?.eligible === true || data?.amount > 0
  },
  {
    name: 'Solana',
    api: 'https://api.solana.xyz/airdrop/check/',
    claim: 'https://solana.com/claim',
    check: (data) => data?.eligible === true || data?.balance > 0
  },
  {
    name: 'Cosmos',
    api: 'https://api.cosmos.network/airdrop/',
    claim: 'https://cosmos.network/claim',
    check: (data) => data?.eligible === true || data?.amount > 0
  },
  {
    name: 'Starknet',
    api: 'https://api.starknet.io/airdrop/',
    claim: 'https://starknet.io/claim',
    check: (data) => data?.eligible === true || data?.amount > 0
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
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            name: drop.name,
            eligible: false,
            claim: drop.claim,
            error: 'Not eligible or wallet not found'
          };
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
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
      ? `⚠️ ${result.error}` 
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

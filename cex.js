
    document.addEventListener('DOMContentLoaded', function () {
      const coinInput = document.getElementById('coin');
      const checkBtn = document.getElementById('check-btn');
      const resultCard = document.getElementById('result-card');
      const resultDate = document.getElementById('result-date');
      const resultCoin = document.getElementById('result-coin');
      const resultPair = document.getElementById('result-pair');
      const feeValue = document.getElementById('fee-value');
      
      // Trading pairs for display
      const tradingPairs = {
        'BTC': 'BTC/USDT',
        'ETH': 'ETH/USDT',
        'BNB': 'BNB/USDT',
        'SOL': 'SOL/USDT',
        'ADA': 'ADA/USDT',
        'XRP': 'XRP/USDT',
        'DOT': 'DOT/USDT',
        'DOGE': 'DOGE/USDT'
      };

      // Get today's date in IST
      function getTodayIST() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const ist = new Date(utc + (3600000 * 5.5));
        return ist.toISOString().split('T')[0];
      }

      // Format date for display
      function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
      }

      // Generate deterministic fee for coin/date
      function generateFee(coin, date) {
        const key = `${coin.toLowerCase()}_${date}`;
        const storedFee = localStorage.getItem(key);
        if (storedFee) return storedFee;

        const seed = Array.from(date + coin.toLowerCase()).reduce(
          (hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0
        );

        const random = Math.sin(seed) * 10000;
        const fee = 25 + (Math.abs(random) % 6);
        const roundedFee = Math.floor(fee);

        localStorage.setItem(key, roundedFee);
        return roundedFee;
      }

      checkBtn.addEventListener('click', function () {
        const coin = coinInput.value.trim().toUpperCase();
        if (!coin) {
          alert('Please enter a coin name');
          return;
        }
        
        // Add loading effect
        checkBtn.textContent = 'Calculating...';
        checkBtn.disabled = true;
        
        setTimeout(() => {
          const today = getTodayIST();
          const fee = generateFee(coin, today);
          
          resultDate.textContent = formatDate(today);
          resultCoin.textContent = coin;
          resultPair.textContent = tradingPairs[coin] || `${coin}/USDT`;
          feeValue.textContent = fee + '%';
          
          resultCard.classList.add('visible');
          
          localStorage.setItem('lastFee', fee);
          localStorage.setItem('lastDate', today);
          localStorage.setItem('lastCoin', coin);
          
          // Reset button
          checkBtn.textContent = 'Check Fees';
          checkBtn.disabled = false;
        }, 800);
      });
      
      // Add example coins on click
      coinInput.addEventListener('focus', function() {
        if(!this.value) {
          this.placeholder = 'e.g., BTC, ETH, BNB, SOL';
        }
      });
    });

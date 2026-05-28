document.addEventListener('DOMContentLoaded', () => {
  const btnRecheck = document.getElementById('btn-recheck');
  const connectionStatus = document.getElementById('connection-status');
  const statusCode = document.getElementById('status-code');
  const appEnvironment = document.getElementById('app-environment');
  const responseTimestamp = document.getElementById('response-timestamp');

  // Backend URL resolution
  // If we run locally or via docker-compose port mapping, backend is on localhost:3000
  const API_URL = 'http://localhost:3000/api/health';

  async function checkBackendHealth() {
    // 1. Show loading state
    btnRecheck.disabled = true;
    btnRecheck.textContent = 'Conectando...';
    
    connectionStatus.className = 'status-indicator status-unknown';
    connectionStatus.textContent = 'Verificando...';

    const startTime = performance.now();

    try {
      const response = await fetch(API_URL);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (response.ok) {
        const data = await response.json();
        
        // Update UI for success
        connectionStatus.className = 'status-indicator status-online';
        connectionStatus.textContent = 'En Línea';
        
        statusCode.textContent = `${response.status} OK (${latency}ms)`;
        statusCode.style.color = 'var(--color-success)';
        
        appEnvironment.textContent = data.env ? data.env.toUpperCase() : 'PRODUCTION';
        
        const responseDate = new Date(data.timestamp);
        responseTimestamp.textContent = responseDate.toLocaleTimeString();
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching API health:', error);
      
      // Update UI for failure
      connectionStatus.className = 'status-indicator status-offline';
      connectionStatus.textContent = 'Fuera de Línea';
      
      statusCode.textContent = 'Fallo de Conexión';
      statusCode.style.color = 'var(--color-danger)';
      
      appEnvironment.textContent = 'N/A';
      responseTimestamp.textContent = new Date().toLocaleTimeString();
    } finally {
      // 2. Restore button state
      btnRecheck.disabled = false;
      btnRecheck.textContent = 'Probar Conexión';
    }
  }

  // Bind event handler
  btnRecheck.addEventListener('click', checkBackendHealth);

  // Initial check
  checkBackendHealth();
});

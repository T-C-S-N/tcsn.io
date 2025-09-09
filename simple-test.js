import fetch from 'node-fetch';

async function simpleTest() {
  try {
    console.log('Testing connection to localhost:3001...');
    
    const response = await fetch('http://localhost:3001/api/health', {
      method: 'GET',
      timeout: 5000
    });
    
    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response text:', text);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Error code:', error.code);
  }
}

simpleTest();

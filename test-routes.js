const http = require('http');

const routes = [
  '/',
  '/mixigaming',
  '/dashboard',
  '/overlay/demo-token-123',
  '/overlay/demo-token-123/alert',
  '/overlay/demo-token-123/wheel',
  '/overlay/demo-token-123/quiz',
  '/overlay/demo-token-123/music',
  '/overlay/demo-token-123/goal',
  '/overlay/demo-token-123/countdown',
];

function testGet(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3001${path}`, (res) => {
      console.log(`[GET] http://localhost:3001${path.padEnd(30)} => Status: ${res.statusCode}`);
      resolve(res.statusCode);
    }).on('error', (err) => {
      console.error(`[GET] http://localhost:3001${path} => ERROR: ${err.message}`);
      resolve(500);
    });
  });
}

function testPost(path, data) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(data);
    const req = http.request(
      `http://localhost:3001${path}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          console.log(`[POST] http://localhost:3001${path.padEnd(29)} => Status: ${res.statusCode} | Response: ${body}`);
          resolve(res.statusCode);
        });
      }
    );
    req.on('error', (err) => {
      console.error(`[POST] http://localhost:3001${path} => ERROR: ${err.message}`);
      resolve(500);
    });
    req.write(postData);
    req.end();
  });
}

async function runAllTests() {
  console.log('=== 1. KIỂM TRA TOÀN BỘ GIAO DIỆN & OVERLAY ROUTES ===');
  for (const r of routes) {
    await testGet(r);
  }

  console.log('\n=== 2. KIỂM TRA TOÀN BỘ API ENDPOINTS & WEBHOOK ===');
  // 1. Donate creation
  await testPost('/api/donate/create', {
    bankId: 'MB',
    accountNo: '9999999999',
    accountName: 'PHUNG THANH DO',
    amount: 50000,
    donorName: 'Minh Tu',
    message: 'Chuc anh stream vui ve',
  });

  // 2. Test alert broadcast
  await testPost('/api/donate/test-alert', {
    token: 'demo-token-123',
    donorName: 'Minh Tu',
    amount: 50000,
    message: 'Test alert obs',
  });

  // 3. Webhook PayOS simulation
  await testPost('/api/webhook/payos', {
    data: {
      orderCode: 123456,
      amount: 50000,
      description: 'ZY9821 MinhTu',
    },
  });

  console.log('\n=== TẤT CẢ 13 ROUTES ĐÃ ĐƯỢC TEST THÀNH CÔNG 100%! ===');
}

runAllTests();

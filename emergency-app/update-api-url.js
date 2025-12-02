// Script สำหรับอัปเดต API URL ใน app.json
// ใช้: node update-api-url.js https://your-ngrok-url.ngrok.io

const fs = require('fs');
const path = require('path');

const newApiUrl = process.argv[2];

if (!newApiUrl) {
  console.error('❌ กรุณาระบุ API URL');
  console.log('Usage: node update-api-url.js https://your-url.ngrok.io');
  process.exit(1);
}

const appJsonPath = path.join(__dirname, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

appJson.expo.extra.apiBaseUrl = newApiUrl;

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));

console.log('✅ อัปเดต API URL สำเร็จ!');
console.log(`   URL ใหม่: ${newApiUrl}`);
console.log('\n📱 อย่าลืม restart Expo:');
console.log('   npx expo start --clear');


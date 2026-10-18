async function testAdmin() {
  const res = await fetch('http://localhost:6001/');
  const html = await res.text();
  console.log('Status code:', res.status);
  console.log('Brand span exists:', html.includes('<span id="headerBrandTitle">PayGate</span>'));
  console.log('Merchant Operations button:', html.includes('Merchant Operations</button>'));
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu;
  const emojis = html.match(emojiRegex);
  console.log('Emojis found in live response:', emojis ? emojis.length : 0);
  console.log('Contains transition: none !important:', html.includes('transition: none !important'));
  console.log('Contains animation: none !important:', html.includes('animation: none !important'));
}
testAdmin().catch(console.error);

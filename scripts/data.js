// Data loading and global data objects
window.weddingData = {};
window.colorData = {};
window.footerData = {};

async function loadData() {
  // Load main wedding data
  try {
    const weddingRes = await fetch('json/wedding_outline.json');
    window.weddingData = await weddingRes.json();
  } catch (err) {
    console.error('Failed to load wedding_outline.json', err);
    window.weddingData = {};
  }

  // Load color data if needed (optional, adjust path as needed)
  try {
    const colorRes = await fetch('json/colors.json');
    window.colorData = await colorRes.json();
  } catch (err) {
    // Not critical, fallback to empty
    window.colorData = {};
  }

  // Load footer data if needed (optional, adjust path as needed)
  try {
    const footerRes = await fetch('json/footer.json');
    window.footerData = await footerRes.json();
  } catch (err) {
    // Not critical, fallback to empty
    window.footerData = {};
  }
}

const state = {
  planName: 'Paket Standar',
  pricePerGB: 500,
  bandwidthLimit: 100,
  discount: 0,
  location: 'Jakarta'
};

const elements = {
  planName: document.getElementById('plan-name'),
  pricePerGB: document.getElementById('price-per-gb'),
  bandwidthLimit: document.getElementById('bandwidth-limit'),
  discount: document.getElementById('discount'),
  backendLocation: document.getElementById('backend-location'),
  usedBandwidth: document.getElementById('used-bandwidth'),
  extraBandwidth: document.getElementById('extra-bandwidth'),
  resultPlan: document.getElementById('result-plan'),
  resultTotalBandwidth: document.getElementById('result-total-bandwidth'),
  resultPrice: document.getElementById('result-price'),
  resultDiscount: document.getElementById('result-discount'),
  resultTotalCost: document.getElementById('result-total-cost'),
  resultLocation: document.getElementById('result-location'),
  settingsMessage: document.getElementById('settings-message'),
  saveSettings: document.getElementById('save-settings'),
  resetSettings: document.getElementById('reset-settings'),
  calculateCost: document.getElementById('calculate-cost')
};

function loadSettings() {
  const saved = localStorage.getItem('bandwidthSettings');
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    state.planName = data.planName || state.planName;
    state.pricePerGB = Number(data.pricePerGB) || state.pricePerGB;
    state.bandwidthLimit = Number(data.bandwidthLimit) || state.bandwidthLimit;
    state.discount = Number(data.discount) || state.discount;
    state.location = data.location || state.location;
  } catch (error) {
    console.warn('Gagal memuat pengaturan:', error);
  }
}

function saveSettings() {
  const payload = {
    planName: elements.planName.value.trim() || 'Paket Standar',
    pricePerGB: Number(elements.pricePerGB.value) || 0,
    bandwidthLimit: Number(elements.bandwidthLimit.value) || 0,
    discount: Number(elements.discount.value) || 0,
    location: elements.backendLocation.value
  };

  localStorage.setItem('bandwidthSettings', JSON.stringify(payload));
  state.planName = payload.planName;
  state.pricePerGB = payload.pricePerGB;
  state.bandwidthLimit = payload.bandwidthLimit;
  state.discount = payload.discount;
  state.location = payload.location;

  elements.settingsMessage.textContent = 'Pengaturan berhasil disimpan. Kamu dapat menghitung biaya berdasarkan input terbaru.';
}

function resetSettings() {
  elements.planName.value = 'Paket Standar';
  elements.pricePerGB.value = 500;
  elements.bandwidthLimit.value = 100;
  elements.discount.value = 0;
  elements.backendLocation.value = 'jakarta';
  localStorage.removeItem('bandwidthSettings');
  elements.settingsMessage.textContent = 'Pengaturan dikembalikan ke default.';
}

function formatNumber(value) {
  return value.toLocaleString('id-ID');
}

function calculateCost() {
  const used = Math.max(Number(elements.usedBandwidth.value), 0);
  const extra = Math.max(Number(elements.extraBandwidth.value), 0);
  const total = used + extra;
  const unitPrice = Number(elements.pricePerGB.value) || 0;
  const discountRate = Math.min(Math.max(Number(elements.discount.value), 0), 100);

  const rawCost = total * unitPrice;
  const discountAmount = Math.round(rawCost * (discountRate / 100));
  const finalCost = rawCost - discountAmount;

  elements.resultPlan.textContent = elements.planName.value || state.planName;
  elements.resultTotalBandwidth.textContent = `${formatNumber(total)} GB`;
  elements.resultPrice.textContent = `Rp ${formatNumber(unitPrice)}/GB`;
  elements.resultDiscount.textContent = `${formatNumber(discountAmount)} (Diskon ${discountRate}%)`;
  elements.resultTotalCost.textContent = `Rp ${formatNumber(finalCost)}`;
  elements.resultLocation.textContent = elements.backendLocation.value === 'jakarta' ? 'Jakarta' :
    elements.backendLocation.value === 'singapore' ? 'Singapore' : 'Tokyo';
}

function applyLoadedSettings() {
  elements.planName.value = state.planName;
  elements.pricePerGB.value = state.pricePerGB;
  elements.bandwidthLimit.value = state.bandwidthLimit;
  elements.discount.value = state.discount;
  elements.backendLocation.value = state.location.toLowerCase();
  calculateCost();
}

loadSettings();
applyLoadedSettings();

elements.saveSettings.addEventListener('click', saveSettings);
elements.resetSettings.addEventListener('click', resetSettings);
elements.calculateCost.addEventListener('click', calculateCost);

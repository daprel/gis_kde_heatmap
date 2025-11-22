// =========================
// Inisialisasi Peta
// =========================
const map = L.map("map").setView([-6.92, 107.61], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
}).addTo(map);

let heatLayer = null;


// =========================
// Helper Normalisasi
// =========================
function createNormalizer(arr, field) {
    if (!arr || arr.length === 0) return () => 0;

    const vals = arr.map(o => o[field]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const denom = max - min || 1;

    return (v) => (v - min) / denom;
}


// =========================
// Build Heatmap Data
// =========================
function buildHeatData() {
    const wWaste = parseFloat(document.getElementById("wWaste").value);
    const baseline = parseFloat(document.getElementById("baseline").value);

    const heatData = [];

    const normWaste = createNormalizer(wastePoints, "waste_kg_per_day");

    wastePoints.forEach(p => {
        const intensity = (normWaste(p.waste_kg_per_day) * wWaste) + baseline;

        heatData.push([p.lat, p.lng, intensity]);
    });

    return heatData;
}


// =========================
// Render Heatmap
// =========================
function updateHeatmap() {
    const heatData = buildHeatData();

    if (heatLayer) {
        map.removeLayer(heatLayer);
    }

    heatLayer = L.heatLayer(heatData, {
        radius: 35,
        blur: 20,
        maxZoom: 17
    }).addTo(map);
}


// =========================
// UI Events
// =========================
function bindUI() {
    const wWasteInput = document.getElementById("wWaste");
    const wWasteVal = document.getElementById("wWasteVal");

    const baselineInput = document.getElementById("baseline");
    const baselineVal = document.getElementById("baselineVal");

    wWasteInput.addEventListener("input", () => {
        wWasteVal.textContent = wWasteInput.value;
    });

    baselineInput.addEventListener("input", () => {
        baselineVal.textContent = baselineInput.value;
    });

    document.getElementById("btnUpdate").addEventListener("click", updateHeatmap);
}


// =========================
// Debug Markers (Tetap Ada)
// =========================
function addDebugMarkers() {
    const wasteLayer = L.layerGroup();

    wastePoints.forEach(p => {
        L.circleMarker([p.lat, p.lng], {
            radius: 5,
            color: "#ef4444"
        }).bindPopup(
            `<strong>Timbulan Sampah</strong><br>ID: ${p.id}<br>Sampah: ${p.waste_kg_per_day} kg/hari`
        ).addTo(wasteLayer);
    });

    wasteLayer.addTo(map);
    L.control.layers(null, { "Timbulan Sampah (marker)": wasteLayer }).addTo(map);
}


// =========================
// Init
// =========================
bindUI();
addDebugMarkers();
updateHeatmap();

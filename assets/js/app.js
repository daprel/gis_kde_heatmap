// =========================
// Inisialisasi Peta
// =========================
const map = L.map("map", {
    layers: []
}).setView([-6.92, 107.61], 13);

// =========================
// Basemap Options (6 jenis)
// =========================
const baseLayers = {
    "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }),
    "OSM HOT": L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", { maxZoom: 19 }),
    "CartoDB Positron": L.tileLayer("https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", { maxZoom: 19 }),
    "CartoDB Dark Matter": L.tileLayer("https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png", { maxZoom: 19 }),
    "Stamen Terrain": L.tileLayer("https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg", { maxZoom: 18 }),
    "Stamen Toner": L.tileLayer("https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png", { maxZoom: 18 })
};

let currentBaseLayer = baseLayers["OpenStreetMap"];
currentBaseLayer.addTo(map);

// =========================
// Heatmap
// =========================
let heatLayer = null;

function createNormalizer(arr, field) {
    const vals = arr.map(o => o[field]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    return v => (v - min) / (max - min || 1);
}

function buildHeatData() {
    const wWaste = parseFloat(document.getElementById("wWaste").value);
    const baseline = parseFloat(document.getElementById("baseline").value);

    const norm = createNormalizer(wastePoints, "waste_kg_per_day");

    return wastePoints.map(p => [
        p.lat,
        p.lng,
        norm(p.waste_kg_per_day) * wWaste + baseline
    ]);
}

function updateHeatmap() {
    const heatData = buildHeatData();

    if (heatLayer) map.removeLayer(heatLayer);

    heatLayer = L.heatLayer(heatData, {
        radius: 35,
        blur: 20,
        maxZoom: 17
    }).addTo(map);
}

// =========================
// Basemap UI (floating button + thumbnail)
// =========================
document.getElementById("basemapButton").addEventListener("click", () => {
    document.getElementById("basemapMenu").classList.toggle("hidden");
});

document.querySelectorAll(".basemap-item").forEach(item => {
    item.addEventListener("click", () => {
        const layerName = item.getAttribute("data-layer");
        const newLayer = baseLayers[layerName];

        if (currentBaseLayer) map.removeLayer(currentBaseLayer);

        currentBaseLayer = newLayer;
        currentBaseLayer.addTo(map);

        document.getElementById("basemapMenu").classList.add("hidden");
    });
});

// =========================
// Debug Marker Layer
// =========================
function addDebugMarkers() {
    const wasteLayer = L.layerGroup();

    wastePoints.forEach(p => {
        L.circleMarker([p.lat, p.lng], {
            radius: 5,
            color: "#ef4444"
        })
        .bindPopup(`<strong>ID:</strong> ${p.id}<br><strong>Sampah:</strong> ${p.waste_kg_per_day} kg/hari`)
        .addTo(wasteLayer);
    });

    L.control.layers(baseLayers, { "Timbulan Sampah (marker)": wasteLayer }).addTo(map);

    wasteLayer.addTo(map);
}

// =========================
// Init
// =========================
addDebugMarkers();
updateHeatmap();

document.getElementById("btnUpdate").addEventListener("click", updateHeatmap);
document.getElementById("baseline").addEventListener("input", e => {
    document.getElementById("baselineVal").textContent = e.target.value;
});
document.getElementById("wWaste").addEventListener("input", e => {
    document.getElementById("wWasteVal").textContent = e.target.value;
});

// =========================
// Inisialisasi Peta
// =========================
const map = L.map("map").setView([-6.92, 107.61], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let heatLayer = null;


// =========================
// Helper Normalisasi
// =========================
function createNormalizer(arr, field) {
    if (!arr || arr.length === 0) return () => 0;

    const values = arr.map(o => o[field]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const denom = max - min || 1;

    return (v) => (v - min) / denom;
}


// =========================
// Convert meter → pixel (Leaflet)
// =========================
function metersToPixels(meters, lat, zoom) {
    const earthCircumference = 40075016.686;
    const latRad = lat * Math.PI / 180;
    const metersPerPixel = earthCircumference * Math.cos(latRad) / Math.pow(2, zoom + 8);

    return meters / metersPerPixel;
}


// =========================
// Build Heat Data (KDE)
// =========================
function buildHeatData(opt) {
    const { useWaste, useInfra, useLandcover, wWaste, wInfra, wLandcover } = opt;

    const heatData = [];

    const normWaste = createNormalizer(wastePoints, "waste_kg_per_day");
    const normInfra = createNormalizer(infraPoints, "infra_density");
    const normLand = createNormalizer(landcoverPoints, "landcover_score");

    if (useWaste) {
        wastePoints.forEach(p => {
            heatData.push([
                p.lat,
                p.lng,
                (normWaste(p.waste_kg_per_day) * wWaste) + 0.3
            ]);
        });
    }

    if (useInfra) {
        infraPoints.forEach(p => {
            heatData.push([
                p.lat,
                p.lng,
                (normInfra(p.infra_density) * wInfra) + 0.3
            ]);
        });
    }

    if (useLandcover) {
        landcoverPoints.forEach(p => {
            heatData.push([
                p.lat,
                p.lng,
                (normLand(p.landcover_score) * wLandcover) + 0.3
            ]);
        });
    }

    return heatData;
}


// =========================
// Render Heatmap - Dynamic KDE Radius
// =========================
function updateHeatmap() {
    const useWaste = chkWaste.checked;
    const useInfra = chkInfra.checked;
    const useLandcover = chkLandcover.checked;

    const wWaste = parseFloat(wWasteInput.value);
    const wInfra = parseFloat(wInfraInput.value);
    const wLandcover = parseFloat(wLandInput.value);

    // ==============================
    // Radius KDE (KM) dari slider (0.1–10 km)
    // ==============================
    const kdeRadiusKm = parseFloat(kdeRadiusInput.value); // sudah 0.1–10 km
    const kdeRadiusMeters = kdeRadiusKm * 1000;

    const heatData = buildHeatData({
        useWaste,
        useInfra,
        useLandcover,
        wWaste,
        wInfra,
        wLandcover
    });

    if (heatLayer) map.removeLayer(heatLayer);
    if (heatData.length === 0) return;

    const zoom = map.getZoom();
    const centerLat = map.getCenter().lat;

    const radiusPixels = metersToPixels(kdeRadiusMeters, centerLat, zoom);

    heatLayer = L.heatLayer(heatData, {
        radius: radiusPixels,
        blur: radiusPixels * 0.4,
        maxZoom: 18
    }).addTo(map);
}


// =========================
// UI Binding
// =========================
const wWasteInput = document.getElementById("wWaste");
const wInfraInput = document.getElementById("wInfra");
const wLandInput = document.getElementById("wLandcover");

const wWasteVal = document.getElementById("wWasteVal");
const wInfraVal = document.getElementById("wInfraVal");
const wLandVal = document.getElementById("wLandcoverVal");

const kdeRadiusInput = document.getElementById("kdeRadius");
const kdeRadiusVal = document.getElementById("kdeRadiusVal");

const chkWaste = document.getElementById("chkWaste");
const chkInfra = document.getElementById("chkInfra");
const chkLandcover = document.getElementById("chkLandcover");

function bindUI() {
    wWasteInput.addEventListener("input", () => {
        wWasteVal.textContent = wWasteInput.value;
    });

    wInfraInput.addEventListener("input", () => {
        wInfraVal.textContent = wInfraInput.value;
    });

    wLandInput.addEventListener("input", () => {
        wLandVal.textContent = wLandInput.value;
    });

    kdeRadiusInput.addEventListener("input", () => {
        kdeRadiusVal.textContent = kdeRadiusInput.value;
        updateHeatmap();
    });

    chkWaste.addEventListener("change", updateHeatmap);
    chkInfra.addEventListener("change", updateHeatmap);
    chkLandcover.addEventListener("change", updateHeatmap);

    document.getElementById("btnUpdate").addEventListener("click", updateHeatmap);
}


// =========================
// Auto-update saat zoom
// =========================
map.on("zoomend", updateHeatmap);


// =========================
// Debug markers
// =========================
function addDebugMarkers() {
    const w = L.layerGroup();
    const i = L.layerGroup();
    const l = L.layerGroup();

    wastePoints.forEach(p =>
        L.circleMarker([p.lat, p.lng], { radius: 5, color: "red" })
            .bindPopup(`Waste ${p.id}`)
            .addTo(w)
    );

    infraPoints.forEach(p =>
        L.circleMarker([p.lat, p.lng], { radius: 5, color: "blue" })
            .bindPopup(`Infra ${p.id}`)
            .addTo(i)
    );

    landcoverPoints.forEach(p =>
        L.circleMarker([p.lat, p.lng], { radius: 5, color: "green" })
            .bindPopup(`Land ${p.id}`)
            .addTo(l)
    );

    L.control.layers(null, {
        "Waste Points": w,
        "Infra Points": i,
        "Landcover Points": l
    }).addTo(map);

    w.addTo(map);
    i.addTo(map);
    l.addTo(map);
}


// =========================
// Init
// =========================
bindUI();
addDebugMarkers();
updateHeatmap();

// =========================
// Inisialisasi Peta
// =========================
const map = L.map("map").setView([-6.92, 107.61], 13);

// Basemap (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Layer heatmap global
let heatLayer = null;

// =========================
// Helper Normalisasi
// =========================
function createNormalizer(arr, field) {
    if (!arr || arr.length === 0) {
        return () => 0;
    }
    const values = arr.map(o => o[field]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const denom = max - min || 1; // Hindari pembagian 0
    return (v) => (v - min) / denom;
}

// =========================
// Generate Heat Points (KDE-style)
// =========================
//
// Leaflet.heat secara konsep menggunakan kernel (biasanya Gaussian) di tiap titik,
// sehingga secara praktis sudah menjadi implementasi Kernel Density Estimation (KDE)
// di atas bidang koordinat.
//
// Di sini, intensitas setiap titik adalah kombinasi ter-normalisasi
// dari tiga layer: timbulan sampah, infrastruktur, dan tutupan lahan.
//
function buildHeatData(options) {
    const {
        useWaste,
        useInfra,
        useLandcover,
        wWaste,
        wInfra,
        wLandcover
    } = options;

    const heatData = [];

    // Normalizer per layer
    const normWaste = createNormalizer(wastePoints, "waste_kg_per_day");
    const normInfra = createNormalizer(infraPoints, "infra_density");
    const normLand = createNormalizer(landcoverPoints, "landcover_score");

    // Tambahkan titik timbulan sampah
    if (useWaste) {
        wastePoints.forEach(p => {
            const intensity = normWaste(p.waste_kg_per_day) * wWaste;
            heatData.push([p.lat, p.lng, intensity]);
        });
    }

    // Tambahkan titik infrastruktur
    if (useInfra) {
        infraPoints.forEach(p => {
            const intensity = normInfra(p.infra_density) * wInfra;
            heatData.push([p.lat, p.lng, intensity]);
        });
    }

    // Tambahkan titik tutupan lahan
    if (useLandcover) {
        landcoverPoints.forEach(p => {
            const intensity = normLand(p.landcover_score) * wLandcover;
            heatData.push([p.lat, p.lng, intensity]);
        });
    }

    return heatData;
}

// =========================
// Render Awal Heatmap
// =========================
function updateHeatmap() {
    const useWaste = document.getElementById("chkWaste").checked;
    const useInfra = document.getElementById("chkInfra").checked;
    const useLandcover = document.getElementById("chkLandcover").checked;

    const wWaste = parseFloat(document.getElementById("wWaste").value);
    const wInfra = parseFloat(document.getElementById("wInfra").value);
    const wLandcover = parseFloat(document.getElementById("wLandcover").value);

    const heatData = buildHeatData({
        useWaste,
        useInfra,
        useLandcover,
        wWaste,
        wInfra,
        wLandcover
    });

    if (heatLayer) {
        map.removeLayer(heatLayer);
    }

    // Jika tidak ada data, jangan render heatmap
    if (heatData.length === 0) {
        heatLayer = null;
        return;
    }

    // Leaflet.heat: [lat, lng, intensity]
    heatLayer = L.heatLayer(heatData, {
        radius: 35,
        blur: 18,
        maxZoom: 17
    }).addTo(map);
}

// =========================
// UI Event
// =========================
function bindUI() {
    const wWasteInput = document.getElementById("wWaste");
    const wInfraInput = document.getElementById("wInfra");
    const wLandInput = document.getElementById("wLandcover");

    const wWasteVal = document.getElementById("wWasteVal");
    const wInfraVal = document.getElementById("wInfraVal");
    const wLandVal = document.getElementById("wLandcoverVal");

    // Update label saat slider digeser
    wWasteInput.addEventListener("input", () => {
        wWasteVal.textContent = wWasteInput.value;
    });
    wInfraInput.addEventListener("input", () => {
        wInfraVal.textContent = wInfraInput.value;
    });
    wLandInput.addEventListener("input", () => {
        wLandVal.textContent = wLandInput.value;
    });

    document.getElementById("btnUpdate").addEventListener("click", () => {
        updateHeatmap();
    });

    // Checkbox langsung trigger update
    document.getElementById("chkWaste").addEventListener("change", updateHeatmap);
    document.getElementById("chkInfra").addEventListener("change", updateHeatmap);
    document.getElementById("chkLandcover").addEventListener("change", updateHeatmap);
}

// =========================
// (Opsional) Tambahkan marker titik-titik untuk debug
// =========================
function addDebugMarkers() {
    // Layer grup, kalau mau dihidup-matikan pakai control
    const wasteLayer = L.layerGroup();
    const infraLayer = L.layerGroup();
    const landLayer = L.layerGroup();

    wastePoints.forEach(p => {
        L.circleMarker([p.lat, p.lng], {
            radius: 5,
            color: "#ef4444"
        }).bindPopup(
            `<strong>Timbulan Sampah</strong><br>ID: ${p.id}<br>Sampah: ${p.waste_kg_per_day} kg/hari`
        ).addTo(wasteLayer);
    });

    infraPoints.forEach(p => {
        L.circleMarker([p.lat, p.lng], {
            radius: 5,
            color: "#3b82f6"
        }).bindPopup(
            `<strong>Infrastruktur</strong><br>ID: ${p.id}<br>Kepadatan: ${p.infra_density}`
        ).addTo(infraLayer);
    });

    landcoverPoints.forEach(p => {
        L.circleMarker([p.lat, p.lng], {
            radius: 5,
            color: "#10b981"
        }).bindPopup(
            `<strong>Tutupan Lahan</strong><br>ID: ${p.id}<br>Kelas: ${p.landcover_class}<br>Skor: ${p.landcover_score}`
        ).addTo(landLayer);
    });

    const overlays = {
        "Timbulan Sampah (marker)": wasteLayer,
        "Infrastruktur (marker)": infraLayer,
        "Tutupan Lahan (marker)": landLayer
    };

    wasteLayer.addTo(map);
    infraLayer.addTo(map);
    landLayer.addTo(map);

    L.control.layers(null, overlays, { collapsed: true }).addTo(map);
}

// =========================
// Init
// =========================
bindUI();
addDebugMarkers();
updateHeatmap();

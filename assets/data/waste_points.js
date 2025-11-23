const wastePoints = [
    { id: "W001", lat: -6.12, lng: 106.88, waste_kg_per_day: 120 },
    { id: "W002", lat: -6.91, lng: 107.44, waste_kg_per_day: 85 },
    { id: "W003", lat: -5.78, lng: 109.12, waste_kg_per_day: 210 },
    { id: "W004", lat: -6.55, lng: 105.77, waste_kg_per_day: 65 },
    { id: "W005", lat: -5.99, lng: 108.34, waste_kg_per_day: 140 },
    { id: "W006", lat: -6.72, lng: 106.43, waste_kg_per_day: 95 },
    { id: "W007", lat: -5.83, lng: 109.55, waste_kg_per_day: 178 },
    { id: "W008", lat: -6.31, lng: 105.91, waste_kg_per_day: 220 },
    { id: "W009", lat: -6.44, lng: 108.76, waste_kg_per_day: 155 },
    { id: "W010", lat: -5.67, lng: 107.88, waste_kg_per_day: 77 },

    { id: "W011", lat: -6.22, lng: 109.33, waste_kg_per_day: 180 },
    { id: "W012", lat: -6.95, lng: 106.51, waste_kg_per_day: 105 },
    { id: "W013", lat: -5.72, lng: 108.19, waste_kg_per_day: 250 },
    { id: "W014", lat: -6.66, lng: 105.92, waste_kg_per_day: 98 },
    { id: "W015", lat: -6.11, lng: 109.48, waste_kg_per_day: 112 },
    { id: "W016", lat: -6.84, lng: 107.77, waste_kg_per_day: 175 },
    { id: "W017", lat: -6.17, lng: 108.66, waste_kg_per_day: 143 },
    { id: "W018", lat: -5.91, lng: 106.12, waste_kg_per_day: 66 },
    { id: "W019", lat: -6.45, lng: 109.71, waste_kg_per_day: 199 },
    { id: "W020", lat: -6.03, lng: 107.33, waste_kg_per_day: 131 },

    { id: "W021", lat: -6.75, lng: 106.91, waste_kg_per_day: 143 },
    { id: "W022", lat: -5.82, lng: 108.55, waste_kg_per_day: 210 },
    { id: "W023", lat: -6.44, lng: 105.66, waste_kg_per_day: 95 },
    { id: "W024", lat: -5.99, lng: 109.23, waste_kg_per_day: 178 },
    { id: "W025", lat: -6.23, lng: 107.12, waste_kg_per_day: 136 },
    { id: "W026", lat: -6.55, lng: 108.87, waste_kg_per_day: 155 },
    { id: "W027", lat: -5.71, lng: 106.44, waste_kg_per_day: 122 },
    { id: "W028", lat: -6.39, lng: 109.02, waste_kg_per_day: 199 },
    { id: "W029", lat: -6.88, lng: 105.79, waste_kg_per_day: 65 },
    { id: "W030", lat: -6.12, lng: 108.31, waste_kg_per_day: 89 }


    // ============================
    // 170 titik tambahan (dibangkitkan algoritmik)
    // ============================
];


// Generate tambahan 170 titik dummy secara otomatis
for (let i = 31; i <= 200; i++) {
    // Area sekitar Kota Bandung (random ± 0.03 derajat)
    const baseLat = -6.92;
    const baseLng = 107.61;

    const lat = baseLat + (Math.random() * 0.04 - 0.02);
    const lng = baseLng + (Math.random() * 0.04 - 0.02);

    const waste = Math.floor(Math.random() * 250) + 50; // 50–300 kg/hari

    wastePoints.push({
        id: "W" + String(i).padStart(3, "0"),
        lat,
        lng,
        waste_kg_per_day: waste
    });
}

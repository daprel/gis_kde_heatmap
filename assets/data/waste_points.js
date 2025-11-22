const wastePoints = [
    { id: "W001", lat: -6.9001, lng: 107.6001, waste_kg_per_day: 120 },
    { id: "W002", lat: -6.9004, lng: 107.6009, waste_kg_per_day: 85 },
    { id: "W003", lat: -6.9009, lng: 107.6015, waste_kg_per_day: 210 },
    { id: "W004", lat: -6.9012, lng: 107.6024, waste_kg_per_day: 65 },
    { id: "W005", lat: -6.9017, lng: 107.6030, waste_kg_per_day: 140 },
    { id: "W006", lat: -6.9020, lng: 107.6038, waste_kg_per_day: 95 },
    { id: "W007", lat: -6.9023, lng: 107.6047, waste_kg_per_day: 178 },
    { id: "W008", lat: -6.9026, lng: 107.6051, waste_kg_per_day: 220 },
    { id: "W009", lat: -6.9031, lng: 107.6058, waste_kg_per_day: 155 },
    { id: "W010", lat: -6.9034, lng: 107.6064, waste_kg_per_day: 77 },

    { id: "W011", lat: -6.9041, lng: 107.6072, waste_kg_per_day: 180 },
    { id: "W012", lat: -6.9045, lng: 107.6079, waste_kg_per_day: 105 },
    { id: "W013", lat: -6.9049, lng: 107.6085, waste_kg_per_day: 250 },
    { id: "W014", lat: -6.9052, lng: 107.6093, waste_kg_per_day: 98 },
    { id: "W015", lat: -6.9055, lng: 107.6099, waste_kg_per_day: 112 },
    { id: "W016", lat: -6.9060, lng: 107.6104, waste_kg_per_day: 175 },
    { id: "W017", lat: -6.9063, lng: 107.6111, waste_kg_per_day: 143 },
    { id: "W018", lat: -6.9067, lng: 107.6119, waste_kg_per_day: 66 },
    { id: "W019", lat: -6.9071, lng: 107.6125, waste_kg_per_day: 199 },
    { id: "W020", lat: -6.9075, lng: 107.6130, waste_kg_per_day: 131 },

    { id: "W021", lat: -6.9080, lng: 107.6140, waste_kg_per_day: 143 },
    { id: "W022", lat: -6.9085, lng: 107.6147, waste_kg_per_day: 210 },
    { id: "W023", lat: -6.9089, lng: 107.6153, waste_kg_per_day: 95 },
    { id: "W024", lat: -6.9093, lng: 107.6159, waste_kg_per_day: 178 },
    { id: "W025", lat: -6.9097, lng: 107.6166, waste_kg_per_day: 136 },
    { id: "W026", lat: -6.9101, lng: 107.6172, waste_kg_per_day: 155 },
    { id: "W027", lat: -6.9105, lng: 107.6179, waste_kg_per_day: 122 },
    { id: "W028", lat: -6.9109, lng: 107.6184, waste_kg_per_day: 199 },
    { id: "W029", lat: -6.9112, lng: 107.6191, waste_kg_per_day: 65 },
    { id: "W030", lat: -6.9116, lng: 107.6199, waste_kg_per_day: 89 },

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

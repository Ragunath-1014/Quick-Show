const generateSeats = () => {
    const layout = [];

    const sections = [
        { name: "Platinum", rows: ["A", "B", "C", "D"], price: 210 },
        { name: "Gold", rows: ["E", "F", "G", "H"], price: 180 },
        { name: "Silver", rows: ["I", "J", "K", "L"], price: 150 }
    ];

    const seatsPerRow = 20;

    for (const section of sections) {
        let sectionObj = {
            section: section.name,
            price: section.price,
            rows: []
        };

        for (const row of section.rows) {
            let rowSeats = [];

            for (let i = 1; i <= seatsPerRow; i++) {
                rowSeats.push({
                    seatNumber: `${row}${i}`
                });
            }

            sectionObj.rows.push({
                row,
                seats: rowSeats
            });
        }

        layout.push(sectionObj);
    }

    return layout;
}

module.exports = generateSeats;
import * as readline from "readline";
import {
	createReadStream,
	createWriteStream,
	unlinkSync
} from "fs";

const fileName = "alternance_2022.csv";

const reader = readline.createInterface(createReadStream("./data/alternance_2022.csv"));

const year = 2022;
const statingMonth = 0;

unlinkSync("./out/" + fileName);
const outWriter = createWriteStream("./out/" + fileName)

reader.on("line", (line) => {
	const csv = line.split(",");

	// REMEMBER: We read the n day of each month PER LINE

	let monthOffset = 0;
	for (let nextMonthIndex = 0; nextMonthIndex < 6; nextMonthIndex++) {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		date.setFullYear(year, statingMonth + nextMonthIndex, parseInt(csv[monthOffset + 1]));

		console.log(date.toLocaleDateString(), csv[monthOffset + 2]);

		if (!isNaN(date))
			outWriter.write(`${date.toISOString()},${csv[monthOffset + 2]}\n`);

		monthOffset += 4;
	}

});

reader.on("close", () => outWriter.end());
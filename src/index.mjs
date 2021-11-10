import * as readline from "readline";
import * as fs from "fs";

function processFile(inputFile, year, startingMonth) {
	const reader = readline.createInterface(fs.createReadStream(`./inputs/${inputFile}`));

	const outputPath = `./outputs/${inputFile}`;

	if (fs.existsSync(outputPath))
		fs.unlinkSync(outputPath);
	const outWriter = fs.createWriteStream(outputPath);

	reader.on("line", (line) => {
		const csv = line.split(",");

		// REMEMBER: We read the n day of each month PER LINE

		let monthOffset = 0;
		for (let nextMonthIndex = 0; nextMonthIndex < 6; nextMonthIndex++) {
			const date = new Date();
			date.setHours(0, 0, 0, 0);
			date.setFullYear(year, startingMonth + nextMonthIndex, parseInt(csv[monthOffset + 1]));

			if (!isNaN(date))
				outWriter.write(`${date.toISOString()},${csv[monthOffset + 2]}\n`);

			monthOffset += 4;
		}

	});

	reader.on("close", () => outWriter.end());
}

if (!fs.existsSync("./outputs"))
	fs.mkdirSync("./outputs");

const manifest = JSON.parse(fs.readFileSync("./inputs/manifest.json").toString());

manifest.forEach(({
	file,
	year,
	startingMonth
}) => processFile(file, year, startingMonth));
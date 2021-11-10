import * as readline from "readline";
import * as fs from "fs";

let processedFiles = 0;

function mergeOutputs(files) {

	const mergedOutputPath = "./outputs/merged.csv";
	if (fs.existsSync(mergedOutputPath))
		fs.unlinkSync(mergedOutputPath);

	for (const file of files) {
		fs.appendFileSync(mergedOutputPath, fs.readFileSync(`./outputs/${file}`));
	}

}

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

			if (csv[monthOffset + 2] === undefined)
				console.log("Undefined activity found in file", inputFile, csv.join(","));

			if (!isNaN(date))
				outWriter.write(`${date.toISOString()},${csv[monthOffset + 2]}\n`);

			monthOffset += 4;
		}

	});

	reader.on("close", () => {
		outWriter.end();
		processedFiles++;

		if (processedFiles === manifest.length)
			mergeOutputs(manifest.map(e => e.file));
	});
}



if (!fs.existsSync("./outputs"))
	fs.mkdirSync("./outputs");

const manifest = JSON.parse(fs.readFileSync("./inputs/manifest.json").toString());

manifest.forEach(({
	file,
	year,
	startingMonth
}) => processFile(file, year, startingMonth));
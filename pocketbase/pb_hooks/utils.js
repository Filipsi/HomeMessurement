module.exports = {
	aggregate: (from, to, period) => {
		// Create a filter that can be used to filter our measurements from statistic range
		const range = {
			from: from.toISOString().replace("T", " "),
			to: to.toISOString().replace("T", " ")
		};

		// Get all defined locations
		const locations = arrayOf(new Record);
		$app.recordQuery("locations").all(locations);

		// Get the statistics table where we will write all of the generated statistic records
		const statistics = $app.findCollectionByNameOrId("statistics");

		// Go trough each location
		for (const location of locations) {

			// Get current location id
			const locationId = location.get("id");

			// Filter our measurements on this location for current range
			const measurements = $app.findAllRecords("measurements",
				$dbx.hashExp({ "location": locationId }),
				$dbx.exp("created BETWEEN {:from} AND {:to}", range)
			);

			// If there are no measurements generated at this location, do not create a statistic
			if (measurements.length == 0) {
				continue;
			}

			// Get temperature and humidity values
			const temperatures = measurements.map(measurement => measurement.get("temperature"));
			const humidities = measurements.map(measurement => measurement.get("humidity"));
			const voltages = measurements.map(measurement => measurement.get("voltage"));

			// Calculate the average values
			const temperatureAverage = temperatures.reduce((a, b) => a + b) / temperatures.length;
			const humidityAverage = humidities.reduce((a, b) => a + b) / humidities.length;
			const voltageAverage = voltages.reduce((a, b) => a + b) / voltages.length;

			// Calculate the rounded averages to two decimal places
			const temperatureRoundedAverage = Math.round((temperatureAverage + Number.EPSILON) * 100) / 100;
			const humidityRoundedAverage = Math.round((humidityAverage + Number.EPSILON) * 100) / 100;
			const voltageRoundedAverage = Math.round((voltageAverage + Number.EPSILON) * 100) / 100;

			// Print out debug into
			console.log("Generating '" + period + "' statistic for location '" + location.get("name") + "'...");
			console.log("Range: " + JSON.stringify(range));
			console.log("Measurements found: " + measurements.length);
			console.log("Collected temperatures: " + JSON.stringify(temperatures));
			console.log("Average temperature: " + temperatureRoundedAverage);
			console.log("Collected humidities: " + JSON.stringify(humidities));
			console.log("Average humidity: " + humidityRoundedAverage);
			console.log("Collected voltages: " + JSON.stringify(voltages));
			console.log("Average voltage: " + voltageRoundedAverage);

			// Create new statistic record for location
			const statistic = new Record(statistics);
			statistic.set("location", locationId);
			statistic.set("measurements", measurements.length);
			statistic.set("temperature", temperatureRoundedAverage);
			statistic.set("humidity", humidityRoundedAverage);
			statistic.set("voltage", voltageRoundedAverage);
			statistic.set("period", period);
			statistic.set("aggregated", to);
			$app.save(statistic);
		}
	}
}
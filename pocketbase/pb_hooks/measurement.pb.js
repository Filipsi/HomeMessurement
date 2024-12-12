/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/api/measurement/sensor/{id}", (e) => {
	// Resolve request info
	const info = e.requestInfo();

	// Get data from the request
	const id = e.request.pathValue("id");
	const temperature = info.query["temperature"];
	const humidity = info.query["humidity"];
	const voltage = info.query["voltage"];

	// Ensure that the request have all required parameters
	if (!temperature || !humidity) {
		return e.badRequestError("Temperature and humidity must be specified")
	}

	// Find sensor based on specified id
	const sensors = $app.findCollectionByNameOrId("sensors");
	const sensor = $app.findRecordById(sensors, id);

	// Get the measurements collection
	const measurements = $app.findCollectionByNameOrId("measurements");

	// Create new measurement record based on provided values
	const measurement = new Record(measurements);
	measurement.set("sensor", sensor.get('id'));
	measurement.set("location", sensor.get('location'));
	measurement.set("temperature", temperature);
	measurement.set("humidity", humidity);
	measurement.set("voltage", voltage);
	$app.save(measurement);
	
	return e.noContent(200);
}, $apis.requireGuestOnly());
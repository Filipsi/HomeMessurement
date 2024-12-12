/// <re\erence path="../pb_data/types.d.ts" />

// There might be some deviation when the CRON job runs, so we reset ss.fff portion of the timestamp

cronAdd("statistic_minute", "* * * * *", () => {
	// Create a timestamp based on current moment
	const to = new Date();
	to.setMilliseconds(0);
	to.setSeconds(0);

	// Create a timestamp minute in the past
	const from = new Date(to.toString());
	from.setMinutes(from.getMinutes() - 1);
	
	// Create statistic over last minute
	const utils = require(`${__hooks}/utils.js`);
	utils.aggregate(from, to, "minute");
});

cronAdd("statistic_hour", "0 * * * *", () => {
	// Create a timestamp based on current moment
	const to = new Date();
	to.setMilliseconds(0);
	to.setSeconds(0);

	// Create a timestamp hour in the past
	const from = new Date(to.toString());
	from.setHours(from.getHours() - 1);

	// Create statistic over last hour
	const utils = require(`${__hooks}/utils.js`);
	utils.aggregate(from, to, "hour");
});

cronAdd("statistic_day", "0 0 * * *", () => {
	// Create a timestamp based on current moment
	const to = new Date();
	to.setMilliseconds(0);
	to.setSeconds(0);

	// Create a timestamp day in the past
	const from = new Date(to.toString());
	from.setDate(from.getDate() - 1);

	// Create statistic over last day
	const utils = require(`${__hooks}/utils.js`);
	utils.aggregate(from, to, "day");
});

cronAdd("statistic_month", "0 0 1 * *", () => {
	// Create a timestamp based on current moment
	const to = new Date();
	to.setMilliseconds(0);
	to.setSeconds(0);

	// Create a timestamp month in the past
	const from = new Date(to.toString());
	from.setMonth(from.getMonth() - 1);

	// Create statistic over last month
	const utils = require(`${__hooks}/utils.js`);
	utils.aggregate(from, to, "month");
});
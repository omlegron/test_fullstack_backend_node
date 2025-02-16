// Define 
var NodeCache = require('node-cache'),
	axios = require('axios');

const cache = new NodeCache({ stdTTL: 18000 }); // Cache for 10 minutes

async function index(req, res) {
	const filteredQuery = Object.fromEntries(
		Object.entries(req.query).map(([key, value]) => {
			if (value !== '') {
			if (key === 'pickup_datetime' || key === 'dropoff_datetime') {
				value = value.replace('.000Z', '')
			}
			return [key, value]
			}
			return [key, value]
		}).filter(([key, value]) => value !== '')
	);

	console.log('filteredQuery', filteredQuery)
	// filteredQuery['$limit'] = 10
	const cacheKey = `nycData_${JSON.stringify(filteredQuery)}`;
	const cacheKeyAnal = `nycData_${JSON.stringify(filteredQuery)}_cacheKeyAnal`;

	// Check if data is in cache
	const cachedData = cache.get(cacheKey);
	const cachedDataAnal = cache.get(cacheKeyAnal);
	if (cachedData) {
		return res.json({
			'data': cachedData,
			'dataAnalytics': cachedDataAnal
		});
	}

	try {
		const response = await axios.get('https://data.cityofnewyork.us/resource/gkne-dk5s.json',{
			params: filteredQuery
		});
		cache.set(cacheKey, response.data); // Store data in cache
		const dataAnal = webAnalytics(response.data)
		cache.set(cacheKeyAnal, dataAnal); // Store data in cache
		
		return res.json({
			'data': response.data,
			'dataAnalytics': dataAnal
		});
		// res.json(response.data);
	} catch (error) {
		res.status(500).json(error);
	}
};

function webAnalytics(req, res){
	var arrayAnalytic = []
	var arrayMonthly = []
	var arrDate = []

	if(req.length > 0){
		req.forEach((value, key) => {
			if (!arrayAnalytic[value.vendor_id]) {
				arrayAnalytic[value.vendor_id] = {
					vendor_id: '',
					tip_amount: 0,
					total_amount: 0,
					trip_distance: 0,
					total_data: 0,
					passenger_count: 0,
					rate_code: 0,
				};
			}
			arrayAnalytic[value.vendor_id].vendor_id = value.vendor_id;
			arrayAnalytic[value.vendor_id].tip_amount += parseFloat(value.tip_amount);
			arrayAnalytic[value.vendor_id].total_amount += parseFloat(value.total_amount);
			arrayAnalytic[value.vendor_id].trip_distance += parseFloat(value.trip_distance);
			arrayAnalytic[value.vendor_id].passenger_count += parseFloat(value.passenger_count);
			arrayAnalytic[value.vendor_id].rate_code += parseFloat(value.rate_code);
			arrayAnalytic[value.vendor_id].total_data += 1;

			// Monthly
			if (!arrayMonthly[value.vendor_id]) {
				arrayMonthly[value.vendor_id] = {
					name: '',
					total_amount: new Array(12).fill(0),
					passenger: new Array(12).fill(0),
					total_data: new Array(12).fill(0),
					distance: new Array(12).fill(0),
				};
			}

			var checkMonth = new Date(value.pickup_datetime).getMonth();
			
			arrayMonthly[value.vendor_id].name = value.vendor_id;
			arrayMonthly[value.vendor_id].total_amount[checkMonth] += parseFloat(value.total_amount).toFixed(2);
			
			arrayMonthly[value.vendor_id].passenger[checkMonth] += parseFloat(value.passenger_count);
			arrayMonthly[value.vendor_id].total_data[checkMonth] += parseFloat(1);
			arrayMonthly[value.vendor_id].distance[checkMonth] += parseFloat(value.trip_distance).toFixed(2);
			
			// Date
			var checkDate = new Date(value.pickup_datetime).getDate();
			var checkMonth = new Date(value.pickup_datetime).getMonth();
			var checkYear = new Date(value.pickup_datetime).getFullYear();

			if (!arrDate[value.vendor_id]) {
				arrDate[value.vendor_id] = {
					name: '',
					label: [],
					trip_distance: []
				};
			}

			arrDate[value.vendor_id].name = value.vendor_id;

			if (!arrDate[value.vendor_id].trip_distance[checkDate+'/'+checkMonth+'/'+checkYear]) {
				arrDate[value.vendor_id].trip_distance[checkDate+'/'+checkMonth+'/'+checkYear] = 0;
			}
			arrDate[value.vendor_id].label.push(checkDate+'/'+checkMonth+'/'+checkYear);
			arrDate[value.vendor_id].trip_distance[checkDate+'/'+checkMonth+'/'+checkYear] += parseFloat(value.trip_distance);

			arrDate[value.vendor_id].label.sort((a, b) => {
				const dateA = new Date(a.split('/')[2], a.split('/')[1], a.split('/')[0]);
				const dateB = new Date(b.split('/')[2], b.split('/')[1], b.split('/')[0]);
				return dateA - dateB;
			});

			arrDate[value.vendor_id].trip_distance = Object.keys(arrDate[value.vendor_id].trip_distance).sort((a, b) => {
				const dateA = new Date(a.split('/')[2], a.split('/')[1], a.split('/')[0]);
				const dateB = new Date(b.split('/')[2], b.split('/')[1], b.split('/')[0]);
				return dateA - dateB;
			}).map(key => {
				return arrDate[value.vendor_id].trip_distance[key]
			});

			// console.log('checkDate', checkDate)
			// console.log('checkMonth', checkMonth)

		}, {});

		Object.keys(arrayAnalytic).forEach(vendorId => {
			const tipAmount = arrayAnalytic[vendorId].tip_amount;
			const totalAmount = arrayAnalytic[vendorId].total_amount;
			const passengerCount = arrayAnalytic[vendorId].passenger_count;
			const rateCode = arrayAnalytic[vendorId].rate_code;
	
			if (totalAmount > 0 && rateCode > 0) {
				arrayAnalytic[vendorId].rating = parseFloat(passengerCount / rateCode);
			}
		});

		return {
			'arrayAnalytic': Object.values(arrayAnalytic),
			'arrayMonthly': Object.values(arrayMonthly),
			'arrDate': Object.values(arrDate),
		}
	}
}



module.exports = {
	index,
};

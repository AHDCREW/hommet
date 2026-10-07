import fs from 'node:fs/promises';
const files = [
['sanitary.jpg','https://upload.wikimedia.org/wikipedia/commons/b/b0/Soap_dish_-_built-in_-_white_sink.jpg'],
['toilets.jpg','https://commons.wikimedia.org/wiki/Special:FilePath/Our_first_encounter_with_a_toto_automatic_toilet_(haneda_airport,_tokyo)_(19716600310).jpg'],
['fitness.jpg','https://upload.wikimedia.org/wikipedia/commons/3/33/Gym_Cardio_Area_Overlooking_Greenery.JPG'],
['hvac.jpg','https://upload.wikimedia.org/wikipedia/commons/b/b4/McQuay_AIR_CONDITIONING_AIR_CONDITIONER_OUTDOOR_UNIT_%289%29.jpg'],
['automation.jpg','https://upload.wikimedia.org/wikipedia/commons/c/cd/Nest_Thermostat_3rd_Generation_%28Creative_Commons%29_%2845096474951%29.jpg']
];
for (const [name,url] of files) { try {const r=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error(r.status);await fs.writeFile(`public/images/${name}`,Buffer.from(await r.arrayBuffer()));console.log('OK',name);}catch(e){console.log('FAILED',name,e.message);} await new Promise(r=>setTimeout(r,1500)); }

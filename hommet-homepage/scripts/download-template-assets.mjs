import fs from 'node:fs/promises';
const files = [
['doors.jpg','https://upload.wikimedia.org/wikipedia/commons/7/73/Window_of_house.jpg'],
['sealants.jpg','https://americanprestocorp.com/pub/media/catalog/product/cache/da0bdbae2950b63b5bfb000fc2057470/4/5/45_cgr_1_web_1.jpg'],
['terracotta.jpg','https://upload.wikimedia.org/wikipedia/commons/b/b0/Terracotta_wall_tiles.jpg'],
['sanitary.jpg','https://upload.wikimedia.org/wikipedia/commons/b/b0/Soap_dish_-_built-in_-_white_sink.jpg'],
['toilets.jpg','https://commons.wikimedia.org/wiki/Special:FilePath/Our_first_encounter_with_a_toto_automatic_toilet_(haneda_airport,_tokyo)_(19716600310).jpg'],
['fitness.jpg','https://upload.wikimedia.org/wikipedia/commons/3/33/Gym_Cardio_Area_Overlooking_Greenery.JPG'],
['hvac.jpg','https://upload.wikimedia.org/wikipedia/commons/b/b4/McQuay_AIR_CONDITIONING_AIR_CONDITIONER_OUTDOOR_UNIT_%289%29.jpg'],
['pumps.jpg','https://pim-cdn0.ofm.co.th/products/large/Y078207.jpg'],
['automation.jpg','https://upload.wikimedia.org/wikipedia/commons/c/cd/Nest_Thermostat_3rd_Generation_%28Creative_Commons%29_%2845096474951%29.jpg']
];
for (const [name,url] of files) {
 try { const r=await fetch(url,{headers:{'User-Agent':'HommetLocalTemplate/1.0'},signal:AbortSignal.timeout(25000)}); if(!r.ok)throw Error(`${r.status}`);const b=Buffer.from(await r.arrayBuffer());await fs.writeFile(`public/images/${name}`,b);console.log(name,b.length); }catch(e){console.log('FAILED',name,e.message);}
}
await fs.mkdir('public/fonts',{recursive:true});
for (const [name,url] of [['manrope-regular.ttf','https://fonts.gstatic.com/s/manrope/v20/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FO_F.ttf'],['manrope-semibold.ttf','https://fonts.gstatic.com/s/manrope/v20/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk4jE-_F.ttf']]){const r=await fetch(url);if(!r.ok)throw Error(name);await fs.writeFile(`public/fonts/${name}`,Buffer.from(await r.arrayBuffer()));console.log(name,'downloaded');}

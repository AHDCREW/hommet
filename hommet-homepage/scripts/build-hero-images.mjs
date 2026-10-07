import fs from 'node:fs/promises';
import sharp from 'sharp';
// Full-screen hero slides need lighter copies of the category photos; originals stay untouched for the grid.
const files = ['roofing-hero.jpg','doors.jpg','sealants.jpg','terracotta.jpg','sanitary.jpg','toilets.jpg','fitness.jpg','hvac.jpg','pumps.jpg','automation.jpg'];
await fs.mkdir('public/images/hero',{recursive:true});
for (const name of files) {
 const info = await sharp(`public/images/${name}`).rotate().resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true}).jpeg({quality:74,mozjpeg:true}).toFile(`public/images/hero/${name}`);
 console.log(name,`${info.width}x${info.height}`,Math.round(info.size/1024)+'KB');
}

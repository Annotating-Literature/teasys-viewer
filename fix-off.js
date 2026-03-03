const fs = require('fs');
const jsonP = "content/texts/work/annotations/2029a18c-4684-4798-9327-059e817fa6d4.json";
const obj = JSON.parse(fs.readFileSync(jsonP, 'utf8'));
obj.anchorStart = 66;
obj.anchorEnd = 86;
fs.writeFileSync(jsonP, JSON.stringify(obj, null, 2));

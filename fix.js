const fs = require('fs');
const file = 'c:\\Users\\user210069\\Desktop\\0525_1\\math_problems.js';
let content = fs.readFileSync(file, 'utf8');

// $ ... $ の中身の < と > を &lt; と &gt; に置換
content = content.replace(/\$([^\$]+)\$/g, function(match, p1) {
    let replaced = p1.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '$' + replaced + '$';
});

fs.writeFileSync(file, content, 'utf8');
console.log('done');

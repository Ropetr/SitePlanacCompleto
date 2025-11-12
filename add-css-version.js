/**
 * Adiciona versão ao CSS para forçar reload do cache
 */

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(rootDir, file));

console.log('🔄 Adicionando versão ao styles-components.css...\n');

let modifiedCount = 0;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    const filename = path.basename(file);

    // Substituir styles-components.css por styles-components.css?v=3
    const updated = content.replace(
        /href="styles-components\.css(\?v=\d+)?"/g,
        'href="styles-components.css?v=3"'
    );

    if (updated !== content) {
        fs.writeFileSync(file, updated, 'utf-8');
        console.log(`✅ ${filename}`);
        modifiedCount++;
    }
});

console.log(`\n✅ ${modifiedCount} arquivos atualizados com ?v=3`);
console.log('🚀 Agora faça commit e push para forçar reload do CSS!\n');

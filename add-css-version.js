/**
 * Adiciona versão ao CSS para forçar reload do cache
 */

const fs = require('fs');
const path = require('path');

// Pega a versão do argumento da linha de comando ou usa v=3 como padrão
const version = process.argv[2] || '3';

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(rootDir, file));

console.log(`🔄 Adicionando versão ao styles-components.css...\n`);

let modifiedCount = 0;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    const filename = path.basename(file);

    // Substituir styles-components.css por styles-components.css?v=X
    const updated = content.replace(
        /href="styles-components\.css(\?v=\d+)?"/g,
        `href="styles-components.css?v=${version}"`
    );

    if (updated !== content) {
        fs.writeFileSync(file, updated, 'utf-8');
        console.log(`✅ ${filename}`);
        modifiedCount++;
    }
});

console.log(`\n✅ ${modifiedCount} arquivos atualizados com ?v=${version}`);
console.log('🚀 Agora faça commit e push para forçar reload do CSS!\n');

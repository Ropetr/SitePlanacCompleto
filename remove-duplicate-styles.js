/**
 * ===========================================
 * SCRIPT DE LIMPEZA - Remove estilos duplicados
 * ===========================================
 * Remove estilos de header/footer/dropdown dos HTMLs
 * Deixa apenas o styles-components.css gerenciar
 */

const fs = require('fs');
const path = require('path');

// Padrões de CSS a remover (regex)
const patternsToRemove = [
    // Header styles
    /header\s*\{[^}]*\}/gs,
    /\.header-logo\s*\{[^}]*\}/gs,
    /\.header-logo\s+img\s*\{[^}]*\}/gs,
    /\.header-logo\s+a\s*\{[^}]*\}/gs,
    /\.header-logo\s+a:hover\s*\{[^}]*\}/gs,
    /\.header-logo::before\s*\{[^}]*\}/gs,
    /\.header-nav\s*\{[^}]*\}/gs,
    /\.header-nav::before\s*\{[^}]*\}/gs,
    /\.nav-links\s*\{[^}]*\}/gs,
    /\.nav-links\s+a\s*\{[^}]*\}/gs,
    /\.nav-links\s+a:hover\s*\{[^}]*\}/gs,
    /\.nav-links\s+a:hover::after\s*\{[^}]*\}/gs,
    /\.header-buttons\s*\{[^}]*\}/gs,
    /\.header-buttons\s+img\s*\{[^}]*\}/gs,

    // Dropdown styles
    /\.dropdown\s*\{[^}]*\}/gs,
    /\.dropdown-toggle\s*\{[^}]*\}/gs,
    /\.dropdown-toggle:hover::after\s*\{[^}]*\}/gs,
    /\.dropdown-toggle::after\s*\{[^}]*\}/gs,
    /\.dropdown-menu\s*\{[^}]*\}/gs,
    /\.dropdown-menu::before\s*\{[^}]*\}/gs,
    /\.dropdown-menu\s+li\s*\{[^}]*\}/gs,
    /\.dropdown-menu\s+a\s*\{[^}]*\}/gs,
    /\.dropdown-menu\s+a:hover\s*\{[^}]*\}/gs,
    /\.dropdown-menu\s+a:hover::after\s*\{[^}]*\}/gs,
    /\.dropdown:hover\s+\.dropdown-menu\s*\{[^}]*\}/gs,
    /\.dropdown-menu:hover\s*\{[^}]*\}/gs,
    /\.dropdown-submenu\s*\{[^}]*\}/gs,
    /\.dropdown-toggle-sub\s*\{[^}]*\}/gs,
    /\.dropdown-toggle-sub::after\s*\{[^}]*\}/gs,
    /\.dropdown-menu-sub\s*\{[^}]*\}/gs,
    /\.dropdown-menu-sub::before\s*\{[^}]*\}/gs,
    /\.dropdown-menu-sub\s+li\s*\{[^}]*\}/gs,
    /\.dropdown-menu-sub\s+a\s*\{[^}]*\}/gs,
    /\.dropdown-menu-sub\s+a:hover\s*\{[^}]*\}/gs,
    /\.dropdown-menu-sub\s+a:hover::after\s*\{[^}]*\}/gs,
    /\.dropdown-submenu:hover\s+\.dropdown-menu-sub\s*\{[^}]*\}/gs,
    /\.dropdown-menu-sub:hover\s*\{[^}]*\}/gs,

    // Button styles (header buttons)
    /\.phone-btn\s*\{[^}]*\}/gs,
    /\.phone-btn:hover\s*\{[^}]*\}/gs,
    /\.phone-btn\s+img\s*\{[^}]*\}/gs,
    /\.whatsapp-btn\s*\{[^}]*\}/gs,
    /\.whatsapp-btn:hover\s*\{[^}]*\}/gs,
    /\.whatsapp-btn\s+img\s*\{[^}]*\}/gs,
    /\.instagram-btn\s*\{[^}]*\}/gs,
    /\.instagram-btn:hover\s*\{[^}]*\}/gs,
    /\.instagram-btn\s+img\s*\{[^}]*\}/gs,
    /\.phone-number\s*\{[^}]*\}/gs,

    // Footer styles
    /footer\s*\{[^}]*\}/gs,
    /footer::before\s*\{[^}]*\}/gs,
    /footer\s+\.container\s*\{[^}]*\}/gs,
    /\.footer-content\s*\{[^}]*\}/gs,
    /\.footer-buttons-desktop\s*\{[^}]*\}/gs,
    /\.footer-phone-btn\s*\{[^}]*\}/gs,
    /\.footer-whatsapp-btn\s*\{[^}]*\}/gs,
    /\.footer-location-btn\s*\{[^}]*\}/gs,
    /\.footer-instagram-btn\s*\{[^}]*\}/gs,
    /\.footer-phone-btn:hover\s*\{[^}]*\}/gs,
    /\.footer-whatsapp-btn:hover\s*\{[^}]*\}/gs,
    /\.footer-location-btn:hover\s*\{[^}]*\}/gs,
    /\.footer-instagram-btn:hover\s*\{[^}]*\}/gs,
    /\.footer-phone-number\s*\{[^}]*\}/gs,
    /\.footer-address\s*\{[^}]*\}/gs,
    /\.footer-buttons-desktop\s+img\s*\{[^}]*\}/gs,
    /\.footer-icons-mobile\s*\{[^}]*\}/gs,
    /\.footer-icon-btn\s*\{[^}]*\}/gs,
    /\.footer-icon-btn:hover\s*\{[^}]*\}/gs,
    /\.footer-column\s*\{[^}]*\}/gs,
    /\.footer-column\s+h4\s*\{[^}]*\}/gs,
    /\.footer-column\s+ul\s*\{[^}]*\}/gs,
    /\.footer-column\s+ul\s+li\s*\{[^}]*\}/gs,
    /\.footer-column\s+a\s*\{[^}]*\}/gs,
    /\.footer-column\s+a:hover\s*\{[^}]*\}/gs,
    /\.footer-bottom\s*\{[^}]*\}/gs,
    /\.footer-text-desktop\s*\{[^}]*\}/gs,

    // Mobile menu styles
    /\.mobile-menu-btn\s*\{[^}]*\}/gs,
    /\.mobile-menu-btn\.clicked\s*\{[^}]*\}/gs,
    /\.mobile-menu-btn:hover\s*\{[^}]*\}/gs,
    /\.mobile-menu-btn:active\s*\{[^}]*\}/gs,
    /@keyframes\s+hamburger-pulse\s*\{[^}]*\}/gs,
    /\.mobile-menu-overlay\s*\{[^}]*\}/gs,
    /\.mobile-menu-overlay\.active\s*\{[^}]*\}/gs,
    /\.mobile-menu-sidebar\s*\{[^}]*\}/gs,
    /\.mobile-menu-sidebar::before\s*\{[^}]*\}/gs,
    /\.mobile-menu-sidebar\.active\s*\{[^}]*\}/gs,
    /\.mobile-menu-header\s*\{[^}]*\}/gs,
    /\.mobile-menu-close\s*\{[^}]*\}/gs,
    /\.mobile-menu-close:hover\s*\{[^}]*\}/gs,
    /\.mobile-menu-content\s*\{[^}]*\}/gs,
    /\.mobile-menu-content\s+ul\s*\{[^}]*\}/gs,
    /\.mobile-menu-content\s+>\s+ul\s+>\s+li\s*\{[^}]*\}/gs,
    /\.mobile-menu-content\s+a\s*\{[^}]*\}/gs,
    /\.mobile-menu-content\s+a:hover\s*\{[^}]*\}/gs,
    /\.mobile-menu-dropdown\s*\{[^}]*\}/gs,
    /\.mobile-menu-dropdown\s+>\s+a\s*\{[^}]*\}/gs,
    /\.mobile-menu-dropdown\s+>\s+a::after\s*\{[^}]*\}/gs,
    /\.mobile-menu-dropdown\.open\s+>\s+a::after\s*\{[^}]*\}/gs,
    /\.mobile-menu-dropdown\s+ul\s*\{[^}]*\}/gs,
    /\.mobile-menu-dropdown\.open\s+ul\s*\{[^}]*\}/gs,
    /\.mobile-menu-dropdown\s+ul\s+li\s*\{[^}]*\}/gs,
    /\.mobile-menu-dropdown\s+ul\s+a\s*\{[^}]*\}/gs,
    /\.mobile-menu-submenu\s*\{[^}]*\}/gs,
    /\.mobile-menu-submenu\s+>\s+a\s*\{[^}]*\}/gs,
    /\.mobile-menu-submenu\s+>\s+a::after\s*\{[^}]*\}/gs,
    /\.mobile-menu-submenu\.open\s+>\s+a::after\s*\{[^}]*\}/gs,
    /\.mobile-menu-submenu\s+ul\s*\{[^}]*\}/gs,
    /\.mobile-menu-submenu\.open\s+ul\s*\{[^}]*\}/gs,
    /\.mobile-menu-submenu\s+ul\s+a\s*\{[^}]*\}/gs,
    /@keyframes\s+arrow-pulse\s*\{[^}]*\}/gs,

    // WhatsApp float styles
    /\.whatsapp-float\s*\{[^}]*\}/gs,
    /\.whatsapp-float:hover\s*\{[^}]*\}/gs,
    /\.whatsapp-float\s+img\s*\{[^}]*\}/gs,
    /\.whatsapp-float\s+svg\s*\{[^}]*\}/gs,
    /@keyframes\s+whatsapp-pulse\s*\{[^}]*\}/gs,
    /@keyframes\s+pulse\s*\{[^}]*\}/gs,

    // Comentários relacionados
    /\/\*\s*Header\s*\*\/\s*/g,
    /\/\*\s*Dropdown Menu.*?\*\/\s*/gs,
    /\/\*\s*Footer\s*\*\/\s*/g,
    /\/\*\s*Mobile Menu\s*\*\/\s*/g,
    /\/\*\s*WhatsApp Float\s*\*\/\s*/g,
];

function cleanHTMLFile(filePath) {
    console.log(`\n🔧 Processando: ${path.basename(filePath)}`);

    let content = fs.readFileSync(filePath, 'utf-8');
    const originalSize = content.length;

    // Aplicar todas as remoções
    patternsToRemove.forEach(pattern => {
        content = content.replace(pattern, '');
    });

    // Remover linhas vazias múltiplas dentro do <style>
    content = content.replace(/(<style>[^<]*)\n\s*\n\s*\n+/g, '$1\n\n');

    const newSize = content.length;
    const saved = originalSize - newSize;

    if (saved > 0) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Removido ${saved} caracteres (${Math.round(saved/1024)}KB)`);
        return true;
    } else {
        console.log(`⏭️  Nenhuma alteração necessária`);
        return false;
    }
}

// Buscar todos os arquivos HTML na raiz
const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(rootDir, file));

console.log('===========================================');
console.log('🧹 LIMPEZA DE ESTILOS DUPLICADOS');
console.log('===========================================');
console.log(`📁 Encontrados ${htmlFiles.length} arquivos HTML\n`);

let modifiedCount = 0;
htmlFiles.forEach(file => {
    if (cleanHTMLFile(file)) {
        modifiedCount++;
    }
});

console.log('\n===========================================');
console.log(`✅ CONCLUÍDO!`);
console.log(`📊 ${modifiedCount} de ${htmlFiles.length} arquivos modificados`);
console.log('===========================================');
console.log('\n💡 Agora o header/footer/dropdowns são gerenciados');
console.log('   APENAS pelo styles-components.css!');
console.log('\n🎨 Edite styles-components.css e aplique em TODAS as páginas!\n');

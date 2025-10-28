#!/usr/bin/env python3
"""
PLANAC - Atualiza Links de Imagens
Substitui URLs antigas por URLs do R2 (ou local) em todos os arquivos HTML
"""

import re
import sys
from pathlib import Path
import json

# Configurações
R2_DOMAIN = "https://planac-images.r2.dev"  # ALTERE AQUI após configurar seu domínio
# Ou use: "assets/images/optimized" para URLs locais

OLD_DOMAIN = "https://painel-planac.codiehost.com.br/uploads/"

# Arquivos para atualizar
HTML_FILES = [
    "index.html",
    *list(Path("pages").glob("*.html"))
]

# Mapeamento de extensões antigas para .webp
EXTENSION_MAP = {
    '.jpg': '.webp',
    '.jpeg': '.webp',
    '.png': '.webp',
}

def convert_url(old_url, use_r2=True):
    """Converte URL antiga para nova (R2 ou local)"""
    # Extrai nome do arquivo
    filename = old_url.split('/')[-1]

    # Troca extensão para .webp
    name, ext = filename.rsplit('.', 1)
    new_filename = f"{name}.webp"

    # Monta nova URL
    if use_r2:
        return f"{R2_DOMAIN}/{new_filename}"
    else:
        return f"assets/images/optimized/{new_filename}"

def update_html_file(filepath, use_r2=True):
    """Atualiza URLs de imagens em um arquivo HTML"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        changes = 0

        # Encontra todas as URLs antigas
        pattern = re.compile(rf'{re.escape(OLD_DOMAIN)}[^"\'\s]+')
        matches = pattern.findall(content)

        # Substitui cada URL
        for old_url in matches:
            new_url = convert_url(old_url, use_r2)
            content = content.replace(old_url, new_url)
            changes += 1

        # Salva se houve mudanças
        if changes > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ {filepath}: {changes} imagens atualizadas")
            return changes
        else:
            print(f"⏭️  {filepath}: nenhuma alteração necessária")
            return 0

    except Exception as e:
        print(f"❌ Erro ao processar {filepath}: {e}")
        return 0

def main():
    """Função principal"""
    print("=" * 60)
    print("🔄 PLANAC - Atualização de Links de Imagens")
    print("=" * 60)

    # Pergunta onde as imagens estão
    print("\nOnde estão suas imagens?")
    print("1. Cloudflare R2 (recomendado)")
    print("2. Local (assets/images/optimized/)")

    choice = input("\nEscolha (1 ou 2): ").strip()
    use_r2 = choice == "1"

    if use_r2:
        print(f"\n🌐 Usando R2: {R2_DOMAIN}")
        custom = input("Quer usar outro domínio? (Enter para manter): ").strip()
        if custom:
            global R2_DOMAIN
            R2_DOMAIN = custom.rstrip('/')
    else:
        print("\n📁 Usando imagens locais")

    print(f"\n📝 Arquivos a processar: {len(HTML_FILES)}")
    print("=" * 60 + "\n")

    # Processa todos os arquivos
    total_changes = 0
    for filepath in HTML_FILES:
        if Path(filepath).exists():
            changes = update_html_file(filepath, use_r2)
            total_changes += changes
        else:
            print(f"⚠️  Arquivo não encontrado: {filepath}")

    # Relatório
    print("\n" + "=" * 60)
    print("📊 RELATÓRIO")
    print("=" * 60)
    print(f"✅ Total de imagens atualizadas: {total_changes}")

    if total_changes > 0:
        print("\n🎉 Links atualizados com sucesso!")
        print("\n📌 PRÓXIMOS PASSOS:")
        print("1. Teste o site localmente")
        print("2. Verifique se todas as imagens carregam")
        print("3. Faça deploy!")
    else:
        print("\n⚠️  Nenhuma imagem foi atualizada")
        print("Verifique se as URLs antigas estão corretas")

    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Processo cancelado")
        sys.exit(1)

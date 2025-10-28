#!/usr/bin/env python3
"""
PLANAC - Upload de Imagens para Cloudflare R2
Faz upload de todas as imagens otimizadas para o bucket R2
"""

import os
import sys
import subprocess
from pathlib import Path
import json

# Configurações
OPTIMIZED_DIR = Path("assets/images/optimized")
BUCKET_NAME = "planac-images"  # Altere se necessário
R2_DOMAIN = "https://planac-images.r2.dev"  # Altere após configurar domínio

def check_wrangler():
    """Verifica se wrangler está instalado"""
    try:
        result = subprocess.run(['wrangler', '--version'],
                              capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Wrangler instalado: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass

    print("❌ Wrangler não encontrado!")
    print("\n📦 Instale o Wrangler:")
    print("   npm install -g wrangler")
    print("\nDepois execute:")
    print("   wrangler login")
    return False

def upload_image(image_path, bucket_name):
    """Faz upload de uma imagem para R2"""
    try:
        filename = image_path.name

        # Comando wrangler
        cmd = [
            'wrangler', 'r2', 'object', 'put',
            f'{bucket_name}/{filename}',
            '--file', str(image_path),
            '--content-type', 'image/webp'
        ]

        print(f"📤 Uploading: {filename}...", end=' ')
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            print("✅")
            return True, filename
        else:
            print(f"❌ {result.stderr}")
            return False, filename

    except Exception as e:
        print(f"❌ Erro: {e}")
        return False, filename

def main():
    """Função principal"""
    print("=" * 60)
    print("☁️  PLANAC - Upload para Cloudflare R2")
    print("=" * 60)

    # Verifica wrangler
    if not check_wrangler():
        return 1

    # Verifica imagens otimizadas
    if not OPTIMIZED_DIR.exists():
        print(f"\n❌ Erro: {OPTIMIZED_DIR} não encontrado!")
        print("Execute primeiro: python optimize-images.py")
        return 1

    images = list(OPTIMIZED_DIR.glob("*.webp"))
    if not images:
        print(f"\n⚠️  Nenhuma imagem .webp encontrada em {OPTIMIZED_DIR}")
        return 1

    print(f"\n📊 Total de imagens: {len(images)}")
    print(f"📦 Bucket: {BUCKET_NAME}")
    print(f"🌐 URL pública: {R2_DOMAIN}\n")

    # Confirma
    response = input("Continuar com upload? (s/N): ").lower()
    if response != 's':
        print("⚠️  Upload cancelado")
        return 0

    print("\n" + "=" * 60)
    print("Iniciando uploads...")
    print("=" * 60 + "\n")

    # Upload
    success = []
    failed = []

    for img in images:
        ok, filename = upload_image(img, BUCKET_NAME)
        if ok:
            success.append(filename)
        else:
            failed.append(filename)

    # Relatório
    print("\n" + "=" * 60)
    print("📊 RELATÓRIO DE UPLOAD")
    print("=" * 60)
    print(f"✅ Sucesso: {len(success)}/{len(images)}")
    print(f"❌ Falhas: {len(failed)}/{len(images)}")

    if failed:
        print("\n⚠️  Imagens que falharam:")
        for f in failed:
            print(f"   - {f}")

    if len(success) == len(images):
        print("\n🎉 Todas as imagens foram enviadas!")
        print(f"\n🌐 Suas imagens estão em: {R2_DOMAIN}/")
        print("\n📌 PRÓXIMO PASSO:")
        print("   python update-image-links.py")

    return 0 if not failed else 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Upload cancelado")
        sys.exit(1)

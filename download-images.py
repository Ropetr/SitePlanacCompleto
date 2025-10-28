#!/usr/bin/env python3
"""
PLANAC - Script de Download e Otimização de Imagens
Baixa todas as imagens do servidor antigo e otimiza para Web
"""

import os
import sys
import requests
from pathlib import Path
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed

# Lista de todas as imagens do site
IMAGES = [
    "https://painel-planac.codiehost.com.br/uploads/133465396479346008.png",
    "https://painel-planac.codiehost.com.br/uploads/133465396617971941.png",
    "https://painel-planac.codiehost.com.br/uploads/133465396723233554.png",
    "https://painel-planac.codiehost.com.br/uploads/133465396865785915.png",
    "https://painel-planac.codiehost.com.br/uploads/133465396975722242.png",
    "https://painel-planac.codiehost.com.br/uploads/133471436401074071.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471436694945906.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471436835853780.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471436952970027.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471437270525667.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471437542791005.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471444314697177.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471444645086508.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471445089273453.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471446287088006.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471446579878913.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471446901878862.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471447990424695.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471448340992313.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471448608028870.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471449688817027.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471449945652929.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471450229598044.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471451182062298.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471451461933399.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471451759327027.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471453139408467.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471453402179821.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471453710085896.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471455167197486.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471455445899838.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471455735074663.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471459211169154.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471459468999996.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471459779072990.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471460691698903.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471460941877905.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133471461167663016.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133473966882981354.jpeg",
    "https://painel-planac.codiehost.com.br/uploads/133603401096191514.jpg",
    "https://painel-planac.codiehost.com.br/uploads/133608846438594959.png",
    "https://painel-planac.codiehost.com.br/uploads/133737433241995141.jpg",
]

# Diretório de destino
OUTPUT_DIR = Path("assets/images/original")
OPTIMIZED_DIR = Path("assets/images/optimized")

def download_image(url, output_dir):
    """Baixa uma imagem e salva no diretório especificado"""
    try:
        filename = Path(urlparse(url).path).name
        output_path = output_dir / filename

        # Verifica se já existe
        if output_path.exists():
            print(f"⏭️  Já existe: {filename}")
            return True, filename

        # Download
        print(f"📥 Baixando: {filename}")
        response = requests.get(url, timeout=30, stream=True)
        response.raise_for_status()

        # Salva
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        file_size = output_path.stat().st_size / 1024  # KB
        print(f"✅ Baixado: {filename} ({file_size:.1f} KB)")
        return True, filename

    except Exception as e:
        print(f"❌ Erro ao baixar {url}: {e}")
        return False, None

def main():
    """Função principal"""
    print("=" * 60)
    print("🚀 PLANAC - Download de Imagens")
    print("=" * 60)
    print(f"\n📊 Total de imagens: {len(IMAGES)}")
    print(f"📁 Destino: {OUTPUT_DIR}\n")

    # Cria diretórios
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    OPTIMIZED_DIR.mkdir(parents=True, exist_ok=True)

    # Download paralelo (5 threads)
    success_count = 0
    failed_count = 0

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(download_image, url, OUTPUT_DIR): url for url in IMAGES}

        for future in as_completed(futures):
            success, filename = future.result()
            if success:
                success_count += 1
            else:
                failed_count += 1

    # Relatório final
    print("\n" + "=" * 60)
    print("📊 RELATÓRIO FINAL")
    print("=" * 60)
    print(f"✅ Sucesso: {success_count}/{len(IMAGES)}")
    print(f"❌ Falhas: {failed_count}/{len(IMAGES)}")

    if failed_count == 0:
        print("\n🎉 Todas as imagens foram baixadas com sucesso!")
        print(f"\n📁 Imagens salvas em: {OUTPUT_DIR.absolute()}")
        print("\n📌 PRÓXIMOS PASSOS:")
        print("1. Execute: python optimize-images.py  (para otimizar)")
        print("2. Configure Cloudflare R2 (veja cloudflare-r2-setup.md)")
    else:
        print(f"\n⚠️  {failed_count} imagem(ns) falharam. Execute novamente.")

    return 0 if failed_count == 0 else 1

if __name__ == "__main__":
    sys.exit(main())

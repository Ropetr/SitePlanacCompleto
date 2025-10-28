#!/usr/bin/env python3
"""
PLANAC - Script de Otimização de Imagens para Web
Converte imagens para WebP e redimensiona para melhor performance
"""

import os
import sys
from pathlib import Path
from PIL import Image
import json

# Configurações
INPUT_DIR = Path("assets/images/original")
OUTPUT_DIR = Path("assets/images/optimized")
REPORT_FILE = Path("assets/images/optimization-report.json")

# Tamanhos para diferentes contextos
SIZES = {
    "banner": {"width": 1920, "quality": 85},      # Banners grandes
    "card": {"width": 800, "quality": 80},         # Cards de produtos
    "icon": {"width": 200, "quality": 90},         # Ícones/pequenos
}

def get_image_category(filename):
    """Determina a categoria da imagem baseado no nome/tamanho"""
    # Ícones (PNGs pequenos)
    if filename.endswith('.png'):
        return "icon"
    # Banner principal
    elif filename == "133473966882981354.jpeg":
        return "banner"
    # Cards de produtos
    else:
        return "card"

def optimize_image(input_path, output_dir):
    """Otimiza uma imagem para WebP"""
    try:
        filename = input_path.stem
        category = get_image_category(input_path.name)
        config = SIZES[category]

        # Abre imagem
        with Image.open(input_path) as img:
            # Converte para RGB se necessário
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            original_size = input_path.stat().st_size / 1024  # KB
            width, height = img.size

            # Redimensiona mantendo aspect ratio
            max_width = config["width"]
            if width > max_width:
                ratio = max_width / width
                new_size = (max_width, int(height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)

            # Salva como WebP
            output_path = output_dir / f"{filename}.webp"
            img.save(
                output_path,
                "WEBP",
                quality=config["quality"],
                method=6  # Melhor compressão
            )

            optimized_size = output_path.stat().st_size / 1024  # KB
            reduction = ((original_size - optimized_size) / original_size) * 100

            result = {
                "original": input_path.name,
                "optimized": output_path.name,
                "category": category,
                "original_size_kb": round(original_size, 2),
                "optimized_size_kb": round(optimized_size, 2),
                "reduction_percent": round(reduction, 2),
                "dimensions": f"{img.width}x{img.height}"
            }

            print(f"✅ {input_path.name} → {output_path.name}")
            print(f"   {original_size:.1f}KB → {optimized_size:.1f}KB (-{reduction:.1f}%)")

            return result

    except Exception as e:
        print(f"❌ Erro ao otimizar {input_path.name}: {e}")
        return None

def main():
    """Função principal"""
    print("=" * 60)
    print("🎨 PLANAC - Otimização de Imagens")
    print("=" * 60)

    # Verifica se as imagens foram baixadas
    if not INPUT_DIR.exists():
        print(f"\n❌ Erro: Diretório {INPUT_DIR} não encontrado!")
        print("Execute primeiro: python download-images.py")
        return 1

    # Cria diretório de saída
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Lista imagens
    images = list(INPUT_DIR.glob("*.*"))
    if not images:
        print(f"\n⚠️  Nenhuma imagem encontrada em {INPUT_DIR}")
        return 1

    print(f"\n📊 Total de imagens: {len(images)}\n")

    # Otimiza todas
    results = []
    for img_path in images:
        result = optimize_image(img_path, OUTPUT_DIR)
        if result:
            results.append(result)

    # Calcula estatísticas
    total_original = sum(r["original_size_kb"] for r in results)
    total_optimized = sum(r["optimized_size_kb"] for r in results)
    total_reduction = ((total_original - total_optimized) / total_original) * 100

    # Salva relatório
    report = {
        "total_images": len(results),
        "total_original_kb": round(total_original, 2),
        "total_optimized_kb": round(total_optimized, 2),
        "total_reduction_percent": round(total_reduction, 2),
        "images": results
    }

    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    # Relatório final
    print("\n" + "=" * 60)
    print("📊 RELATÓRIO DE OTIMIZAÇÃO")
    print("=" * 60)
    print(f"✅ Imagens otimizadas: {len(results)}")
    print(f"📦 Tamanho original: {total_original:.1f} KB ({total_original/1024:.2f} MB)")
    print(f"📦 Tamanho otimizado: {total_optimized:.1f} KB ({total_optimized/1024:.2f} MB)")
    print(f"💾 Redução total: {total_reduction:.1f}%")
    print(f"\n📄 Relatório salvo em: {REPORT_FILE}")

    print("\n📌 PRÓXIMOS PASSOS:")
    print("1. Revise as imagens otimizadas em: assets/images/optimized/")
    print("2. Configure Cloudflare R2 (veja cloudflare-r2-setup.md)")
    print("3. Execute: python update-image-links.py  (atualiza HTML)")

    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Processo cancelado pelo usuário")
        sys.exit(1)

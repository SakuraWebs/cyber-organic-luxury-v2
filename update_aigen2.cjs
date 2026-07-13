const fs = require('fs');
let content = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');
content = content.replace('Generación de Texto', "{t('ai.tabs.text')}");
content = content.replace('Generación de Imágenes', "{t('ai.tabs.image')}");
content = content.replace('Generar con IA', "{t('ai.btn.generate')}");
content = content.replace('Generando...', "{t('ai.btn.generating')}");
content = content.replace('placeholder="Ej: Escribe un artículo sobre el diseño bio-digital..."', 'placeholder={t("ai.text.placeholder")}');
content = content.replace('placeholder="Ej: Un bosque bioluminiscente en estilo cyberpunk..."', 'placeholder={t("ai.image.placeholder")}');
fs.writeFileSync('src/pages/AIGenerator.tsx', content);

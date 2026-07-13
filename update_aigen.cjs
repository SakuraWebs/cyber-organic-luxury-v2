const fs = require('fs');

let content = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

content = content.replace('Acceso Exclusivo', "{t('ai.login.title')}");
content = content.replace('El AI Studio es una herramienta exclusiva. Inicia sesión para acceder. Los usuarios registrados tienen un límite de 4 generaciones por día.', "{t('ai.login.desc')}");
content = content.replace('Continuar con Google', "{t('ai.login.btn')}");
content = content.replace('Límite Diario Alcanzado', "{t('ai.paywall.title')}");
content = content.replace('Has agotado tus generaciones gratuitas. Adquiere créditos extra o eleva tu cuenta a un nivel premium para continuar creando.', "{t('ai.paywall.desc')}");
content = content.replace('Mejorar a Premium', "{t('ai.paywall.btn')}");

fs.writeFileSync('src/pages/AIGenerator.tsx', content);

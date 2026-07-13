const fs = require('fs');
let content = fs.readFileSync('src/pages/Services.tsx', 'utf8');

// Insert import
content = content.replace("import { Check } from 'lucide-react';", "import { Check } from 'lucide-react';\nimport Payments from '../components/Payments';");

// Insert component
content = content.replace("{/* Process Section */}", "<Payments />\n\n      {/* Process Section */}");

fs.writeFileSync('src/pages/Services.tsx', content);

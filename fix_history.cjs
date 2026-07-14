const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace('          history: history,\n        }\n      });', '        },\n        history: history,\n      });');
fs.writeFileSync('server.ts', server);

const fs = require('fs');
let content = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

const regex = /            <\/motion\.div>\n          <\/motion\.div>\n        \)}\n      <\/AnimatePresence>/;
content = content.replace(regex, `            </motion.div>\n            </div>\n          </motion.div>\n        )}\n      </AnimatePresence>`);

fs.writeFileSync('src/pages/AIGenerator.tsx', content);

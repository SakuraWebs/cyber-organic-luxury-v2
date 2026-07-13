const fs = require('fs');
let content = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

const oldModal = `      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative max-w-5xl w-full my-8 space-y-12"
            >
              <button 
                onClick={() => setShowPaywall(false)}
                className="absolute -top-12 right-0 md:-right-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <span>Volver al resultado</span>
                <X className="w-5 h-5" />
              </button>`;

const newModal = `      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-lg"
          >
            <div className="min-h-screen flex flex-col items-center justify-center p-4 py-20 sm:p-8">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative max-w-5xl w-full my-auto space-y-12 bg-black/50 p-6 md:p-12 rounded-3xl border border-white/10"
              >
                <div className="absolute top-4 right-4 md:top-6 md:right-6">
                  <button 
                    onClick={() => setShowPaywall(false)}
                    className="p-2 bg-white/5 hover:bg-white/20 rounded-full text-gray-400 hover:text-white transition-colors"
                    title="Cerrar"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>`;

content = content.replace(oldModal, newModal);
fs.writeFileSync('src/pages/AIGenerator.tsx', content);

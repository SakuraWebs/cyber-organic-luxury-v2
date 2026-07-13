const fs = require('fs');
let content = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

const oldModal = `      {/* Paywall Modal */}
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
              >`;

const newModal = `      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-lg"
          >
            <div className="min-h-screen flex items-start justify-center p-4 py-8 sm:p-8">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative max-w-5xl w-full my-auto space-y-8 md:space-y-12 bg-[#050505] p-6 md:p-12 rounded-3xl border border-white/10 shadow-2xl"
              >`;

content = content.replace(oldModal, newModal);
fs.writeFileSync('src/pages/AIGenerator.tsx', content);

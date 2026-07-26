const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = `  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // Duration of the preloader animation

    return () => clearTimeout(timer);
  }, []);`;

const replState = `  const [loading, setLoading] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // Duration of the preloader animation

    return () => clearTimeout(timer);
  }, []);`;

const targetRouter = `              <Router>
                <DynamicMetadata />
                <ScrollToTop />
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/servicios" element={<Services />} />
                    <Route path="/nosotros" element={<About />} />
                    <Route path="/portafolio" element={<Portfolio />} />
                    <Route path="/portafolio/:projectId" element={<ProjectDetail />} />
                    <Route path="/living-data" element={<LivingData />} />
                    <Route path="/ai-studio" element={<AIGenerator />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/privacidad" element={<PrivacyPolicy />} />
                    <Route path="/terminos" element={<TermsOfService />} />
                  </Routes>
                </main>
                <Chatbot />
                <BackToTop />
                <CookieConsent />
                <Footer />
              </Router>`;

const replRouter = `              <Router>
                <DynamicMetadata />
                <ScrollToTop />
                {!isStandalone && <Navbar />}
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={isStandalone ? <AIGenerator /> : <Home />} />
                    <Route path="/servicios" element={<Services />} />
                    <Route path="/nosotros" element={<About />} />
                    <Route path="/portafolio" element={<Portfolio />} />
                    <Route path="/portafolio/:projectId" element={<ProjectDetail />} />
                    <Route path="/living-data" element={<LivingData />} />
                    <Route path="/ai-studio" element={<AIGenerator />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/privacidad" element={<PrivacyPolicy />} />
                    <Route path="/terminos" element={<TermsOfService />} />
                  </Routes>
                </main>
                {!isStandalone && <Chatbot />}
                {!isStandalone && <BackToTop />}
                {!isStandalone && <CookieConsent />}
                {!isStandalone && <Footer />}
              </Router>`;

if (code.includes(targetState) && code.includes(targetRouter)) {
  code = code.replace(targetState, replState);
  code = code.replace(targetRouter, replRouter);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched App.tsx for standalone");
} else {
  console.log("Could not find targets in App.tsx");
}

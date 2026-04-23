import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { projects } from "./src/data/projects.js";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { initializeApp as initClientApp } from 'firebase/app';
import { getFirestore as getClientFirestore, doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { emailSequence } from "./src/data/emailSequence.js";

// Initialize Firebase SDK for Server Environment (bypass admin SDK constraints)
let clientDb: any = null;
try {
  const firebaseConfig = JSON.parse(await fs.readFile(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));
  const clientApp = initClientApp(firebaseConfig);
  clientDb = getClientFirestore(clientApp, firebaseConfig.firestoreDatabaseId);
  console.log("Firebase Client SDK initialized on server successfully.");
} catch (error: any) {
  console.log("Firebase Client SDK setup failed:", error.message);
}

let transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!transporter) {
    const user = process.env.ZOHO_USER_CyberOrganic || process.env.ZOHO_USER || "info@cyberorganicagency.com";
    const pass = process.env.ZOHO_PASS;
    if (!pass) {
      console.warn("ZOHO_PASS is missing. Email sending will fail.");
    }
    transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: user,
        pass: pass,
      },
    });
  }
  return transporter;
}

async function sendSequenceEmail(email: string, name: string, dayIndex: number) {
  const template = emailSequence[dayIndex];
  if (!template) return;

  const senderEmail = process.env.ZOHO_USER_CyberOrganic || process.env.ZOHO_USER || "info@cyberorganicagency.com";
  const mailOptions = {
    from: `"Cyber Organic Agency" <${senderEmail}>`,
    to: email,
    subject: template.subject,
    html: template.body.replace("Hola,", `Hola ${name},`),
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    console.log(`Email sent: Day ${dayIndex + 1} to ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    return false;
  }
}

let stripeClient: Stripe | null = null;
function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is missing");
    // @ts-ignore
    stripeClient = new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  let vite: any;

  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist"), { index: false }));
  }

  // Use JSON middleware for API routes BEFORE shared routes
  app.use(express.json());

  // Subscribe Lead to 9-day Sequence
  app.post("/api/subscribe", async (req, res) => {
    console.log("Subscription request received:", req.body);
    try {
      const { email, name } = req.body;
      if (!email || !name) {
        console.log("Missing fields:", { email, name });
        return res.status(400).json({ error: "Email and name are required." });
      }

      console.log("Accessing Firestore...");
      if (!clientDb) throw new Error("Database not connected");
      
      // Check if already subscribed
      const leadRef = doc(clientDb, "leads", email.toLowerCase());
      console.log("Getting lead doc for:", email.toLowerCase());
      const leadDoc = await getDoc(leadRef);

      if (leadDoc.exists()) {
        console.log("Lead already exists:", email);
        return res.status(200).json({ message: "Ya estás suscrito al desafío." });
      }

      // Save to Firestore
      console.log("Saving new lead to Firestore...");
      await setDoc(leadRef, {
        email: email.toLowerCase(),
        name,
        subscribedAt: serverTimestamp(),
        lastEmailSentIndex: 0, // Day 1
        lastSentAt: serverTimestamp(),
        status: "active",
      });
      console.log("Lead saved successfully.");

      // Send Day 1 Email immediately
      console.log("Sending initial email...");
      await sendSequenceEmail(email, name, 0);
      console.log("Email sent sequence initiated.");

      res.status(200).json({ success: true, message: "¡Suscripción exitosa! Revisa tu correo." });
    } catch (error: any) {
      console.error("CRITICAL SUBSCRIPTION ERROR:", error);
      res.status(500).json({ 
        error: "Error en el servidor. Inténtalo de nuevo."
      });
    }
  });

  // Admin Pulse: Send next emails to active leads (manual trigger for demo)
  app.post("/api/admin/process-emails", async (req, res) => {
    try {
      if (!clientDb) throw new Error("Database not connected");
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const q = query(collection(clientDb, "leads"), 
        where("status", "==", "active"),
        where("lastSentAt", "<=", twentyFourHoursAgo)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return res.json({ message: "No hay correos pendientes por enviar hoy." });
      }

      let count = 0;
      for (const snapshotDoc of snapshot.docs) {
        const lead = snapshotDoc.data();
        const nextIndex = lead.lastEmailSentIndex + 1;

        if (nextIndex < emailSequence.length) {
          const success = await sendSequenceEmail(lead.email, lead.name, nextIndex);
          if (success) {
            await updateDoc(snapshotDoc.ref, {
              lastEmailSentIndex: nextIndex,
              lastSentAt: serverTimestamp(),
            });
            count++;
          }
        } else {
          // Finished the sequence
          await updateDoc(snapshotDoc.ref, { status: "completed" });
        }
      }

      res.json({ success: true, emailsSent: count });
    } catch (error: any) {
      console.error("Pulse Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Use raw body for Stripe Webhook BEFORE express.json
  app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const stripe = getStripe();
    // Use an environment variable for the webhook secret
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET is not set, webhook cannot be verified.");
      return res.status(400).send(`Webhook Error: Secret not configured.`);
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // IMPORTANT: In order to update the database from the backend, 
    // we need firebase-admin setup. In this AI studio environment without a service account,
    // we would typically use application default credentials or explicitly provide a service account JSON.
    // For now we will log the success and note the next steps.

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;
      
      console.log(`✅ Payment received for User ID: ${userId}, Plan: ${plan}`);
      
      if (userId) {
        try {
          const db = getFirestore();
          if (plan === 'Cyber Organic PRO') {
            // Subscription: Give them 1000 limits and "pro" role
            await db.collection('users').doc(userId).update({
              maxDailyUsage: 1000,
              role: 'pro'
            });
            console.log("Updated user to PRO role");
          } else {
            // 5 USD Pack: Give them 50 credits/generations as a permanent addition
            await db.collection('users').doc(userId).update({
              maxDailyUsage: FieldValue.increment(50)
            });
            console.log("Added 50 generations to user");
          }
        } catch (dbError) {
          console.error("Failed to update user in Firestore:", dbError);
        }
      }
    }

    res.json({received: true});
  });

  // Use JSON middleware for API routes AFTER raw endpoints
  app.use(express.json());

  // API Routes
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const stripe = getStripe();
      const { priceId, mode, amount, name, description, userEmail, userId } = req.body;
      const appUrl = process.env.APP_URL || "http://localhost:3000";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: userEmail,
        client_reference_id: userId,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: name,
                description: description,
              },
              unit_amount: amount, // Amount in cents
              ...(mode === "subscription" && { recurring: { interval: "month" } }),
            },
            quantity: 1,
          },
        ],
        mode: mode,
        success_url: `${appUrl}/generador?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/generador?checkout=canceled`,
        metadata: {
          userId: userId,
          plan: name
        }
      });

      res.status(200).json({ sessionId: session.id, url: session.url });
    } catch (e: any) {
      console.error("Stripe Checkout Error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Intercept all routes and inject OG tags
  app.get("*", async (req, res, next) => {
    try {
      let template: string;
      if (process.env.NODE_ENV !== "production") {
        template = await fs.readFile(path.join(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(req.url, template);
      } else {
        template = await fs.readFile(path.join(process.cwd(), "dist/index.html"), "utf-8");
      }

      const hostUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const urlPath = req.url.split('?')[0];

      // Default tags fallback
      let ogTitle = "CYBER ORGANIC AGENCY | Agencia de Marketing Digital y Desarrollo Web";
      let ogDesc = "Agencia creativa global especialista en diseño web de alta gama, servicios de marketing digital, producción de contenido cinematográfico y soluciones con Inteligencia Artificial.";
      let ogImage = `${hostUrl}/og-image.png`;
      let ogType = "website";
      let ogUrl = `${hostUrl}${urlPath}`;
      let isPortfolio = false;

      // Enhance SEO with dynamic matching for common routes
      if (urlPath === '/' || urlPath === '') {
        ogTitle = "CYBER ORGANIC AGENCY | Lujo Digital, Agencia de Marketing y Diseño Web";
        ogDesc = "Potencia tu marca con nuestra agencia líder en servicios de diseño web premium, producción bio-digital y estrategias para creación de contenido en Hispanoamérica y el mundo.";
      } else if (urlPath === '/ai-studio' || urlPath === '/generador') {
        ogTitle = "AI Studio | Creador de Contenido e Imágenes con Inteligencia Artificial | Cyber Organic";
        ogDesc = "Descubre nuestra herramienta premium de Inteligencia Artificial. Crea textos para redes sociales, ideas de marketing, memes e imágenes hiperrealistas en segundos. Innovación en creación de contenido.";
      }

      // If viewing a portfolio item, substitute
      const portafolioMatch = req.url.match(/\/portafolio\/(\d+)/);
      if (portafolioMatch) {
        isPortfolio = true;
        const id = parseInt(portafolioMatch[1]);
        const project = projects.find((p) => p.id === id);
        if (project) {
          ogTitle = project.metaTitle || `${project.title} | CYBER ORGANIC AGENCY`;
          ogDesc = project.metaDesc || project.desc;
          
          // Determine complete image URL if relative
          if (project.image.startsWith("http")) {
            ogImage = project.image;
          } else {
            const imgPath = project.image.startsWith('/') ? project.image : `/${project.image}`;
            ogImage = `${hostUrl}${imgPath}`;
          }
          
          // Match Mime Type for strict parsers like Facebook
          if (ogImage.toLowerCase().includes(".webp")) {
            ogType = "image/webp";
          } else if (ogImage.toLowerCase().includes(".jpg") || ogImage.toLowerCase().includes(".jpeg")) {
            ogType = "image/jpeg";
          } else if (ogImage.toLowerCase().includes(".png")) {
            ogType = "image/png";
          } else {
            ogType = "website"; // fallback
          }
        }
      }

      // Regex replace the tags in HTML
      let htmlWithTags = template
        .replace(/<title>.*<\/title>/, `<title>${ogTitle}</title>`)
        .replace(/<meta name="title" content="[^"]*" \/>/g, `<meta name="title" content="${ogTitle}" />`)
        .replace(/<meta property="og:title" content="[^"]*" \/>/g, `<meta property="og:title" content="${ogTitle}" />`)
        .replace(/<meta property="twitter:title" content="[^"]*" \/>/g, `<meta property="twitter:title" content="${ogTitle}" />`)
        .replace(/<meta name="description" content="[^"]*" \/>/g, `<meta name="description" content="${ogDesc}" />`)
        .replace(/<meta property="og:description" content="[^"]*" \/>/g, `<meta property="og:description" content="${ogDesc}" />`)
        .replace(/<meta property="twitter:description" content="[^"]*" \/>/g, `<meta property="twitter:description" content="${ogDesc}" />`)
        .replace(/<meta property="og:image" content="[^"]*" \/>/g, `<meta property="og:image" content="${ogImage}" />\n    <meta property="og:image:secure_url" content="${ogImage}" />`)
        .replace(/<meta property="twitter:image" content="[^"]*" \/>/g, `<meta property="twitter:image" content="${ogImage}" />`)
        .replace(/<meta property="og:url" content="[^"]*" \/>/g, `<meta property="og:url" content="${ogUrl}" />`)
        .replace(/<meta property="twitter:url" content="[^"]*" \/>/g, `<meta property="twitter:url" content="${ogUrl}" />`)
        .replace(/<meta property="og:image:type" content="[^"]*" \/>/g, `<meta property="og:image:type" content="${ogType}" />`);

      // Removing the deletion of width and height. Facebook strongly prefers them.

      res.status(200).set({ "Content-Type": "text/html" }).end(htmlWithTags);
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        vite.ssrFixStacktrace(e);
      }
      console.error(e);
      next(e);
    }
  });

  app.listen(PORT, () => {
    console.log(`SSR Proxy Server running on http://localhost:${PORT}`);
  });
}

startServer();

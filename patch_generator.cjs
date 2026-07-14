const fs = require('fs');
let aigen = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

aigen = aigen.replace(/import { GoogleGenAI } from '@google\/genai';\n/, '');

const oldTextGenerate = `      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      if (generationMode === 'text') {
        const systemInstruction = \`Eres un experto copywriter de lujo y estratega digital para la agencia Cyber Organic. Tu objetivo es crear contenido premium, sofisticado y altamente persuasivo. Mantén siempre una excelente ortografía y gramática en español.\`;
        
        const userPrompt = \`Genera un "\${contentType}" con un tono "\${tone}". \\n\\nBasado en la siguiente descripción o palabras clave: \\n"\${prompt}"\\n\\nEl contenido debe ser de alta calidad, listo para publicar, y reflejar la estética y valores solicitados. Si es para redes sociales, incluye hashtags relevantes. Si es un copy, asegúrate de que tenga un gancho atractivo y un llamado a la acción (CTA) sutil pero efectivo.\`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: userPrompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });

        if (response.text) {
          setResult(response.text);
        } else {
          throw new Error("No se pudo generar el contenido.");
        }`;

const newTextGenerate = `      if (generationMode === 'text') {
        const systemInstruction = \`Eres un experto copywriter de lujo y estratega digital para la agencia Cyber Organic. Tu objetivo es crear contenido premium, sofisticado y altamente persuasivo. Mantén siempre una excelente ortografía y gramática en español.\`;
        
        const userPrompt = \`Genera un "\${contentType}" con un tono "\${tone}". \\n\\nBasado en la siguiente descripción o palabras clave: \\n"\${prompt}"\\n\\nEl contenido debe ser de alta calidad, listo para publicar, y reflejar la estética y valores solicitados. Si es para redes sociales, incluye hashtags relevantes. Si es un copy, asegúrate de que tenga un gancho atractivo y un llamado a la acción (CTA) sutil pero efectivo.\`;

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userPrompt, systemInstruction })
        });
        
        if (!res.ok) throw new Error("Error de conexión con el servidor.");
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);

        if (data.text) {
          setResult(data.text);
        } else {
          throw new Error("No se pudo generar el contenido.");
        }`;

aigen = aigen.replace(oldTextGenerate, newTextGenerate);

const oldImageGenerate = `      } else {
        const imagePrompt = \`Estilo visual requerido: \${imageStyle}. \${prompt}\`;

        try {
          const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio as any,
            }
          });

          if (response.generatedImages && response.generatedImages.length > 0) {
            const base64EncodeString = response.generatedImages[0].image.imageBytes;
            setImageResult(\`data:image/jpeg;base64,\${base64EncodeString}\`);
          } else {
            throw new Error("No se pudo generar la imagen. Intenta con otra descripción.");
          }
        } catch (imgErr: any) {
          console.error("Error specific to image generation:", imgErr);
          throw new Error(\`Error de Imagen: \${imgErr.message}\`);
        }
      }`;

const newImageGenerate = `      } else {
        const imagePrompt = \`Estilo visual requerido: \${imageStyle}. \${prompt}\`;

        try {
          const res = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: imagePrompt, aspectRatio })
          });
          
          if (!res.ok) throw new Error("Error de conexión con el servidor de imágenes.");
          const data = await res.json();
          
          if (data.error) throw new Error(data.error);

          if (data.imageResult) {
            setImageResult(data.imageResult);
          } else {
            throw new Error("No se pudo generar la imagen. Intenta con otra descripción.");
          }
        } catch (imgErr: any) {
          console.error("Error specific to image generation:", imgErr);
          throw new Error(\`Error de Imagen: \${imgErr.message}\`);
        }
      }`;

aigen = aigen.replace(oldImageGenerate, newImageGenerate);

fs.writeFileSync('src/pages/AIGenerator.tsx', aigen);

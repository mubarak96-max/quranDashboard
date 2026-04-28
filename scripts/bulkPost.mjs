import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually to handle the trailing commas and format
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join('=').trim();
        if (value.endsWith(',')) value = value.slice(0, -1);
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        env[key] = value;
    }
});

const firebaseConfig = {
    apiKey: env.REACT_APP_FIREBASE_API_KEY,
    authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const OPENROUTER_API_KEY = "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";
const MODEL = "openai/gpt-oss-120b";

async function generateContent(surahName) {
    const prompt = `You are writing content for a Quran app for a Ugandan audience.

For each surah I give you, write a continuous explanation of between 500 and 600 words.

Do not include:
- Images
- Arabic text
- Headings with the surah name
- Bullet points
- Repeated phrases or repeated sentence openings
- Overly academic language

Use normal, clear English that is easy for Ugandan readers to understand.

The writing should cover, in a smooth continuous way:
1. The general context of the surah
2. Whether it is mainly Meccan or Medinan
3. The situation of the Prophet and the early Muslim community at that time
4. The main themes of the surah
5. What led to its revelation, if there is a known reliable background
6. If there is no single clear reason for revelation, say this naturally
7. The practical lessons the surah gives for daily life
8. Why the message remains relevant today

Make each surah feel different in presentation. Do not begin every answer the same way. Vary the opening style by sometimes starting with:
- the main theme
- the historical situation
- a human struggle
- a key story
- a moral lesson
- a question or tension the surah answers

Keep the tone respectful, warm, simple, and reflective. Avoid complex words where simple ones work. Make it sound natural, not like a textbook.

Now write the entry for: ${surahName}`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/mubarak96-max/quranDashboard",
                "X-Title": "Quran Dashboard Automation"
            },
            body: JSON.stringify({
                "model": MODEL,
                "messages": [
                    { "role": "user", "content": prompt }
                ]
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`OpenRouter Error: ${response.status} - ${errBody}`);
        }

        const data = await response.json();
        if (!data.choices || data.choices.length === 0) {
            throw new Error(`Invalid response from OpenRouter: ${JSON.stringify(data)}`);
        }
        return data.choices[0].message.content;
    } catch (error) {
        console.error(`Generation failed: ${error.message}`);
        throw error;
    }
}

async function start() {
    console.log("🚀 Initializing Bulk Post Script...");
    console.log(`Using Model: ${MODEL}`);
    
    try {
        console.log("📡 Fetching surahs from Firebase...");
        const surahRef = collection(db, "surah");
        const q = query(surahRef, orderBy("surahIndex", "asc"));
        const querySnapshot = await getDocs(q);
        const surahs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (surahs.length === 0) {
            console.log("❌ No surahs found in the 'surah' collection. Check your Firebase config.");
            process.exit(1);
        }

        console.log(`✅ Found ${surahs.length} surahs. Starting bulk processing...`);

        for (const surah of surahs) {
            console.log(`\n📝 [${surah.surahIndex}/114] Processing: ${surah.surahName}`);
            
            try {
                const content = await generateContent(surah.surahName);
                const wordCount = content.split(/\s+/).length;
                console.log(`✨ Generated ${wordCount} words.`);
                
                console.log(`💾 Updating Firebase field 'surahTheme'...`);
                const docRef = doc(db, "surah", surah.id);
                await updateDoc(docRef, {
                    surahTheme: content
                });
                
                console.log(`✅ Success!`);
            } catch (error) {
                console.error(`❌ Failed processing ${surah.surahName}: ${error.message}`);
                console.log("Waiting 10 seconds before next attempt...");
                await new Promise(resolve => setTimeout(resolve, 10000));
                continue;
            }

            // Respect rate limits and give the API some breathing room
            console.log("⏳ Cooling down for 5 seconds...");
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        console.log("\n🎊 BULK POSTING COMPLETE! All surahs processed.");
    } catch (error) {
        console.error("💥 Fatal Error:", error);
    } finally {
        process.exit(0);
    }
}

start();

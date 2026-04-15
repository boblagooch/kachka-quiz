/**
 * Kachka Quiz — Firestore Seed Script — Vol. 3
 *
 * Steps:
 *   1. Deactivates all existing quizzes in kachka_quizzes
 *   2. Seeds the new Vol. 3 quiz with active: true
 *
 * Run: node seed3.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const quizDoc = {
  title: 'Spirits Knowledge — Vol. 3',
  version: 3,
  active: true,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  questions: [
    {
      text: 'Ketel One is produced in which country?',
      answers: ['Belgium', 'France', 'Sweden', 'Netherlands'],
      correct: 3,
      category: 'vodka',
      topic: 'origin',
      difficulty: 'easy',
      funFact: 'The Nolet family has been distilling in Schiedam, Netherlands since 1691 — making Ketel One one of the few spirits brands still owned and operated by the same family after more than 300 years.'
    },
    {
      text: 'What is Minke vodka distilled from?',
      answers: ['Irish grain', 'Whey — a by-product of Irish dairy production', 'Wheat and potato', 'Malted barley'],
      correct: 1,
      category: 'vodka',
      topic: 'base_ingredient',
      difficulty: 'medium',
      funFact: 'Minke is named after the minke whale — a nod to the wild Atlantic waters off the Irish coast that inspire the Clonakilty Distillery\'s spirit of place.'
    },
    {
      text: 'What is Nikka Coffey vodka distilled from?',
      answers: ['100% Japanese white rice', 'Barley and wheat, distilled separately', 'Corn and malted barley, distilled separately then blended', 'Wheat and buckwheat'],
      correct: 2,
      category: 'vodka',
      topic: 'base_ingredient',
      difficulty: 'medium',
      funFact: 'Nikka\'s founder Masataka Taketsuru learned distillation in Scotland in 1918 and brought both the craft and his Scottish wife Rita back to Japan — he is considered the father of Japanese whisky.'
    },
    {
      text: 'What does Reyka filter through?',
      answers: ['Herkimer diamonds', 'Atlantic Irish oak charcoal', 'Lava rocks collected by hand from the Grábrók lava fields', 'Silver-enriched carbon columns'],
      correct: 2,
      category: 'vodka',
      topic: 'filtration',
      difficulty: 'medium',
      funFact: 'Reyka is one of the world\'s smallest large-scale distilleries, with a full-time staff of around 12 people — powered entirely by Iceland\'s geothermal energy.'
    },
    {
      text: 'What style of sparkling wine is Kobal \'Bajta\' Pét-Nat Rosé?',
      answers: ['Méthode traditionnelle', 'Transfer method', 'Pétillant Naturel', 'Charmat method'],
      correct: 2,
      category: 'wine',
      topic: 'style',
      difficulty: 'easy',
      funFact: 'Pétillant Naturel is the oldest known method of making sparkling wine — it predates Champagne\'s méthode traditionnelle by centuries and requires no secondary fermentation in bottle.'
    },
    {
      text: 'Pheasant\'s Tears Mtsvane Tibaani is fermented in what vessel?',
      answers: ['French oak barrels', 'Stainless steel tanks', 'Qvevri — clay vessels lined with beeswax and buried underground', 'Concrete egg'],
      correct: 2,
      category: 'wine',
      topic: 'fermentation_vessel',
      difficulty: 'medium',
      funFact: 'Georgia is considered the birthplace of wine — archaeological evidence of winemaking dates back over 8,000 years, making it the oldest known wine culture in the world.'
    },
    {
      text: 'Saperavi is a "teinturier" grape. What makes it unusual?',
      answers: ['It produces very light-colored wine despite its dark skin', 'Its flesh AND skin are both red, producing deeply colored juice naturally', 'It contains almost no tannins despite dark pigmentation', 'It can be fermented in under 24 hours'],
      correct: 1,
      category: 'wine',
      topic: 'grape_characteristic',
      difficulty: 'medium',
      funFact: 'Saperavi — Georgian for "dye" or "paint" — is one of fewer than a dozen teinturier grape varieties in the world, all sharing the rare trait of red-pigmented flesh.'
    }
  ]
};

async function seed() {
  try {
    // Step 1: Deactivate all existing quizzes
    console.log('Deactivating existing quizzes...');
    const existing = await db.collection('kachka_quizzes').get();
    if (!existing.empty) {
      const batch = db.batch();
      existing.forEach(doc => batch.update(doc.ref, { active: false }));
      await batch.commit();
      console.log(`✅ Deactivated ${existing.size} existing quiz(zes).`);
    } else {
      console.log('No existing quizzes to deactivate.');
    }

    // Step 2: Seed Vol. 3
    console.log('Seeding Quiz Vol. 3...');
    const ref = await db.collection('kachka_quizzes').add(quizDoc);
    console.log('✅ Quiz Vol. 3 created with ID:', ref.id);
    console.log('🟢 Vol. 3 is now LIVE.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seed();

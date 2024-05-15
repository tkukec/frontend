/* eslint-disable */


// functions/index.js
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const faker = require('faker')

admin.initializeApp()
const db = admin.firestore()



// just used interally for creating random events
exports.generateRandomEvent = functions.https.onRequest(async (req, res) => {
  const event = {
    name: faker.company.companyName(),
    creationDateTime: admin.firestore.Timestamp.now(),
    affectedBrand: faker.company.companyName(),
    description: faker.lorem.paragraphs(2),
    maliciousURL: faker.internet.url(),
    maliciousDomainRegistrationDate: admin.firestore.Timestamp.fromDate(faker.date.past()),
    maliciousDomainDNSRecords: {
      A: [faker.internet.ip()],
      NS: [faker.internet.domainName()],
      MX: [faker.internet.domainName()]
    },
    matchingKeywords: faker.random.words(5).split(' '),
    status: faker.random.arrayElement(['todo', 'in progress', 'done']),
    analystComments: [
      {
        timestamp: admin.firestore.Timestamp.now(),
        comment: faker.lorem.sentence(),
        edited: false
      }
    ]
  }

  try {
    await db.collection('phishing_events').add(event)
    res.status(200).send('Random event generated and saved successfully.')
  } catch (error) {
    console.error('Error generating event:', error)
    res.status(500).send('Error generating event.')
  }
})



exports.searchSimilarUrls = functions.https.onRequest(async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('URL query parameter is required.');
  }

  try {
    const snapshot = await db.collection('phishing_events').get();
    const events = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      events.push({
        id: doc.id,
        ...data
      });
    });

    const matchedEvents = events.filter(event => {
      const url = event.maliciousURL || '';
      const similarityScore = similarity(url, targetUrl);
      return similarityScore > 0.5; // Adjust similarity threshold as needed
    });
    //sort and return first
    matchedEvents.sort((a, b) => {
      return similarity(a.maliciousURL, targetUrl) - similarity(b.maliciousURL, targetUrl);
    });

    res.status(200).json(matchedEvents[0] || null);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events.');
  }
});

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

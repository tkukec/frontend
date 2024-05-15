import { Timestamp } from 'firebase/firestore'

enum Status {
  TODO = 'todo',
  IN_PROGRESS = 'in progress',
  DONE = 'done'
}

type Comment = {
  timestamp: Timestamp;
  comment: string;
  edited: boolean;
};

export class PhishingEvent {
  name: string
  creationDateTime: Timestamp
  affectedBrand: string
  description: string
  maliciousURL: string
  maliciousDomainRegistrationDate: Timestamp
  maliciousDomainDNSRecords: {
    A: string[];
    NS: string[];
    MX: string[];
  }
  matchingKeywords: string[]
  status: Status
  analystComments: Comment[]

  constructor(
    name: string,
    creationDateTime: Timestamp,
    affectedBrand: string,
    description: string,
    maliciousURL: string,
    maliciousDomainRegistrationDate: Timestamp,
    maliciousDomainDNSRecords: { A: string[]; NS: string[]; MX: string[] },
    matchingKeywords: string[],
    status: Status,
    analystComments: Comment[]
  ) {
    this.name = name
    this.creationDateTime = creationDateTime
    this.affectedBrand = affectedBrand
    this.description = description
    this.maliciousURL = maliciousURL
    this.maliciousDomainRegistrationDate = maliciousDomainRegistrationDate
    this.maliciousDomainDNSRecords = maliciousDomainDNSRecords
    this.matchingKeywords = matchingKeywords
    this.status = status
    this.analystComments = analystComments
  }


  sortedComments(){
    return this.analystComments.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds)
  }
}

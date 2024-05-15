import { db } from '../firebase'


import { useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'

export function useEvents() {
  const eventsRef = collection(db, 'phishing_events')
  const events = useCollection(eventsRef)


  return { events }
}

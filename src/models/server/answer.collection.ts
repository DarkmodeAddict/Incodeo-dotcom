import { Permission } from 'node-appwrite'
import { answerCollection, db } from '../name'
import { databases } from './config'

export default async function createAnswerCollection() {
    await databases.createCollection(db, answerCollection, answerCollection, [
        Permission.create('users'),
        Permission.read('any'),
        Permission.read('users'),
        Permission.update('users'),
        Permission.delete('users'),
    ])
    console.log('Answer Collection has been created')

    await Promise.all([
        databases.createStringAttribute(db, answerCollection, 'content', 10000, true),
        databases.createStringAttribute(db, answerCollection, 'questionID', 50, true),
        databases.createStringAttribute(db, answerCollection, 'authorID', 50, true),
    ])
    console.log('Answer Attributes has been created')
}
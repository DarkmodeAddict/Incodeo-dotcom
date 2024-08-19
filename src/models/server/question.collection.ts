import { Permission } from 'node-appwrite'
import { db, questionCollection } from '../name'
import { databases } from './config'

export default async function createQuestionCollection() {
    await databases.createCollection(db, questionCollection, questionCollection, [
        Permission.create('users'),
        Permission.read('any'),
        Permission.read('users'),
        Permission.update('users'),
        Permission.delete('users'),
    ])
    console.log('Question Collection has been created')

    await Promise.all([
        databases.createStringAttribute(db, questionCollection, 'title', 100, true),
        databases.createStringAttribute(db, questionCollection, 'content', 10000, true),
        databases.createStringAttribute(db, questionCollection, 'authorID', 50, true),
        databases.createStringAttribute(db, questionCollection, 'tags', 50, true, undefined, true),
        databases.createStringAttribute(db, questionCollection, 'attachmentID', 50, false),
    ])
    console.log('Question Attributes has been created')
}
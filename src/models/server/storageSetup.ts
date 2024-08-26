import { Permission } from 'node-appwrite'
import { questionAttachmentBucket } from '../name'
import { storage } from './config'

export default async function getOrCreateStorage() {
    try {
        await storage.getBucket(questionAttachmentBucket)
        console.log('Storage has been connected')
    } catch (error) {
        try {
            await storage.createBucket(
                questionAttachmentBucket,
                questionAttachmentBucket,
                [
                    Permission.create('users'),
                    Permission.read('any'),
                    Permission.read('users'),
                    Permission.update('users'),
                    Permission.delete('users'),
                ],
                false,
                undefined,
                undefined,
                ['jpg', 'png', 'gif', 'jpeg', 'webp', 'heic']
            )
            console.log('Storage has been created')
            console.log('Storage has been connected')
        } catch (error) {
            console.log('Error creating storage: ', error)
        }
    }
}
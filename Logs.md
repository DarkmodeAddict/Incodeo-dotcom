

### Version 0.2

- Loaded "Node-Appwrite" into Project.
- Created naming system of databases.
- Created client side endpoints with Appwrite attributes.
- Created server side endpoints (with API Key) with Appwrite attributes.
- Created the Question Attribute configurations.

### Version 0.3

- Created Answers Collection and Attributes at ./src/models/server/answer.collection.ts.
- Created Comments Collection and Attributes at ./src/models/server/comment.collection.ts.
- Created Storage Collection and Attributes at ./src/models/server/storage.collection.ts.
- Created Votes Collection and Attributes at ./src/models/server/votes.collection.ts.
- Configured and created Bucket for collection on Database at ./src/models/server/dbSetup.ts.

### Version 0.4
- Zustand configuration created along with immer.
- Middleware configuration for Appwrite storage and database at ./src/middleware.ts.
- Auth service using Zustand and Immer done at ./src/store/Auth.ts.
- storage.collection.ts changed to storageSetup.ts.
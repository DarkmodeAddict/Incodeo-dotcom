import { answerCollection, db, questionCollection, voteCollection } from "@/models/name"
import { databases, users } from "@/models/server/config"
import { UserPrefs } from "@/store/Auth"
import { NextRequest, NextResponse } from "next/server"
import { ID, Query } from "node-appwrite"

export async function POST(request: NextRequest) {
    try {
        const { votedByID, voteStatus, type, typeID } = await request.json()
        const response = await databases.listDocuments(db, voteCollection, [
            Query.equal("type", type),
            Query.equal("typeID", typeID),
            Query.equal("votedByID", votedByID),
        ])
        if (response.documents.length > 0) {
            await databases.deleteDocument(db, voteCollection, response.documents[0].$id)
            const questionOrAnswer = await databases.getDocument(
                db,
                type === "question" ? questionCollection : answerCollection,
                typeID
            )
            const authorPrefs = await users.getPrefs<UserPrefs>(questionOrAnswer.authorID)
            await users.updatePrefs<UserPrefs>(questionOrAnswer.authorID, {
                reputation: response.documents[0].voteStatus === "upvoted" ? 
                    Number(authorPrefs.reputation) - 1 : Number(authorPrefs.reputation) + 1,
            })
        }
        if (response.documents[0]?.voteStatus !== voteStatus) {
            const doc = await databases.createDocument(db, voteCollection, ID.unique(), {
                type,
                typeID,
                voteStatus,
                votedByID,
            })
            const questionOrAnswer = await databases.getDocument(
                db,
                type === "question" ? questionCollection : answerCollection,
                typeID
            )
            const authorPrefs = await users.getPrefs<UserPrefs>(questionOrAnswer.authorID)
            if (response.documents[0]) {
                await users.updatePrefs<UserPrefs>(questionOrAnswer.authorID, {
                    reputation:
                        response.documents[0].voteStatus === "upvoted"
                            ? Number(authorPrefs.reputation) - 1
                            : Number(authorPrefs.reputation) + 1,
                })
            } else {
                await users.updatePrefs<UserPrefs>(questionOrAnswer.authorID, {
                    reputation:
                        voteStatus === "upvoted"
                            ? Number(authorPrefs.reputation) + 1
                            : Number(authorPrefs.reputation) - 1,
                })
            }
            const [upvotes, downvotes] = await Promise.all([
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeID", typeID),
                    Query.equal("voteStatus", "upvoted"),
                    Query.equal("votedByID", votedByID),
                    Query.limit(1),
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeID", typeID),
                    Query.equal("voteStatus", "downvoted"),
                    Query.equal("votedByID", votedByID),
                    Query.limit(1),
                ]),
            ])
            return NextResponse.json(
                {
                    data: { 
                        document: doc, 
                        voteResult: upvotes.total - downvotes.total 
                    },
                    message: response.documents[0] ? "Vote Status Updated" : "Voted",
                },
                {
                    status: 201,
                }
            )
        }
        const [upvotes, downvotes] = await Promise.all([
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeID", typeID),
                Query.equal("voteStatus", "upvoted"),
                Query.equal("votedByID", votedByID),
                Query.limit(1), 
            ]),
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeID", typeID),
                Query.equal("voteStatus", "downvoted"),
                Query.equal("votedByID", votedByID),
                Query.limit(1), 
            ]),
        ])
        return NextResponse.json(
            {
                data: { 
                    document: null, 
                    voteResult: upvotes.total - downvotes.total 
                },
                message: "Vote Withdrawn",
            },
            {
                status: 200,
            }
        )
    } catch (error: any) {
        return NextResponse.json(
            { 
                message: error?.message || "Error deleting answer" 
            },
            { 
                status: error?.status || error?.code || 500 
            }
        )
    }
}
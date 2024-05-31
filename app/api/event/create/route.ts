import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const uri =
    "mongodb+srv://abcd:1234@eventmanagement.5zehfiu.mongodb.net/?retryWrites=true&w=majority&appName=eventmanagement";

const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to the database");
    } catch (e) {
        console.error(e);
    }
}

export async function POST(request: NextRequest) {
    const body = await new Response(request.body).json();
    console.log(request.nextUrl);
    const { eN, dT, sT, eT, oN, tM } = body;

    connectToDatabase();
    const dbName = "Events";
    const collectionName = "eventList";

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    try {

        const insertOneResult = await collection.insertOne({
            eN: eN,
            dT: dT,
            sT: sT,
            eT: eT,
            oN: oN,
            tM: tM
        });
        const id = insertOneResult.insertedId;
        const nexCollection = database.collection(id.toString());
        const result = nexCollection.insertOne({});
        console.log(`${insertOneResult.insertedId} documents successfully inserted.\n`);
        // client.close();

        return NextResponse.json({ insertOneResult, message: "Bhai Bangaya na " }, { status: 200 });

        // return NextResponse.json({ message: "Bhai Bangaya na " }, { status: 200 });

    } catch (err) {
        console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
        return NextResponse.json({ error: "Error has occurred at line 43 ", err }, { status: 201 });
    }



}
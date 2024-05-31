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

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const eventID = context.params.id;

  const dbName = "Events";
  const collectionName = eventID;
  await connectToDatabase();

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  try {

    const result = await collection.find({}, { projection: { _id: 1 } }).toArray();// explain the fields to be returned in the response object 
    console.log(`${result} documents successfully inserted.\n`);
    client.close();
    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    console.error(
      `Something went wrong trying to insert the new documents: ${err}\n`
    );
    return NextResponse.json(
      { error: "Error has occurred at line 43 ", err },
      { status: 201 }
    );
  }

  return NextResponse.json({ eventID });
}

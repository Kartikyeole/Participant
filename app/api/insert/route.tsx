import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

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

export async function GET(request: NextRequest) {
  await connectToDatabase();
  console.log(request.ip,"\n>>>>>>>>>>>>>>>>>>>>>>>>>>\n");

  const dbName = "Users";
  const collectionName = "participants";

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  

  try {
    const insertManyResult = await collection.find({}).toArray();
    console.log(
      `${insertManyResult} documents successfully inserted.\n`
    );
    client.close();
    return NextResponse.json(
      { insertManyResult },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      `Something went wrong trying to insert the new documents: ${err}\n`
    );
    return NextResponse.json(
      { error: "Error has occurred at line 43 ", err },
      { status: 201 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const body = await new Response(request.body).json();
  const { name, email, mobile, acmMember, roll, year, branch, div } = body;

  const dbName = "Users";
  const collectionName = "participants";

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  try {
    const insertOneResult = await collection.insertOne({
      name,
      email,
      mobile,
      acmMember,
      roll,
      year,
      branch,
      div,
    });
    console.log(
      `${insertOneResult} documents successfully inserted.\n`
    );
    return NextResponse.json(
      {message : "Data inserted successfully"},
      { status: 200  }
    );
    client.close();
  } catch (err) {
    console.error(
      `Something went wrong trying to insert the new documents: ${err}\n`
    );
    return NextResponse.json(
      { error: "Error has occurred at line 43 ", err },
      { status: 201 }
    );
  }
}

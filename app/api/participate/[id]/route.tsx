import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
// import { useState } from "react";

// Constants
const DATABASE_URI =
  "mongodb+srv://abcd:1234@eventmanagement.5zehfiu.mongodb.net/?retryWrites=true&w=majority&appName=eventmanagement";
const DATABASE_NAME_USERS = "Users";
const DATABASE_NAME_EVENTS = "Events";

const client = new MongoClient(DATABASE_URI);
// const [ClientConnected, setClientConnected] = useState(false);

// Connect to the database
async function connectToDatabase() {
  try {
      await client.connect();
    console.log("Connected to the database");
  } catch (e) {
    console.error("Error connecting to the database:", e);
    throw e; // Rethrow the error for proper error handling
  }
}

// Get user details by ACM member ID
async function getUserDetails(acmMember: string) {
  try {
    await connectToDatabase();
    const database = client.db(DATABASE_NAME_USERS);
    const collection = database.collection("participants");
    const user = await collection.findOne({ acmMember });
    return user;
  } catch (err) {
    console.error("Error fetching user details:", err);
    throw err;
  }
}

// Check if user is already registered for the event
async function isUserRegistered(acmMember: string, eventID: string) {
  try {
    await connectToDatabase();
    const database = client.db(DATABASE_NAME_EVENTS);
    const collection = database.collection(eventID);
    const user = await collection.findOne({ acmMember });
    return !!user; // Convert to boolean
  } catch (err) {
    console.error("Error checking user registration:", err);
    throw err;
  }
}

// Register user for the event
async function registerUserForEvent(eventID: string, userData: any) {
  try {
    await connectToDatabase();
    const database = client.db(DATABASE_NAME_EVENTS);
    const collection = database.collection(eventID);
    const insertOneResult = await collection.insertOne(userData);
    return insertOneResult;
  } catch (err) {
    console.error("Error registering user for event:", err);
    throw err;
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const eventID = context.params.id;
    const { acmMember } = await request.json();

    if (await isUserRegistered(acmMember, eventID)) {
      return NextResponse.json(
        { message: "Already Registered" },
        { status: 200 }
      );
    } else {
      const userDetails = await getUserDetails(acmMember);

      if (!userDetails) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const userData = {
        ...userDetails,
        acmMember,
        checkIN: false,
        checkOUT: false,
      };

      const insertOneResult = await registerUserForEvent(eventID, userData);
      console.log(
        `${insertOneResult.insertedId} documents successfully inserted.`
      );

      return NextResponse.json(
        { message: "Registration successful" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

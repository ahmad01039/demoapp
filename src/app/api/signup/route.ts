// import bcrypt from "bcrypt";
// import client from "../../../lib/dbClient";


// export async function POST(req: Request) {
  
//   const { email, password, name } = await req.json();

//   if (!email || !password || !name) {
//     return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
//   }

//   try {
//     const existingUser = await client.query("SELECT * FROM users WHERE email = $1", [email]);

//     if (existingUser.rows.length > 0) {
//       return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const result = await client.query(
//       "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name",
//       [email, hashedPassword, name]
//     );

//     const user = result.rows[0];
//     return new Response(JSON.stringify({ message: "User created successfully", user }), { status: 201 });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
//   }
// }



import bcrypt from "bcrypt";
import client from "../../../lib/dbClient";

// Handle POST request for user registration
export async function POST(req:Request) {
  try {
    // Parse the incoming request JSON body
    const { email, password, name } = await req.json();

    // Validate the required fields
    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // Check if the user already exists in the database
    const existingUser = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await client.query(
      "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name",
      [email, hashedPassword, name]
    );

    // Get the newly created user
    const user = result.rows[0];

    // Create a response with CORS headers
    const response = new Response(JSON.stringify({ message: "User created successfully", user }), { status: 201 });
    
    // Set CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
    response.headers.set("Access-Control-Allow-Methods", "POST"); // Allow POST method
    response.headers.set("Access-Control-Allow-Headers", "Content-Type"); // Allow specific headers

    return response;
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}


export default POST;

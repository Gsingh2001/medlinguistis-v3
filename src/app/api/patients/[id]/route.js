import { readJson } from "@/app/components/lib/jsonDb";
import path from "path";

// Absolute path to users.json
const usersFilePath = path.join(process.cwd(), 'src/components/data/users.json');

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "user_id parameter is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await readJson(usersFilePath, { users: [] });

    // Find user by user_id or admin_id
    const user = data.users.find(
      u => u.user_id === user_id || u.admin_id === id
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(user),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[GET /api/user/[user_id]] Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

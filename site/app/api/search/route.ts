import { fastapi } from "@/config/api";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  const res = await fastapi.get("/api/search/google", {
    params: {
      query: query,
    },
  });

  const data = res.data;

  return Response.json({ data });
}

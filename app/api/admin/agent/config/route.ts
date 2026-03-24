import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AgentConfig from "@/models/AgentConfig";

export async function GET() {
  try {
    await connectDB();
    const config = await AgentConfig.findOne() || await AgentConfig.create({});
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const config = await AgentConfig.findOneAndUpdate(
      {},
      { $set: body },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { supabase } from "../lib/supabase";
import { generateWalletAddress } from "../utils/generateWalletAddress";

// Developer Functions
export async function registerDeveloper(data: any) {
  const { name, email } = data;
  const walletAddress = generateWalletAddress();

  const { data: developer, error } = await supabase
    .from("developers")
    .insert({ name, email, wallet_address: walletAddress })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(developer);
}

export async function registerGame(data: any) {
  const { name, developer_id } = data;

  const { data: game, error } = await supabase
    .from("games")
    .insert({ name, developer_id })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(game);
}

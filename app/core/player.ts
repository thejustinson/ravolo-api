import { NextResponse } from "next/server";
import { supabase } from "../lib/supabase";
import { generateWalletAddress } from "../utils/generateWalletAddress";

// Player Functions
export async function createPlayer(data: any) {
  const { name, email } = data;
  const walletAddress = generateWalletAddress();

  const { data: player, error } = await supabase
    .from("players")
    .insert({ name, email, wallet_address: walletAddress })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(player);
}

export async function getPlayer(data: any) {
  const { player_id } = data;

  const { data: player, error } = await supabase
    .from("players")
    .select("*, assets(*)")
    .eq("id", player_id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(player);
}

export async function addAssetToPlayer(data: any) {
  const { player_id, asset_id } = data;

  const { data: playerAsset, error } = await supabase
    .from("player_assets")
    .insert({ player_id, asset_id })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(playerAsset);
}

export async function useAssetInGame(data: any) {
  const { game_id, player_id, asset_id } = data;
  // Implement game-specific logic here
  // For now, we'll just log the usage
  const { data: usage, error } = await supabase
    .from("asset_usage")
    .insert({ game_id, player_id, asset_id })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({
    message: "Asset used in game successfully",
    usage,
  });
}

export async function calculateCrossGameBonus(data: any) {
  const { player_id } = data;

  // Fetch all game usages for the player
  const { data: usages, error } = await supabase
    .from("asset_usage")
    .select("game_id")
    .eq("player_id", player_id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  // Calculate unique games played
  const uniqueGames = new Set(usages?.map((usage) => usage.game_id)).size;
  const bonus = uniqueGames * 10; // 10 points per unique game played

  return NextResponse.json({ bonus, uniqueGames });
}

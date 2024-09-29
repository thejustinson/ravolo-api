import { NextResponse } from "next/server";
import { supabase } from "../lib/supabase";

// Asset Management Functions
export async function createAsset(data: any) {
  const { name, type, developer_id } = data;

  const { data: asset, error } = await supabase
    .from("assets")
    .insert({ name, type, developer_id })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(asset);
}

export async function evolveAsset(data: any) {
  const { asset_id } = data;

  const { data: asset, error: assetError } = await supabase
    .from("assets")
    .select()
    .eq("id", asset_id)
    .single();

  if (assetError)
    return NextResponse.json({ error: assetError.message }, { status: 404 });

  const { data: evolution, error: evolutionError } = await supabase
    .from("asset_evolutions")
    .insert({ asset_id, level: (asset.current_level || 0) + 1 })
    .select()
    .single();

  if (evolutionError)
    return NextResponse.json(
      { error: evolutionError.message },
      { status: 400 }
    );

  const { data: updatedAsset, error: updateError } = await supabase
    .from("assets")
    .update({ current_level: evolution.level })
    .eq("id", asset_id)
    .select()
    .single();

  if (updateError)
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  return NextResponse.json(updatedAsset);
}

export async function transferAsset(data: any) {
  const { asset_id, from_player_id, to_player_id } = data;

  const { error: deleteError } = await supabase
    .from("player_assets")
    .delete()
    .eq("player_id", from_player_id)
    .eq("asset_id", asset_id);

  if (deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 400 });

  const { data: newOwnership, error: insertError } = await supabase
    .from("player_assets")
    .insert({ player_id: to_player_id, asset_id })
    .select()
    .single();

  if (insertError)
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  return NextResponse.json({
    message: "Asset transferred successfully",
    newOwnership,
  });
}

export async function getEvolutionHistory(data: any) {
  const { asset_id } = data;

  const { data: evolutions, error } = await supabase
    .from("asset_evolutions")
    .select()
    .eq("asset_id", asset_id)
    .order("created_at", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(evolutions);
}

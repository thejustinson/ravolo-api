import { NextResponse } from "next/server";
import { supabase } from "../lib/supabase";

// Collection Functions
export async function createCollection(data: any) {
  const { name, description, developer_id } = data;

  const { data: collection, error } = await supabase
    .from("collections")
    .insert({ name, description, developer_id })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(collection);
}

export async function addAssetToCollection(data: any) {
  const { collection_id, asset_id } = data;

  const { data: collectionAsset, error } = await supabase
    .from("collection_assets")
    .insert({ collection_id, asset_id })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(collectionAsset);
}

export async function removeAssetFromCollection(data: any) {
  const { collection_id, asset_id } = data;

  const { error } = await supabase
    .from("collection_assets")
    .delete()
    .match({ collection_id, asset_id });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({
    message: "Asset removed from collection successfully",
  });
}

export async function getCollectionDetails(data: any) {
  const { collection_id } = data;

  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("*")
    .eq("id", collection_id)
    .single();

  if (collectionError)
    return NextResponse.json(
      { error: collectionError.message },
      { status: 404 }
    );

  const { data: assets, error: assetsError } = await supabase
    .from("collection_assets")
    .select("assets(*)")
    .eq("collection_id", collection_id);

  if (assetsError)
    return NextResponse.json({ error: assetsError.message }, { status: 400 });

  return NextResponse.json({
    ...collection,
    assets: assets.map((a) => a.assets),
  });
}

export async function listCollections(data: any) {
  const { developer_id, player_id } = data;

  let query = supabase.from("collections").select("*");

  if (developer_id) {
    query = query.eq("developer_id", developer_id);
  } else if (player_id) {
    // Assuming we have a player_collections table to track player-owned collections
    const { data: playerCollections, error: pcError } = await supabase
      .from("player_collections")
      .select("collection_id")
      .eq("player_id", player_id);

    if (pcError)
      return NextResponse.json({ error: pcError.message }, { status: 400 });

    const collectionIds =
      playerCollections?.map((pc) => pc.collection_id) || [];
    query = query.in("id", collectionIds);
  }

  const { data: collections, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(collections);
}

import { createAsset, evolveAsset, getEvolutionHistory, transferAsset } from '@/app/core/asset';
import { addAssetToCollection, createCollection, getCollectionDetails, listCollections, removeAssetFromCollection } from '@/app/core/collection';
import { registerDeveloper, registerGame } from '@/app/core/developer';
import { addAssetToPlayer, calculateCrossGameBonus, createPlayer, getPlayer, useAssetInGame } from '@/app/core/player';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, ...data } = body;

  switch (action) {
    case 'registerDeveloper':
      return registerDeveloper(data);
    case 'registerGame':
      return registerGame(data);
    case 'createPlayer':
      return createPlayer(data);
    case 'getPlayer':
      return getPlayer(data);
    case 'addAssetToPlayer':
      return addAssetToPlayer(data);
    case 'useAssetInGame':
      return useAssetInGame(data);
    case 'calculateCrossGameBonus':
      return calculateCrossGameBonus(data);
    case 'createAsset':
      return createAsset(data);
    case 'evolveAsset':
      return evolveAsset(data);
    case 'transferAsset':
      return transferAsset(data);
    case 'getEvolutionHistory':
      return getEvolutionHistory(data);
      case 'createCollection':
      return createCollection(data);
    case 'addAssetToCollection':
      return addAssetToCollection(data);
    case 'removeAssetFromCollection':
      return removeAssetFromCollection(data);
    case 'getCollectionDetails':
      return getCollectionDetails(data);
    case 'listCollections':
      return listCollections(data);
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}





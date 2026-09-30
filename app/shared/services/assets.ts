import ashby from "#app/shared/assets/listings/ashby.jpg";
import bath_1 from "#app/shared/assets/listings/bath-1.jpg";
import bath_2 from "#app/shared/assets/listings/bath-2.jpg";
import beacon_cove from "#app/shared/assets/listings/beacon-cove.jpg";
import bedroom_1 from "#app/shared/assets/listings/bedroom-1.jpg";
import bedroom_2 from "#app/shared/assets/listings/bedroom-2.jpg";
import bedroom_3 from "#app/shared/assets/listings/bedroom-3.jpg";
import bedroom_4 from "#app/shared/assets/listings/bedroom-4.jpg";
import birch from "#app/shared/assets/listings/birch.jpg";
import bluebell from "#app/shared/assets/listings/bluebell.jpg";
import chestnut from "#app/shared/assets/listings/chestnut.jpg";
import cobble_row from "#app/shared/assets/listings/cobble-row.jpg";
import commons from "#app/shared/assets/listings/commons.jpg";
import coral_crest from "#app/shared/assets/listings/coral-crest.jpg";
import fieldstone from "#app/shared/assets/listings/fieldstone.jpg";
import foundry from "#app/shared/assets/listings/foundry.jpg";
import garden_mews from "#app/shared/assets/listings/garden-mews.jpg";
import glass_lake from "#app/shared/assets/listings/glass-lake.jpg";
import glass_lake_2 from "#app/shared/assets/listings/glass-lake-2.jpg";
import hawthorn from "#app/shared/assets/listings/hawthorn.jpg";
import heron_bay from "#app/shared/assets/listings/heron-bay.jpg";
import hollow_pine from "#app/shared/assets/listings/hollow-pine.jpg";
import kiln from "#app/shared/assets/listings/kiln.jpg";
import kitchen_1 from "#app/shared/assets/listings/kitchen-1.jpg";
import kitchen_2 from "#app/shared/assets/listings/kitchen-2.jpg";
import kitchen_3 from "#app/shared/assets/listings/kitchen-3.jpg";
import kitchen_4 from "#app/shared/assets/listings/kitchen-4.jpg";
import lantern_court from "#app/shared/assets/listings/lantern-court.jpg";
import lantern_hill from "#app/shared/assets/listings/lantern-hill.jpg";
import linden from "#app/shared/assets/listings/linden.jpg";
import living_01 from "#app/shared/assets/listings/living-01.jpg";
import living_02 from "#app/shared/assets/listings/living-02.jpg";
import living_03 from "#app/shared/assets/listings/living-03.jpg";
import living_04 from "#app/shared/assets/listings/living-04.jpg";
import living_05 from "#app/shared/assets/listings/living-05.jpg";
import living_06 from "#app/shared/assets/listings/living-06.jpg";
import living_07 from "#app/shared/assets/listings/living-07.jpg";
import living_08 from "#app/shared/assets/listings/living-08.jpg";
import living_09 from "#app/shared/assets/listings/living-09.jpg";
import living_10 from "#app/shared/assets/listings/living-10.jpg";
import living_11 from "#app/shared/assets/listings/living-11.jpg";
import living_12 from "#app/shared/assets/listings/living-12.jpg";
import living_13 from "#app/shared/assets/listings/living-13.jpg";
import meadow_view from "#app/shared/assets/listings/meadow-view.jpg";
import mill_race from "#app/shared/assets/listings/mill-race.jpg";
import orchard from "#app/shared/assets/listings/orchard.jpg";
import palmetto from "#app/shared/assets/listings/palmetto.jpg";
import red_barn from "#app/shared/assets/listings/red-barn.jpg";
import river_walk from "#app/shared/assets/listings/river-walk.jpg";
import rosebay from "#app/shared/assets/listings/rosebay.jpg";
import seagrass from "#app/shared/assets/listings/seagrass.jpg";
import seagrass_2 from "#app/shared/assets/listings/seagrass-2.jpg";
import sunset_ridge from "#app/shared/assets/listings/sunset-ridge.jpg";
import tidewater from "#app/shared/assets/listings/tidewater.jpg";
import timber_trail from "#app/shared/assets/listings/timber-trail.jpg";
import view_1 from "#app/shared/assets/listings/view-1.jpg";
import view_2 from "#app/shared/assets/listings/view-2.jpg";
import view_3 from "#app/shared/assets/listings/view-3.jpg";
import view_4 from "#app/shared/assets/listings/view-4.jpg";
import agent_nora from "#app/shared/assets/agents/nora.svg";
import agent_marcus from "#app/shared/assets/agents/marcus.svg";
import agent_maya from "#app/shared/assets/agents/maya.svg";

const LISTING_ASSETS: Record<string, string> = {
  "ashby": ashby,
  "bath-1": bath_1,
  "bath-2": bath_2,
  "beacon-cove": beacon_cove,
  "bedroom-1": bedroom_1,
  "bedroom-2": bedroom_2,
  "bedroom-3": bedroom_3,
  "bedroom-4": bedroom_4,
  "birch": birch,
  "bluebell": bluebell,
  "chestnut": chestnut,
  "cobble-row": cobble_row,
  "commons": commons,
  "coral-crest": coral_crest,
  "fieldstone": fieldstone,
  "foundry": foundry,
  "garden-mews": garden_mews,
  "glass-lake": glass_lake,
  "glass-lake-2": glass_lake_2,
  "hawthorn": hawthorn,
  "heron-bay": heron_bay,
  "hollow-pine": hollow_pine,
  "kiln": kiln,
  "kitchen-1": kitchen_1,
  "kitchen-2": kitchen_2,
  "kitchen-3": kitchen_3,
  "kitchen-4": kitchen_4,
  "lantern-court": lantern_court,
  "lantern-hill": lantern_hill,
  "linden": linden,
  "living-01": living_01,
  "living-02": living_02,
  "living-03": living_03,
  "living-04": living_04,
  "living-05": living_05,
  "living-06": living_06,
  "living-07": living_07,
  "living-08": living_08,
  "living-09": living_09,
  "living-10": living_10,
  "living-11": living_11,
  "living-12": living_12,
  "living-13": living_13,
  "meadow-view": meadow_view,
  "mill-race": mill_race,
  "orchard": orchard,
  "palmetto": palmetto,
  "red-barn": red_barn,
  "river-walk": river_walk,
  "rosebay": rosebay,
  "seagrass": seagrass,
  "seagrass-2": seagrass_2,
  "sunset-ridge": sunset_ridge,
  "tidewater": tidewater,
  "timber-trail": timber_trail,
  "view-1": view_1,
  "view-2": view_2,
  "view-3": view_3,
  "view-4": view_4,
};

const AGENT_ASSETS: Record<string, string> = {
  nora: agent_nora,
  marcus: agent_marcus,
  maya: agent_maya,
};

export interface PhotoRef {
  id: string;
  asset: string | null;
  hash: string;
}

/**
 * Seed photos ship as static assets and uploads live in the photos table, so a
 * photo's URL depends on which one it is.
 */
export function photoUrl(p: PhotoRef): string {
  if (p.asset) {
    return LISTING_ASSETS[p.asset] ?? "";
  }

  return `/photos/${p.id}/${p.hash}`;
}

export function agentPhotoUrl(key: string | null): string {
  return (key && AGENT_ASSETS[key]) || "";
}

import { pb } from "@/lib/pocketbase";

export async function updateListLocation(listId: string) {
  try {
    console.log('Updating location for list:', listId);
    
    // Get all places in the list
    const listPlaces = await pb.collection('list_places').getFullList({
      filter: `list = "${listId}"`,
      expand: 'place'
    });

    console.log('Found list places:', listPlaces);

    // Calculate center
    const places = listPlaces.map(lp => lp.expand?.place).filter(Boolean);
    
    if (places.length === 0) {
      console.warn(`No places found for list ${listId}`);
      return;
    }

    console.log('Places with coordinates:', places);

    const lats = places.map(p => p.latitude);
    const lngs = places.map(p => p.longitude);
    
    const center_lat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const center_lng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

    console.log('Calculated center:', { center_lat, center_lng });

    // Try to find existing location
    const existingLocation = await pb.collection('list_locations').getFirstListItem(`list = "${listId}"`).catch(() => null);

    if (existingLocation) {
      console.log('Updating existing location:', existingLocation.id);
      // Update existing
      await pb.collection('list_locations').update(existingLocation.id, {
        center_lat,
        center_lng
      });
    } else {
      console.log('Creating new location');
      // Create new
      await pb.collection('list_locations').create({
        list: listId,
        center_lat,
        center_lng
      });
    }

    console.log('Successfully updated list location');
  } catch (error) {
    console.error('Error updating list location:', error);
  }
}

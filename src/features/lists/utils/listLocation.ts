import { pb } from "@/lib/pocketbase";
import { ClientResponseError } from "pocketbase";

export async function updateListLocation(listId: string): Promise<void> {
  try {
    console.log('Updating location for list:', listId);
    
    // Get all places in the list
    console.log('Fetching list places...');
    const listPlaces = await pb.collection('list_places').getFullList({
      filter: `list = "${listId}"`,
      expand: 'place',
      $autoCancel: false
    });

    console.log('Found list places:', listPlaces);
    console.log('Raw list places data:', JSON.stringify(listPlaces, null, 2));

    // Calculate center
    const places = listPlaces.map(lp => {
      console.log('List place expand:', lp.expand);
      return lp.expand?.place;
    }).filter(Boolean);
    
    if (places.length === 0) {
      console.warn(`No places found for list ${listId}`);
      return;
    }

    console.log('Places with coordinates:', places);

    const lats = places.map(p => {
      console.log('Place latitude:', p.latitude);
      return p.latitude;
    });
    const lngs = places.map(p => {
      console.log('Place longitude:', p.longitude);
      return p.longitude;
    });
    
    const center_lat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const center_lng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

    console.log('Calculated center:', { center_lat, center_lng });

    // Try to find existing location
    console.log('Checking for existing location...');
    const existingLocation = await pb.collection('list_locations')
      .getFirstListItem(`list = "${listId}"`, {
        $autoCancel: false
      })
      .catch((err: ClientResponseError) => {
        console.log('No existing location found:', err);
        return null;
      });

    if (existingLocation) {
      console.log('Updating existing location:', existingLocation.id);
      // Update existing
      await pb.collection('list_locations').update(existingLocation.id, {
        center_lat,
        center_lng
      }, {
        $autoCancel: false
      });
      console.log('Successfully updated existing location');
    } else {
      console.log('Creating new location with data:', {
        list: listId,
        center_lat,
        center_lng
      });
      // Create new
      const newLocation = await pb.collection('list_locations').create({
        list: listId,
        center_lat,
        center_lng
      }, {
        $autoCancel: false
      });
      console.log('Successfully created new location:', newLocation);
    }

    console.log('Successfully updated list location');
  } catch (error) {
    console.error('Error updating list location:', error);
    if (error instanceof ClientResponseError) {
      console.error('Error data:', error.data);
      console.error('Error response:', error.response);
    }
    throw error;
  }
}

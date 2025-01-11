import supabaseClient from "@/utils/supabase";

export async function getHotels(token) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("hotels").select("*, saved:saved_hotels(id)");

  // if (location) {
  //   query = query.eq("location", location);
  // }

  // if (company_id) {
  //   query = query.eq("company_id", company_id);
  // }

  // if (searchQuery) {
  //   query = query.ilike("title", `%${searchQuery}%`);
  // }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching hotels:", error);
    return null;
  }

  return data;
}

// - Add / Remove Saved hotel
export async function savehotel(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // If the hotel is already saved, remove it
    const { data, error: deleteError } = await supabase
      .from("saved_hotels")
      .delete()
      .eq("hotel_id", saveData.hotel_id);

    if (deleteError) {
      console.error("Error removing saved hotel:", deleteError);
      return data;
    }

    return data;
  } else {
    // If the hotel is not saved, add it to saved hotels
    const { data, error: insertError } = await supabase
      .from("saved_hotels")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error saving hotel:", insertError);
      return data;
    }

    return data;
  }
}


// Read Saved Jobs
export async function getSavedHotels(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_hotels")
    .select("*, hotel: hotels(*)");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}
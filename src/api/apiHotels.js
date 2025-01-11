import supabaseClient from "@/utils/supabase";

export async function getHotels(token) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("hotels").select("*");

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
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}
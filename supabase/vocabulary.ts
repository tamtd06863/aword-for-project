import { supabase } from "@/lib/supabase";
import { Vocabulary } from "@/models/Vocabulary";

export const fetchRandomVocabulary = async (): Promise<Vocabulary | null> => {
  try {
    // First, get the count of vocabulary items
    const { count, error: countError } = await supabase
      .from("vocabulary")
      .select("*", { count: "exact", head: true });

    if (countError || !count || count === 0) {
      console.error("Error fetching vocabulary count:", countError);
      return null;
    }

    // Generate random offset
    const randomOffset = Math.floor(Math.random() * count);

    // Fetch vocabulary with random offset
    const { data, error } = await supabase
      .from("vocabulary")
      .select("*")
      .range(randomOffset, randomOffset)
      .limit(1);

    if (error) {
      console.error("Error fetching vocabulary:", error);
      return null;
    }

    if (data && data.length > 0) {
      return data[0] as Vocabulary;
    }

    return null;
  } catch (error) {
    console.error("Error fetching vocabulary:", error);
    return null;
  }
};

export const fetchVocabularyById = async (
  id: string
): Promise<Vocabulary | null> => {
  try {
    const { data, error } = await supabase
      .from("vocabulary")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching vocabulary by ID:", error);
      return null;
    }

    return data as Vocabulary;
  } catch (error) {
    console.error("Error fetching vocabulary by ID:", error);
    return null;
  }
};

export const fetchVocabularyByWord = async (
  word: string
): Promise<Vocabulary | null> => {
  try {
    const { data, error } = await supabase
      .from("vocabulary")
      .select("*")
      .eq("word", word)
      .single();

    if (error) {
      console.error("Error fetching vocabulary by word:", error);
      return null;
    }

    return data as Vocabulary;
  } catch (error) {
    console.error("Error fetching vocabulary by word:", error);
    return null;
  }
};

export const fetchVocabularyList = async (
  limit: number = 50
): Promise<Vocabulary[]> => {
  try {
    const { data, error } = await supabase
      .from("vocabulary")
      .select("*")
      .limit(limit);

    if (error) {
      console.error("Error fetching vocabulary list:", error);
      return [];
    }

    return data as Vocabulary[];
  } catch (error) {
    console.error("Error fetching vocabulary list:", error);
    return [];
  }
};

export const searchVocabulary = async (
  searchTerm: string
): Promise<Vocabulary[]> => {
  try {
    const { data, error } = await supabase
      .from("vocabulary")
      .select("*")
      .or(`word.ilike.%${searchTerm}%, definition_vi.ilike.%${searchTerm}%`);

    if (error) {
      console.error("Error searching vocabulary:", error);
      return [];
    }

    return data as Vocabulary[];
  } catch (error) {
    console.error("Error searching vocabulary:", error);
    return [];
  }
};

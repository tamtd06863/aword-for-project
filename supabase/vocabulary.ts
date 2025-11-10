import { supabase } from "@/lib/supabase";
import { Vocabulary } from "@/models/Vocabulary";

export const fetchRandomVocabulary = async (): Promise<Vocabulary | null> => {
  try {
    // First, get the count of vocabulary items
    const { count, error: countError } = await supabase
      .from("vocab")
      .select("*", { count: "exact", head: true });

    if (countError || !count || count === 0) {
      console.error("Error fetching vocabulary count:", countError);
      return null;
    }

    // Generate random offset
    const randomOffset = Math.floor(Math.random() * count);

    // Fetch vocabulary with random offset
    const { data, error } = await supabase
      .from("vocab")
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
  id: string,
): Promise<Vocabulary | null> => {
  try {
    const { data, error } = await supabase
      .from("vocab")
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
  word: string,
): Promise<Vocabulary | null> => {
  try {
    const { data, error } = await supabase
      .from("vocab")
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
  limit: number = 50,
): Promise<Vocabulary[]> => {
  try {
    const { data, error } = await supabase
      .from("vocab")
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
  searchTerm: string,
): Promise<Vocabulary[]> => {
  try {
    const { data, error } = await supabase
      .from("vocab")
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

export const getTotalVocabularyCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("vocab")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching vocabulary count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error fetching vocabulary count:", error);
    return 0;
  }
};

export const fetchVocabularyBatch = async (
  offset: number = 0,
  limit: number = 30,
): Promise<Vocabulary[]> => {
  try {
    //get profile id
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const profileId = user.id;

    // 1️⃣ Lấy dữ liệu từ bảng profile_vocab_progress
    const { data: vocabProgress, error: vocabError } = await supabase
      .from("profile_vocab_progress")
      .select(
        `
        vocab_id,
        proficiency,
        vocab: vocab (
          *,
          vocab_senses(*),
          vocab_examples(*)
        )
        `,
      )
      .eq("profile_id", profileId);

    if (vocabError) {
      console.error("Error fetching vocab progress:", vocabError);
      return [];
    }

    // 2️⃣ Lấy dữ liệu từ bảng profile_sub_vocab_progress
    const { data: subVocabProgress, error: subVocabError } = await supabase
      .from("profile_sub_vocab_progress")
      .select(
        `
        sub_vocab_id,
        proficiency,
        sub_vocab: sub_vocab (
          *,
          sub_vocab_sense(*),
          sub_vocab_example(*)
        )
        `,
      )
      .eq("profile_id", profileId);

    if (subVocabError) {
      console.error("Error fetching sub_vocab progress:", subVocabError);
      return [];
    }

    // 3️⃣ Chuẩn hóa dữ liệu về cùng format chung
    const combined = [
      ...(vocabProgress || []).map((item) => ({
        id: item.vocab_id,
        proficiency: item.proficiency ?? 0,
        source: "vocab",
        data: item.vocab,
      })),
      ...(subVocabProgress || []).map((item) => ({
        id: item.sub_vocab_id,
        proficiency: item.proficiency ?? 0,
        source: "sub_vocab",
        data: item.sub_vocab,
      })),
    ];

    if (combined.length === 0) return [];

    // 4️⃣ Sắp xếp theo proficiency tăng dần và chỉ lấy 30 từ đầu
    const sorted = combined
      .sort((a, b) => a.proficiency - b.proficiency)
      .slice(0, limit);
    console.log("Least proficient words:", sorted);

    // 5️⃣ Map dữ liệu về dạng Vocabulary[]
    return sorted.map((item: any) => {
      const d = item.data;
      return {
        ...d,
        proficiency: item.proficiency,
        source: item.source, // để bạn biết từ bảng nào
        pos: d.vocab_senses?.[0]?.pos || "",
        definition_vi: d.vocab_senses?.[0]?.definition || "",
        example_en: d.vocab_examples?.[0]?.example_en || "",
        example_vi: d.vocab_examples?.[0]?.example_vi || "",
      };
    }) as Vocabulary[];
  } catch (err) {
    console.error("Unexpected error in fetchLeastProficientWords:", err);
    return [];
  }
};

export const fetchRandomVocabularyBatch = async (
  limit: number = 30,
): Promise<Vocabulary[]> => {
  try {
    //get profile id
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const profileId = user.id;

    // 1️⃣ Lấy dữ liệu từ bảng profile_vocab_progress
    const { data: vocabProgress, error: vocabError } = await supabase
      .from("profile_vocab_progress")
      .select(
        `
        vocab_id,
        proficiency,
        vocab: vocab (
          *,
          vocab_senses(*),
          vocab_examples(*)
        )
        `,
      )
      .eq("profile_id", profileId);

    if (vocabError) {
      console.error("Error fetching vocab progress:", vocabError);
      return [];
    }

    // 2️⃣ Lấy dữ liệu từ bảng profile_sub_vocab_progress
    const { data: subVocabProgress, error: subVocabError } = await supabase
      .from("profile_sub_vocab_progress")
      .select(
        `
        sub_vocab_id,
        proficiency,
        sub_vocab: sub_vocab (
          *,
          sub_vocab_sense(*),
          sub_vocab_example(*)
        )
        `,
      )
      .eq("profile_id", profileId);

    if (subVocabError) {
      console.error("Error fetching sub_vocab progress:", subVocabError);
      return [];
    }

    // 3️⃣ Chuẩn hóa dữ liệu về cùng format chung
    const combined = [
      ...(vocabProgress || []).map((item) => ({
        id: item.vocab_id,
        proficiency: item.proficiency ?? 0,
        source: "vocab",
        data: item.vocab,
      })),
      ...(subVocabProgress || []).map((item) => ({
        id: item.sub_vocab_id,
        proficiency: item.proficiency ?? 0,
        source: "sub_vocab",
        data: item.sub_vocab,
      })),
    ];

    if (combined.length === 0) return [];

    // 4️⃣ Sắp xếp theo proficiency tăng dần và chỉ lấy 30 từ đầu
    const sorted = combined
      .sort((a, b) => a.proficiency - b.proficiency)
      .slice(0, limit);
    console.log("Least proficient words:", sorted);

    // 5️⃣ Map dữ liệu về dạng Vocabulary[]
    return sorted.map((item: any) => {
      const d = item.data;
      return {
        ...d,
        proficiency: item.proficiency,
        source: item.source, // để bạn biết từ bảng nào
        pos: d.vocab_senses?.[0]?.pos || "",
        definition_vi: d.vocab_senses?.[0]?.definition || "",
        example_en: d.vocab_examples?.[0]?.example_en || "",
        example_vi: d.vocab_examples?.[0]?.example_vi || "",
      };
    }) as Vocabulary[];
  } catch (err) {
    console.error("Unexpected error in fetchLeastProficientWords:", err);
    return [];
  }
};

export const fetchAllVocabulary = async (): Promise<any> => {
  try {

    const { data: vocabData, error: vocabError } = await supabase.from("vocab")
      .select(`
        *,
        vocab_senses(*),
        vocab_examples(*),
        root: roots(*)
      `);

    if (vocabError) {
      console.error("Error fetching vocab:", vocabError);
      return;
    }

    // 2️⃣ Lấy tất cả sub_vocab (từ dẫn xuất)
    const { data: subVocabData, error: subError } = await supabase.from(
      "sub_vocab",
    ).select(`
        *,
        sub_vocab_sense: sub_vocab_sense(*),
        sub_vocab_example: sub_vocab_example(*),
        sub_root: vocab_sub_roots (
          *,
          vocab: vocab (
            *,
            vocab_senses(*),
            vocab_examples(*),
            root: roots(*)
          )
        )
      `);

    if (subError) {
      console.error("Error fetching sub_vocab:", subError);
      return;
    }

    // 3️⃣ Gộp vocab và sub_vocab lại thành 1 mảng chung
    const combined = [
      ...(vocabData || []).map((v) => ({
        ...v,
        type: "vocab",
        pos: v.vocab_senses?.[0]?.pos || "",
        definition_vi: v.vocab_senses?.[0]?.definition || "",
        example_en: v.vocab_examples?.[0]?.example_en || "",
        example_vi: v.vocab_examples?.[0]?.example_vi || "",
      })),
      ...(subVocabData || []).map((s) => ({
        ...s,
        type: "sub_vocab",
        pos: s.sub_vocab_sense?.[0]?.pos || "",
        definition_vi: s.sub_vocab_sense?.[0]?.definition || "",
        example_en: s.sub_vocab_example?.[0]?.example_en || "",
        example_vi: s.sub_vocab_example?.[0]?.example_vi || "",
      })),
    ];

    // 4️⃣ Group theo prefix
    const grouped: Record<
      string,
      {
        name: string;
        words: any[];
      }
    > = {};
    combined.forEach((item) => {
      const key = item.root_id || item.sub_root_id;
      if (!grouped[key])
        grouped[key] = {
          name:
            item.type === "vocab" ? item.root?.root_code : item.sub_root?.token,
          words: [],
        };
      grouped[key].words.push(item);
    });

    return grouped;
  } catch (error) {
    console.error("Error fetching all vocabulary:", error);
    return [];
  }
};

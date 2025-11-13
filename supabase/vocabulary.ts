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
        pos: d.vocab_senses?.[0]?.pos || d.sub_vocab_sense?.[0]?.pos || "",
        definition_vi:
          d.vocab_senses?.[0]?.definition ||
          d.sub_vocab_sense?.[0]?.definition ||
          "",
        example_en:
          d.vocab_examples?.[0]?.example_en ||
          d.sub_vocab_example?.[0]?.example_en ||
          "",
        example_vi:
          d.vocab_examples?.[0]?.example_vi ||
          d.sub_vocab_example?.[0]?.example_vi ||
          "",
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
        pos: d.vocab_senses?.[0]?.pos || d.sub_vocab_sense?.[0]?.pos || "",
        definition_vi:
          d.vocab_senses?.[0]?.definition ||
          d.sub_vocab_sense?.[0]?.definition ||
          "",
        example_en:
          d.vocab_examples?.[0]?.example_en ||
          d.sub_vocab_example?.[0]?.example_en ||
          "",
        example_vi:
          d.vocab_examples?.[0]?.example_vi ||
          d.sub_vocab_example?.[0]?.example_vi ||
          "",
      };
    }) as Vocabulary[];
  } catch (err) {
    console.error("Unexpected error in fetchLeastProficientWords:", err);
    return [];
  }
};

export const fetchAllVocabulary = async (): Promise<
  Record<string, { name: string; words: any[] }>
> => {
  try {
    //get profile id
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const profileId = user.id;
    // 1️⃣ Lấy vocab mà user đã học
    // first fetch the vocab ids from profile_vocab_progress
    const { data: pvIds, error: pvErr } = await supabase
      .from("profile_vocab_progress")
      .select("vocab_id")
      .eq("profile_id", profileId);

    if (pvErr) {
      console.error("Error fetching profile_vocab_progress ids:", pvErr);
      return {};
    }

    const vocabIds = (pvIds || []).map((r: any) => r.vocab_id).filter(Boolean);

    let vocabData: any[] = [];
    if (vocabIds.length > 0) {
      const { data, error } = await supabase
        .from("vocab")
        .select(
          `
        *,
        vocab_senses(*),
        vocab_examples(*),
        root: roots(*)
      `,
        )
        .in("id", vocabIds);

      if (error) {
        console.error("Error fetching vocab:", error);
        return {};
      }

      vocabData = data || [];
    } else {
      vocabData = [];
    }

    // 2️⃣ Lấy sub_vocab mà user đã học
    // fetch sub_vocab ids first
    const { data: spvIds, error: spvErr } = await supabase
      .from("profile_sub_vocab_progress")
      .select("sub_vocab_id")
      .eq("profile_id", profileId);

    if (spvErr) {
      console.error("Error fetching profile_sub_vocab_progress ids:", spvErr);
      return {};
    }

    const subVocabIds = (spvIds || [])
      .map((r: any) => r.sub_vocab_id)
      .filter(Boolean);

    let subVocabData: any[] = [];
    if (subVocabIds.length > 0) {
      const { data, error } = await supabase
        .from("sub_vocab")
        .select(
          `
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
      `,
        )
        .in("id", subVocabIds);

      if (error) {
        console.error("Error fetching sub_vocab:", error);
        return {};
      }

      subVocabData = data || [];
    } else {
      subVocabData = [];
    }

    // 3️⃣ Gộp chung vocab + sub_vocab
    const combined = [
      ...(vocabData || []).map((v) => ({
        ...v,
        type: "vocab",
        pos: v?.vocab_senses?.[0]?.pos || "",
        definition_vi: v?.vocab_senses?.[0]?.definition || "",
        example_en: v?.vocab_examples?.[0]?.example_en || "",
        example_vi: v?.vocab_examples?.[0]?.example_vi || "",
      })),
      ...(subVocabData || []).map((s) => ({
        ...s,
        type: "sub_vocab",
        pos: s?.sub_vocab_sense?.[0]?.pos || "",
        definition_vi: s?.sub_vocab_sense?.[0]?.definition || "",
        example_en: s?.sub_vocab_example?.[0]?.example_en || "",
        example_vi: s?.sub_vocab_example?.[0]?.example_vi || "",
      })),
    ];

    // 4️⃣ Group theo root/sub_root mà user đang học
    const grouped: Record<string, { name: string; words: any[] }> = {};

    combined.forEach((item) => {
      const key = item.root_id ?? item.sub_root_id ?? item.id;

      const name =
        item.type === "vocab"
          ? (item.root?.root_code ?? String(key))
          : (item.sub_root?.token ?? String(key));

      if (!grouped[key]) grouped[key] = { name, words: [] };
      grouped[key].words.push(item);
    });

    return grouped;
  } catch (error) {
    console.error("Error fetching vocabulary:", error);
    return {};
  }
};

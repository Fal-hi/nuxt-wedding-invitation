import type { Guest, GuestType } from "~/types";

const titleMap: Record<GuestType, string> = {
  male: "Bapak",
  female: "Ibu",
  family: "Keluarga Besar",
};

export const useGuest = () => {
  const guest = useState<Guest | null>("guest", () => null);
  const guestName = useState<string>("guestName", () => "Tamu Undangan");
  const guestSlug = useState<string>("guestSlug", () => "");
  const guestType = useState<GuestType>("guestType", () => "male");

  const guestTitle = computed(() => {
    if (!guest.value) return "";
    return titleMap[guestType.value] || "Bapak";
  });

  const formatSlugToName = (slug: string): string => {
    if (!slug) return "Tamu Undangan";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const loadGuest = async (slug: string): Promise<void> => {
    guestSlug.value = slug;
    guestName.value = formatSlugToName(slug);
    if (!slug) return;

    const supabase = useSupabase();
    try {
      const { data, error } = await supabase
        .from("guest_list")
        .select("id, name, slug, guest_type, phone, attendance_status, created_at")
        .eq("slug", slug)
        .maybeSingle();

      if (data && !error) {
        guest.value = data as Guest;
        guestName.value = data.name;
        guestType.value = (data.guest_type as GuestType) || "male";
      }
    } catch (err) {
      console.error("Error loading guest:", err);
    }
  };

  return {
    guest,
    guestName,
    guestTitle,
    guestType,
    guestSlug,
    loadGuest,
  };
};

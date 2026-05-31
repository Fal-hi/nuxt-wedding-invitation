<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Plus, X, Pencil, Trash2, UserPlus, Send, CheckCircle, Clock } from "lucide-vue-next";
import type { Guest, GuestType } from "~/types";
import {
  getGuestTitle,
  formatPhoneNumber,
  generateWhatsappMessage,
} from "~/utils/invitation";

const supabase = useSupabase();
const origin = ref("");

const guests = ref<Guest[]>([]);
const isLoading = ref(true);
const brideNickname = ref("");
const groomNickname = ref("");

const showForm = ref(false);
const isSaving = ref(false);
const editingId = ref<string | null>(null);
const formName = ref("");
const formSlug = ref("");
const formGuestType = ref<GuestType>("male");
const formPhone = ref("");

const fetchGuests = async () => {
  isLoading.value = true;
  const { data, error } = await supabase
    .from("guest_list")
    .select("*")
    .order("created_at", { ascending: false });
  if (data) {
    guests.value = data as Guest[];
  }
  isLoading.value = false;
};

const fetchWeddingInfo = async () => {
  const { data } = await supabase
    .from("wedding_info")
    .select("bride_nickname, groom_nickname")
    .maybeSingle();
  if (data) {
    brideNickname.value = data.bride_nickname;
    groomNickname.value = data.groom_nickname;
  }
};

onMounted(() => {
  origin.value = window.location.origin;
  fetchGuests();
  fetchWeddingInfo();
});

const autoSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const watchNameForSlug = () => {
  if (!editingId.value && !formSlug.value) {
    formSlug.value = autoSlug(formName.value);
  }
};

const openAdd = () => {
  editingId.value = null;
  formName.value = "";
  formSlug.value = "";
  formGuestType.value = "male";
  formPhone.value = "";
  showForm.value = true;
};

const openEdit = (guest: Guest) => {
  editingId.value = guest.id;
  formName.value = guest.name;
  formSlug.value = guest.slug;
  formGuestType.value = guest.guest_type;
  formPhone.value = guest.phone || "";
  showForm.value = true;
};

const cancelForm = () => {
  showForm.value = false;
  editingId.value = null;
};

const saveGuest = async () => {
  if (!formName.value || !formSlug.value) return;
  isSaving.value = true;

  const payload = {
    name: formName.value,
    slug: formSlug.value,
    guest_type: formGuestType.value,
    phone: formPhone.value || null,
  };

  if (editingId.value) {
    const { error } = await supabase
      .from("guest_list")
      .update(payload)
      .eq("id", editingId.value);

    if (error) {
      alert("Gagal menyimpan: " + error.message);
      isSaving.value = false;
      return;
    }
  } else {
    const { error } = await supabase.from("guest_list").insert(payload);

    if (error) {
      alert("Gagal menambah: " + error.message);
      isSaving.value = false;
      return;
    }
  }

  isSaving.value = false;
  showForm.value = false;
  editingId.value = null;
  await fetchGuests();
};

const deleteGuest = async (guest: Guest) => {
  if (
    !confirm(
      `Hapus "${guest.name}" dari daftar tamu? Tindakan ini tidak bisa dibatalkan.`,
    )
  ) {
    return;
  }

  const { error } = await supabase
    .from("guest_list")
    .delete()
    .eq("id", guest.id);

  if (error) {
    alert("Gagal menghapus: " + error.message);
    return;
  }

  await fetchGuests();
};

const copyLink = (slug: string) => {
  const url = `${window.location.origin}/${slug}`;
  navigator.clipboard.writeText(url);
};

const guestTypeLabel: Record<GuestType, string> = {
  male: "Male",
  female: "Female",
  family: "Family",
};

const sendingId = ref<string | null>(null);

const sendWhatsApp = async (guest: Guest) => {
  if (!guest.phone) {
    alert("Nomor telepon tidak tersedia untuk tamu ini.");
    return;
  }

  const phone = formatPhoneNumber(guest.phone);

  const message = generateWhatsappMessage({
    guestName: guest.name,
    guestType: guest.guest_type,
    invitationUrl: `${origin.value}/${guest.slug}`,
    brideNickname: brideNickname.value,
    groomNickname: groomNickname.value,
  });

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  sendingId.value = guest.id;
  window.open(whatsappUrl, "_blank");

  const { error } = await supabase
    .from("guest_list")
    .update({
      invitation_sent: true,
      sent_at: new Date().toISOString(),
    })
    .eq("id", guest.id);

  if (!error) {
    await fetchGuests();
  }
  sendingId.value = null;
};

const guestTypeBadge: Record<GuestType, string> = {
  male: "bg-blue-100 text-blue-800 border-blue-200",
  female: "bg-pink-100 text-pink-800 border-pink-200",
  family: "bg-amber-100 text-amber-800 border-amber-200",
};
</script>

<template>
  <div class="card border border-sky-100 bg-white/95 p-6 md:p-8">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
      ></div>
    </div>

    <div v-else class="space-y-10">
      <!-- Header -->
      <div class="relative">
        <div
          class="absolute -left-4 md:-left-8 top-0 bottom-0 w-1 rounded-r-md bg-gradient-to-b from-primary-light to-transparent"
        ></div>
        <div class="flex items-center justify-between">
          <div>
            <h3
              class="font-heading text-xl font-semibold text-primary-dark md:text-2xl"
            >
              Daftar Tamu Undangan
            </h3>
            <p class="mt-1 text-sm text-primary">
              Kelola daftar tamu undangan personal.
            </p>
          </div>
          <button @click="openAdd" class="btn-primary flex items-center gap-2">
            <Plus class="h-4 w-4" />
            Tambah Tamu
          </button>
        </div>
      </div>

      <!-- Form Add/Edit -->
      <Transition name="form-slide">
        <div
          v-if="showForm"
          class="rounded-2xl border border-sky-100 bg-sky-50/50 p-6"
        >
          <div class="mb-4 flex items-center justify-between">
            <h3
              class="font-heading text-lg font-semibold text-primary-dark"
            >
              <template v-if="editingId">Edit Tamu</template>
              <template v-else>Tambah Tamu Baru</template>
            </h3>
            <button
              @click="cancelForm"
              class="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <form @submit.prevent="saveGuest" class="space-y-5">
            <div class="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Nama Tamu <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formName"
                  type="text"
                  class="input-field bg-white"
                  placeholder="Budi Santoso"
                  required
                  @input="watchNameForSlug"
                />
              </div>
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Slug URL <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formSlug"
                  type="text"
                  class="input-field bg-white font-mono text-sm"
                  placeholder="budi-santoso"
                  required
                />
                <p class="mt-1 text-xs text-gray-500">
                  Akan menjadi: {{ origin }}/{{ formSlug || "..." }}
                </p>
              </div>
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Tipe Tamu <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formGuestType"
                  class="input-field bg-white"
                  required
                >
                  <option value="male">Male (Bapak)</option>
                  <option value="female">Female (Ibu)</option>
                  <option value="family">Family (Keluarga Besar)</option>
                </select>
              </div>
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Nomor Telepon
                </label>
                <input
                  v-model="formPhone"
                  type="tel"
                  class="input-field bg-white"
                  placeholder="0812xxxx"
                />
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="cancelForm"
                class="rounded-full border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="btn-primary flex items-center gap-2 px-6 py-2.5"
              >
                <UserPlus v-if="!isSaving" class="h-4 w-4" />
                <span
                  v-if="isSaving"
                  class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                ></span>
                {{ isSaving ? "Menyimpan..." : editingId ? "Simpan" : "Tambah" }}
              </button>
            </div>
          </form>
        </div>
      </Transition>

      <div class="divider"></div>

      <!-- Table -->
      <div>
        <div
          class="mb-4 flex items-center justify-between"
        >
          <h3 class="font-heading text-lg font-semibold text-primary-dark">
            Total Tamu ({{ guests.length }})
          </h3>
        </div>

        <div
          v-if="guests.length === 0"
          class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/30 py-12 text-center text-primary"
        >
          <UserPlus class="mb-4 h-12 w-12 text-sky-300" />
          <p>Belum ada tamu undangan.</p>
          <p class="mt-1 text-xs">
            Klik "Tambah Tamu" untuk menambahkan daftar tamu.
          </p>
        </div>

        <div
          v-else
          class="overflow-x-auto"
        >
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-white">
              <tr>
                <th
                  scope="col"
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Nama
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Slug
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Tipe
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Telepon
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr
                v-for="guest in guests"
                :key="guest.id"
                class="transition-colors hover:bg-sky-50/30"
              >
                <td class="whitespace-nowrap px-4 py-3">
                  <div class="text-sm font-semibold text-primary-dark">
                    {{ guest.name }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  <button
                    @click="copyLink(guest.slug)"
                    class="group flex items-center gap-1 text-sm font-mono text-primary transition-colors hover:text-primary-dark"
                    :title="`Salin tautan undangan`"
                  >
                    <span class="truncate max-w-[140px]">{{ guest.slug }}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  <span
                    :class="guestTypeBadge[guest.guest_type]"
                    class="inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {{ guestTypeLabel[guest.guest_type] }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                  {{ guest.phone || "—" }}
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  <span
                    v-if="guest.invitation_sent"
                    class="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700"
                  >
                    <CheckCircle class="h-3 w-3" />
                    Sudah Dikirim
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-500"
                  >
                    <Clock class="h-3 w-3" />
                    Belum Dikirim
                  </span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="copyLink(guest.slug)"
                      class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-sky-50 hover:text-primary"
                      title="Salin tautan"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                    <button
                      @click="openEdit(guest)"
                      class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-sky-50 hover:text-primary"
                      title="Edit tamu"
                    >
                      <Pencil class="h-4 w-4" />
                    </button>
                    <button
                      @click="sendWhatsApp(guest)"
                      :disabled="sendingId === guest.id"
                      class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600 disabled:opacity-40"
                      :title="
                        guest.phone
                          ? 'Kirim undangan via WhatsApp'
                          : 'Nomor telepon tidak tersedia'
                      "
                    >
                      <Send v-if="sendingId !== guest.id" class="h-4 w-4" />
                      <span
                        v-else
                        class="block h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent"
                      ></span>
                    </button>
                    <button
                      @click="deleteGuest(guest)"
                      class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      title="Hapus tamu"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-slide-enter-active {
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out;
}
.form-slide-leave-active {
  transition:
    opacity 0.2s ease-in,
    transform 0.2s ease-in;
}
.form-slide-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.form-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>

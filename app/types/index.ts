export interface WeddingInfo {
  id: number;
  bride_name: string;
  bride_nickname: string;
  bride_mother: string;
  bride_father: string;
  bride_photo: string;
  groom_name: string;
  groom_nickname: string;
  groom_mother: string;
  groom_father: string;
  groom_photo: string;
  wedding_date: string;
  akad_time: string;
  akad_location: string;
  akad_address: string;
  akad_maps_url: string;
  resepsi_time: string;
  resepsi_location: string;
  resepsi_address: string;
  resepsi_maps_url: string;
}

export interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  mapsUrl: string;
}

export interface CoupleMember {
  name: string;
  photo?: string;
  groom_mother?: string;
  groom_father?: string;
  bride_mother?: string;
  bride_father?: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
}

export interface Image {
  src: string;
  alt: string;
}

export interface Wish {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  bank_logo?: string;
  sort_order: number;
}

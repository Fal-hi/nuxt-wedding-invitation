import type { GuestType } from "~/types";

const titleMap: Record<GuestType, string> = {
  male: "Bapak",
  female: "Ibu",
  family: "Keluarga Besar",
};

export const getGuestTitle = (guestType: GuestType): string => {
  return titleMap[guestType] || "Bapak";
};

export const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(1);
  }

  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }

  if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }

  return cleaned;
};

export const generateInvitationLink = (slug: string, origin: string): string => {
  const base = origin.replace(/\/+$/, "");
  return `${base}/${slug}`;
};

interface GenerateMessageOptions {
  guestName: string;
  guestType: GuestType;
  invitationUrl: string;
  brideNickname: string;
  groomNickname: string;
}

const messageBody = (title: string, name: string, titleLower: string): string[] => [
  `Yth. ${title} ${name}`,
  ``,
  `Tanpa mengurangi rasa hormat, perkenankan kami mengundang ${titleLower} untuk menghadiri acara pernikahan kami :`,
];

const coupleLine = (bride: string, groom: string): string[] => [
  `${bride} & ${groom}`,
];

const linkSection = (url: string): string[] => [
  ``,
  `Berikut link undangan kami, untuk info lengkap dari acara dapat mengunjungi :`,
  ``,
  url,
];

const closingSection = (title: string, titleLower: string, name: string): string[] => [
  ``,
  `Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila ${titleLower} berkenan untuk hadir dan memberikan doa restu.`,
  ``,
  `Mohon maaf perihal undangan hanya dibagikan melalui pesan ini.`,
  ``,
  `Note :`,
  `Jika link tidak bisa dibuka, silakan copy link kemudian paste di Chrome atau browser lainnya.`,
  `Untuk tampilan terbaik, silakan akses melalui Browser Chrome.`,
  ``,
  `Terima kasih banyak atas perhatiannya.`,
];

export const generateWhatsappMessage = ({
  guestName,
  guestType,
  invitationUrl,
  brideNickname,
  groomNickname,
}: GenerateMessageOptions): string => {
  const title = getGuestTitle(guestType);
  const titleLower = title.toLowerCase();
  const name = guestName;

  let intro: string[];
  let couple: string[];
  let link: string[];
  let closing: string[];

  if (guestType === "family") {
    intro = [
      `Yth. ${title} ${name}`,
      ``,
      `Tanpa mengurangi rasa hormat, perkenankan kami mengundang ${title} ${name} untuk menghadiri acara pernikahan kami :`,
    ];
    couple = coupleLine(brideNickname, groomNickname);
    link = linkSection(invitationUrl);
    closing = [
      ``,
      `Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila ${title} ${name} berkenan untuk hadir dan memberikan doa restu.`,
      ``,
      `Mohon maaf perihal undangan hanya dibagikan melalui pesan ini.`,
      ``,
      `Note :`,
      `Jika link tidak bisa dibuka, silakan copy link kemudian paste di Chrome atau browser lainnya.`,
      `Untuk tampilan terbaik, silakan akses melalui Browser Chrome.`,
      ``,
      `Terima kasih banyak atas perhatiannya.`,
    ];
  } else {
    intro = messageBody(title, name, titleLower);
    couple = coupleLine(brideNickname, groomNickname);
    link = linkSection(invitationUrl);
    closing = closingSection(title, titleLower, name);
  }

  return [...intro, ...couple, ...link, ...closing].join("\n");
};

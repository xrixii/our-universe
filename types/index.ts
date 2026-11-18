export interface Memory {
  id: string;
  title: string;
  date: string;
  image: string;
  message: string;
  x: number;
  y: number;
  size: number;
  brightness: number;
  isFuture?: boolean;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  caption: string;
  date?: string;
  orientation?: 'portrait' | 'landscape' | 'square';
}

export interface AppConfig {
  herName: string;
  herNickname: string;
  senderName: string;
  birthdayDate: string;
  firstMeetingDate: string;
  relationshipStartDate: string;
  relationshipDuration: string;
  musicFilename: string;
  introLines: string[];
  secretMessage: string;
  finalMessage: {
    line1: string;
    line2: string;
    line3: string;
    line4: string;
  };
}

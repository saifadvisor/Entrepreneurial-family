
export enum FormatType {
  VIDEO = 'video',
  AUDIO = 'audio'
}

export interface VideoFormat {
  quality: string;
  type: FormatType;
  size: string;
  extension: string;
  url: string;
}

export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: string;
  platform: string;
  formats: VideoFormat[];
}

export interface RecentDownload {
  id: string;
  title: string;
  thumbnail: string;
  quality: string;
  timestamp: number;
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
  result: VideoMetadata | null;
  sources: GroundingSource[];
}

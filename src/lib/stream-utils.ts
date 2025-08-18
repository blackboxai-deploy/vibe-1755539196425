export interface StreamConfig {
  video: {
    width: number;
    height: number;
    frameRate: number;
    facingMode?: 'user' | 'environment';
  };
  audio: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
  };
}

export interface StreamQuality {
  label: string;
  width: number;
  height: number;
  bitrate: number;
}

export const STREAM_QUALITIES: StreamQuality[] = [
  { label: '480p', width: 854, height: 480, bitrate: 1000 },
  { label: '720p', width: 1280, height: 720, bitrate: 2500 },
  { label: '1080p', width: 1920, height: 1080, bitrate: 4000 },
];

export const DEFAULT_STREAM_CONFIG: StreamConfig = {
  video: {
    width: 1280,
    height: 720,
    frameRate: 30,
    facingMode: 'user',
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
};

export class StreamManager {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording = false;

  async initializeStream(config: StreamConfig = DEFAULT_STREAM_CONFIG): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: config.video.width },
          height: { ideal: config.video.height },
          frameRate: { ideal: config.video.frameRate },
          facingMode: config.video.facingMode,
        },
        audio: {
          echoCancellation: config.audio.echoCancellation,
          noiseSuppression: config.audio.noiseSuppression,
          autoGainControl: config.audio.autoGainControl,
        },
      };

      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.mediaStream;
    } catch (error) {
      throw new Error(`Failed to initialize stream: ${error}`);
    }
  }

  async switchCamera(): Promise<MediaStream> {
    if (!this.mediaStream) {
      throw new Error('No active stream to switch camera');
    }

    const videoTrack = this.mediaStream.getVideoTracks()[0];
    const currentFacingMode = videoTrack.getSettings().facingMode;
    const newFacingMode: 'user' | 'environment' = currentFacingMode === 'user' ? 'environment' : 'user';

    this.stopStream();

    const newConfig: StreamConfig = {
      ...DEFAULT_STREAM_CONFIG,
      video: {
        ...DEFAULT_STREAM_CONFIG.video,
        facingMode: newFacingMode,
      },
    };

    return this.initializeStream(newConfig);
  }

  async changeQuality(quality: StreamQuality): Promise<MediaStream> {
    if (!this.mediaStream) {
      throw new Error('No active stream to change quality');
    }

    this.stopStream();

    const newConfig = {
      ...DEFAULT_STREAM_CONFIG,
      video: {
        ...DEFAULT_STREAM_CONFIG.video,
        width: quality.width,
        height: quality.height,
      },
    };

    return this.initializeStream(newConfig);
  }

  startRecording(): void {
    if (!this.mediaStream) {
      throw new Error('No media stream available for recording');
    }

    if (this.isRecording) {
      throw new Error('Recording is already in progress');
    }

    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(this.mediaStream, {
      mimeType: 'video/webm;codecs=vp9',
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(1000); // Collect data every second
    this.isRecording = true;
  }

  stopRecording(): Blob | null {
    if (!this.mediaRecorder || !this.isRecording) {
      return null;
    }

    this.mediaRecorder.stop();
    this.isRecording = false;

    const recordedBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
    this.recordedChunks = [];

    return recordedBlob;
  }

  toggleAudio(enabled: boolean): void {
    if (!this.mediaStream) return;

    this.mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }

  toggleVideo(enabled: boolean): void {
    if (!this.mediaStream) return;

    this.mediaStream.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }

  stopStream(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.mediaStream = null;
    }

    if (this.isRecording) {
      this.stopRecording();
    }
  }

  getStreamStats(): {
    isActive: boolean;
    hasVideo: boolean;
    hasAudio: boolean;
    videoSettings: MediaTrackSettings | null;
    audioSettings: MediaTrackSettings | null;
  } {
    if (!this.mediaStream) {
      return {
        isActive: false,
        hasVideo: false,
        hasAudio: false,
        videoSettings: null,
        audioSettings: null,
      };
    }

    const videoTracks = this.mediaStream.getVideoTracks();
    const audioTracks = this.mediaStream.getAudioTracks();

    return {
      isActive: this.mediaStream.active,
      hasVideo: videoTracks.length > 0 && videoTracks[0].enabled,
      hasAudio: audioTracks.length > 0 && audioTracks[0].enabled,
      videoSettings: videoTracks.length > 0 ? videoTracks[0].getSettings() : null,
      audioSettings: audioTracks.length > 0 ? audioTracks[0].getSettings() : null,
    };
  }

  getCurrentStream(): MediaStream | null {
    return this.mediaStream;
  }

  isStreamActive(): boolean {
    return this.mediaStream !== null && this.mediaStream.active;
  }

  getRecordingStatus(): boolean {
    return this.isRecording;
  }
}

export function generateStreamId(): string {
  return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatStreamDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function validateStreamTitle(title: string): boolean {
  return title.length >= 3 && title.length <= 100;
}

export function validateStreamDescription(description: string): boolean {
  return description.length <= 500;
}

export function getStreamUrl(streamId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/watch/${streamId}`;
  }
  return `/watch/${streamId}`;
}

export function downloadRecording(blob: Blob, filename?: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `stream_recording_${Date.now()}.webm`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function checkMediaDevices(): Promise<{
  hasCamera: boolean;
  hasMicrophone: boolean;
  devices: MediaDeviceInfo[];
}> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.some(device => device.kind === 'videoinput');
    const hasMicrophone = devices.some(device => device.kind === 'audioinput');

    return {
      hasCamera,
      hasMicrophone,
      devices,
    };
  } catch (error) {
    return {
      hasCamera: false,
      hasMicrophone: false,
      devices: [],
    };
  }
}

export function isWebRTCSupported(): boolean {
  return !!(
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window !== 'undefined' &&
    typeof window.RTCPeerConnection === 'function' &&
    typeof window.MediaRecorder === 'function'
  );
}
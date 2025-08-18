export interface StreamConfig {
  video: {
    width: number;
    height: number;
    frameRate: number;
  };
  audio: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
  };
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  iceCandidatePoolSize: number;
}

export const STREAM_QUALITIES = {
  '480p': {
    video: { width: 854, height: 480, frameRate: 30 },
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
  },
  '720p': {
    video: { width: 1280, height: 720, frameRate: 30 },
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
  },
  '1080p': {
    video: { width: 1920, height: 1080, frameRate: 30 },
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
  }
} as const;

export const DEFAULT_WEBRTC_CONFIG: WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 10
};

export const getMediaConstraints = (quality: keyof typeof STREAM_QUALITIES): MediaStreamConstraints => {
  const config = STREAM_QUALITIES[quality];
  return {
    video: {
      width: { ideal: config.video.width },
      height: { ideal: config.video.height },
      frameRate: { ideal: config.video.frameRate },
      facingMode: 'user'
    },
    audio: {
      echoCancellation: config.audio.echoCancellation,
      noiseSuppression: config.audio.noiseSuppression,
      autoGainControl: config.audio.autoGainControl,
      sampleRate: 44100
    }
  };
};

export const createPeerConnection = (config: WebRTCConfig = DEFAULT_WEBRTC_CONFIG): RTCPeerConnection => {
  return new RTCPeerConnection(config);
};

export const handleICECandidate = (
  peerConnection: RTCPeerConnection,
  onIceCandidate: (candidate: RTCIceCandidate) => void
) => {
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };
};

export const addStreamToPeerConnection = (
  peerConnection: RTCPeerConnection,
  stream: MediaStream
) => {
  stream.getTracks().forEach(track => {
    peerConnection.addTrack(track, stream);
  });
};

export const createOffer = async (peerConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return offer;
};

export const createAnswer = async (
  peerConnection: RTCPeerConnection,
  offer: RTCSessionDescriptionInit
): Promise<RTCSessionDescriptionInit> => {
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return answer;
};

export const setRemoteAnswer = async (
  peerConnection: RTCPeerConnection,
  answer: RTCSessionDescriptionInit
) => {
  await peerConnection.setRemoteDescription(answer);
};

export const addIceCandidate = async (
  peerConnection: RTCPeerConnection,
  candidate: RTCIceCandidateInit
) => {
  await peerConnection.addIceCandidate(candidate);
};

export const getConnectionState = (peerConnection: RTCPeerConnection): string => {
  return peerConnection.connectionState;
};

export const closeConnection = (peerConnection: RTCPeerConnection) => {
  peerConnection.close();
};

export const stopMediaStream = (stream: MediaStream) => {
  stream.getTracks().forEach(track => {
    track.stop();
  });
};

export const toggleVideoTrack = (stream: MediaStream, enabled: boolean) => {
  const videoTrack = stream.getVideoTracks()[0];
  if (videoTrack) {
    videoTrack.enabled = enabled;
  }
};

export const toggleAudioTrack = (stream: MediaStream, enabled: boolean) => {
  const audioTrack = stream.getAudioTracks()[0];
  if (audioTrack) {
    audioTrack.enabled = enabled;
  }
};

export const getStreamStats = async (peerConnection: RTCPeerConnection) => {
  const stats = await peerConnection.getStats();
  const result: any = {};
  
  stats.forEach((report) => {
    if (report.type === 'outbound-rtp' && report.mediaType === 'video') {
      result.video = {
        bytesSent: report.bytesSent,
        packetsSent: report.packetsSent,
        framesPerSecond: report.framesPerSecond
      };
    }
    if (report.type === 'outbound-rtp' && report.mediaType === 'audio') {
      result.audio = {
        bytesSent: report.bytesSent,
        packetsSent: report.packetsSent
      };
    }
  });
  
  return result;
};
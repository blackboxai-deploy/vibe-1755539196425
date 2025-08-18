import { useState, useRef, useCallback, useEffect } from 'react';

interface WebRTCConfig {
  video: boolean | MediaTrackConstraints;
  audio: boolean | MediaTrackConstraints;
}

interface StreamQuality {
  width: number;
  height: number;
  frameRate: number;
  label: string;
}

export const STREAM_QUALITIES: StreamQuality[] = [
  { width: 1280, height: 720, frameRate: 30, label: '720p HD' },
  { width: 1920, height: 1080, frameRate: 30, label: '1080p Full HD' },
  { width: 854, height: 480, frameRate: 30, label: '480p SD' },
  { width: 640, height: 360, frameRate: 30, label: '360p' }
];

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isStreaming: boolean;
  isConnected: boolean;
  error: string | null;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  startStream: (quality?: StreamQuality) => Promise<void>;
  stopStream: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  switchCamera: () => Promise<void>;
  setStreamQuality: (quality: StreamQuality) => Promise<void>;
  getDevices: () => Promise<MediaDeviceInfo[]>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  viewerCount: number;
  streamDuration: number;
}

export const useWebRTC = (): UseWebRTCReturn => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('user');
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const streamStartTime = useRef<number | null>(null);
  const qualityCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  const rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10
  };

  const getDefaultConstraints = (quality: StreamQuality = STREAM_QUALITIES[0]): WebRTCConfig => ({
    video: {
      width: { ideal: quality.width },
      height: { ideal: quality.height },
      frameRate: { ideal: quality.frameRate },
      facingMode: currentFacingMode
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 44100
    }
  });

  const simulateViewerCount = useCallback(() => {
    if (isStreaming) {
      const baseCount = Math.floor(Math.random() * 50) + 10;
      const variation = Math.floor(Math.random() * 10) - 5;
      setViewerCount(Math.max(0, baseCount + variation));
    } else {
      setViewerCount(0);
    }
  }, [isStreaming]);

  const checkConnectionQuality = useCallback(async () => {
    if (!peerConnection.current) {
      setConnectionQuality('disconnected');
      return;
    }

    try {
      const stats = await peerConnection.current.getStats();
      let bytesReceived = 0;
      let bytesSent = 0;
      let packetsLost = 0;

      stats.forEach((report) => {
        if (report.type === 'inbound-rtp') {
          bytesReceived += report.bytesReceived || 0;
          packetsLost += report.packetsLost || 0;
        }
        if (report.type === 'outbound-rtp') {
          bytesSent += report.bytesSent || 0;
        }
      });

      const totalBytes = bytesReceived + bytesSent;
      const lossRate = packetsLost / (packetsLost + 100);

      if (totalBytes > 1000000 && lossRate < 0.02) {
        setConnectionQuality('excellent');
      } else if (totalBytes > 500000 && lossRate < 0.05) {
        setConnectionQuality('good');
      } else if (totalBytes > 100000) {
        setConnectionQuality('poor');
      } else {
        setConnectionQuality('disconnected');
      }
    } catch (err) {
      setConnectionQuality('poor');
    }
  }, []);

  const createPeerConnection = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    peerConnection.current = new RTCPeerConnection(rtcConfig);

    peerConnection.current.oniceconnectionstatechange = () => {
      const state = peerConnection.current?.iceConnectionState;
      setIsConnected(state === 'connected' || state === 'completed');
      
      if (state === 'disconnected' || state === 'failed') {
        setConnectionQuality('disconnected');
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real implementation, send this to the remote peer
        console.log('ICE candidate:', event.candidate);
      }
    };

    return peerConnection.current;
  }, []);

  const startStream = useCallback(async (quality: StreamQuality = STREAM_QUALITIES[0]) => {
    try {
      setError(null);
      
      const constraints = getDefaultConstraints(quality);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setLocalStream(stream);
      setIsStreaming(true);
      setIsConnected(true);
      streamStartTime.current = Date.now();

      // Create peer connection and add tracks
      const pc = createPeerConnection();
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Start quality monitoring
      qualityCheckInterval.current = setInterval(checkConnectionQuality, 5000);
      
      // Start duration tracking
      durationInterval.current = setInterval(() => {
        if (streamStartTime.current) {
          setStreamDuration(Math.floor((Date.now() - streamStartTime.current) / 1000));
        }
      }, 1000);

      // Simulate viewer count updates
      const viewerInterval = setInterval(simulateViewerCount, 3000);
      setTimeout(() => clearInterval(viewerInterval), 300000); // Stop after 5 minutes

      setConnectionQuality('excellent');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera/microphone';
      setError(errorMessage);
      console.error('Error starting stream:', err);
    }
  }, [createPeerConnection, checkConnectionQuality, simulateViewerCount, currentFacingMode]);

  const stopStream = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (qualityCheckInterval.current) {
      clearInterval(qualityCheckInterval.current);
      qualityCheckInterval.current = null;
    }

    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }

    setIsStreaming(false);
    setIsConnected(false);
    setConnectionQuality('disconnected');
    setRemoteStream(null);
    setError(null);
    setViewerCount(0);
    setStreamDuration(0);
    streamStartTime.current = null;
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, [localStream]);

  const switchCamera = useCallback(async () => {
    if (!localStream) return;

    try {
      const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
      const constraints = getDefaultConstraints();
      constraints.video = {
        ...constraints.video as MediaTrackConstraints,
        facingMode: newFacingMode
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Replace video track
      const videoTrack = localStream.getVideoTracks()[0];
      const newVideoTrack = newStream.getVideoTracks()[0];
      
      if (peerConnection.current && videoTrack) {
        const sender = peerConnection.current.getSenders().find(s => s.track === videoTrack);
        if (sender) {
          await sender.replaceTrack(newVideoTrack);
        }
      }

      videoTrack?.stop();
      localStream.removeTrack(videoTrack);
      localStream.addTrack(newVideoTrack);

      setCurrentFacingMode(newFacingMode);
      setLocalStream(new MediaStream(localStream.getTracks()));
      
    } catch (err) {
      setError('Failed to switch camera');
      console.error('Error switching camera:', err);
    }
  }, [localStream, currentFacingMode]);

  const setStreamQuality = useCallback(async (quality: StreamQuality) => {
    if (!isStreaming) {
      await startStream(quality);
      return;
    }

    try {
      const constraints = getDefaultConstraints(quality);
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Replace all tracks
      if (peerConnection.current && localStream) {
        const senders = peerConnection.current.getSenders();
        
        for (const sender of senders) {
          const track = sender.track;
          if (track) {
            const newTrack = newStream.getTracks().find(t => t.kind === track.kind);
            if (newTrack) {
              await sender.replaceTrack(newTrack);
            }
          }
        }
      }

      localStream?.getTracks().forEach(track => track.stop());
      setLocalStream(newStream);
      
    } catch (err) {
      setError('Failed to change stream quality');
      console.error('Error changing quality:', err);
    }
  }, [isStreaming, localStream, startStream]);

  const getDevices = useCallback(async (): Promise<MediaDeviceInfo[]> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput' || device.kind === 'audioinput');
    } catch (err) {
      console.error('Error getting devices:', err);
      return [];
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  // Update track enabled states
  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];
      
      setIsVideoEnabled(videoTrack?.enabled ?? false);
      setIsAudioEnabled(audioTrack?.enabled ?? false);
    }
  }, [localStream]);

  return {
    localStream,
    remoteStream,
    isStreaming,
    isConnected,
    error,
    connectionQuality,
    startStream,
    stopStream,
    toggleVideo,
    toggleAudio,
    switchCamera,
    setStreamQuality,
    getDevices,
    isVideoEnabled,
    isAudioEnabled,
    viewerCount,
    streamDuration
  };
};
import { useState, useEffect, useRef, useCallback } from 'react';

export interface StreamState {
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;
  streamId: string | null;
  viewerCount: number;
  duration: number;
  quality: 'low' | 'medium' | 'high';
  isRecording: boolean;
}

export interface StreamSettings {
  title: string;
  description: string;
  category: string;
  isPrivate: boolean;
  quality: 'low' | 'medium' | 'high';
  enableChat: boolean;
}

export const useStream = () => {
  const [streamState, setStreamState] = useState<StreamState>({
    isStreaming: false,
    isLoading: false,
    error: null,
    streamId: null,
    viewerCount: 0,
    duration: 0,
    quality: 'medium',
    isRecording: false,
  });

  const [streamSettings, setStreamSettings] = useState<StreamSettings>({
    title: 'My Live Stream',
    description: '',
    category: 'General',
    isPrivate: false,
    quality: 'medium',
    enableChat: true,
  });

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const viewerSimulationRef = useRef<NodeJS.Timeout | null>(null);

  const getVideoConstraints = useCallback((quality: string) => {
    switch (quality) {
      case 'low':
        return { width: 640, height: 360, frameRate: 24 };
      case 'high':
        return { width: 1920, height: 1080, frameRate: 30 };
      default:
        return { width: 1280, height: 720, frameRate: 30 };
    }
  }, []);

  const startStream = useCallback(async () => {
    try {
      setStreamState(prev => ({ ...prev, isLoading: true, error: null }));

      const constraints = {
        video: getVideoConstraints(streamSettings.quality),
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const streamId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setStreamState(prev => ({
        ...prev,
        isStreaming: true,
        isLoading: false,
        streamId,
        duration: 0,
      }));

      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setStreamState(prev => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);

      // Simulate viewer count changes
      viewerSimulationRef.current = setInterval(() => {
        setStreamState(prev => ({
          ...prev,
          viewerCount: Math.max(0, prev.viewerCount + Math.floor(Math.random() * 3) - 1),
        }));
      }, 5000);

      // Initial viewer count
      setTimeout(() => {
        setStreamState(prev => ({
          ...prev,
          viewerCount: Math.floor(Math.random() * 10) + 1,
        }));
      }, 2000);

      return stream;
    } catch (error) {
      setStreamState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start stream',
      }));
      throw error;
    }
  }, [streamSettings.quality, getVideoConstraints]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (mediaRecorderRef.current && streamState.isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    if (viewerSimulationRef.current) {
      clearInterval(viewerSimulationRef.current);
      viewerSimulationRef.current = null;
    }

    setStreamState(prev => ({
      ...prev,
      isStreaming: false,
      streamId: null,
      viewerCount: 0,
      duration: 0,
      isRecording: false,
    }));
  }, [streamState.isRecording]);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stream_${streamState.streamId}_${new Date().toISOString()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      setStreamState(prev => ({ ...prev, isRecording: true }));
    } catch (error) {
      setStreamState(prev => ({
        ...prev,
        error: 'Failed to start recording',
      }));
    }
  }, [streamState.streamId]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setStreamState(prev => ({ ...prev, isRecording: false }));
    }
  }, []);

  const updateStreamSettings = useCallback((newSettings: Partial<StreamSettings>) => {
    setStreamSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const changeQuality = useCallback(async (quality: 'low' | 'medium' | 'high') => {
    if (!streamState.isStreaming) {
      setStreamSettings(prev => ({ ...prev, quality }));
      return;
    }

    try {
      const constraints = {
        video: getVideoConstraints(quality),
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      streamRef.current = newStream;
      setStreamState(prev => ({ ...prev, quality }));
      setStreamSettings(prev => ({ ...prev, quality }));

      return newStream;
    } catch (error) {
      setStreamState(prev => ({
        ...prev,
        error: 'Failed to change quality',
      }));
    }
  }, [streamState.isStreaming, getVideoConstraints]);

  const getStreamStats = useCallback(() => {
    return {
      duration: streamState.duration,
      viewerCount: streamState.viewerCount,
      quality: streamState.quality,
      isRecording: streamState.isRecording,
      streamId: streamState.streamId,
    };
  }, [streamState]);

  const formatDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (viewerSimulationRef.current) {
        clearInterval(viewerSimulationRef.current);
      }
    };
  }, []);

  return {
    streamState,
    streamSettings,
    startStream,
    stopStream,
    startRecording,
    stopRecording,
    updateStreamSettings,
    changeQuality,
    getStreamStats,
    formatDuration,
    currentStream: streamRef.current,
  };
};
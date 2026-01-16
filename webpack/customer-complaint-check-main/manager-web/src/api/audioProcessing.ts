import request from '@/utils/request';
import type {
  AudioProcessResponse,
  TagOptionsResponse,
  ProcessAudioForCorrectionResponse,
} from './audioProcessing.types';

export const audioProcessingApi = {
  processAudioUrl(audioUrl: string): Promise<AudioProcessResponse> {
    return request.post<AudioProcessResponse>({
      api: '/process_audio',
      data: { audio_url: audioUrl },
    });
  },

  processAudioFile(file: File): Promise<AudioProcessResponse> {
    const formData = new FormData();
    formData.append('audio_file', file);

    return request.post<AudioProcessResponse>({
      api: '/process_audio_file',
      data: formData,
      config: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    });
  },

  processAudioForCorrection(
    audioUrl: string
  ): Promise<ProcessAudioForCorrectionResponse> {
    return request.post<ProcessAudioForCorrectionResponse>({
      api: '/process_audio_for_correction',
      data: { audio_url: audioUrl },
    });
  },

  getTagOptions(): Promise<TagOptionsResponse> {
    return request.get<TagOptionsResponse>({
      api: '/tag_options',
    });
  },
};

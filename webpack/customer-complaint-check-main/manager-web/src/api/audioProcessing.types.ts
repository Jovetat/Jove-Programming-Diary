export interface DialogueSegment {
  role: 'customer_service' | 'visitor';
  text: string;
  start: string;
  end: string;
  emotion?: string;
}

export interface ClassificationResult {
  domain: string;
  intent: string;
  intent_reasoning?: string;
  reasoning?: string;
  third_level?: string;
  third_level_reasoning?: string;
}

export interface ReconciliationResult {
  status: string;
  reasoning: string;
}

export interface AudioProcessResponse {
  success: boolean;
  asr_text: string;
  dialogue_segments: DialogueSegment[];
  complaint: ClassificationResult;
  reconciliation: ReconciliationResult;
  solution: ClassificationResult;
  appeal: ClassificationResult;
  error?: string;
}

export interface AudioProcessRequest {
  audio_url: string;
}

export interface ProcessAudioForCorrectionResponse {
  success: boolean;
  dialogue_segments: DialogueSegment[];
  chat_text: string;
  error?: string;
}

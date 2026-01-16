#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Audio processing and complaint classification pipeline
Processes audio files and classifies customer complaints
"""

import sys
import os
import logging

# Add the project root to the path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core import AudioProcessor
from core.claim_llm_tag import ComplaintTagProcessor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def process_audio_and_classify(audio_url):
    """
    Process audio URL and classify complaints
    
    Args:
        audio_url (str): URL of the audio file to process
        
    Returns:
        dict: Result containing classification and metadata
    """
    try:
        # Initialize processors
        audio_processor = AudioProcessor()
        complaint_classifier = ComplaintTagProcessor()
        
        # Process audio to get text
        logger.info(f"Processing audio: {audio_url}")
        audio_result = audio_processor.process_audio_url(audio_url)
        
        if not audio_result:
            logger.warning(f"No result from audio processing for URL {audio_url}")
            return None
            
        # Classify complaint from chat text
        logger.info("Classifying complaint")
        chat_text = audio_result["chat_text"]
        domain, intent, third_level, basis = complaint_classifier.process_single_row(chat_text)
        classification = {
            "domain": domain,
            "intent": intent,
            "third_level": third_level,
            "basis": basis
        }
        
        # Combine results
        result = {
            "audio_processing": audio_result,
            "classification": classification
        }
        
        logger.info("Completed processing")
        return result
        
    except Exception as e:
        logger.error(f"Error processing audio and classifying: {str(e)}")
        raise

def main():
    """
    Main function to demonstrate usage
    """
    # Example usage
    # In a real application, this value would come from user input
    sample_audio_url = "https://kefu.tjzimu.com/report/call/play/video/ims_109/record/LHPJR/2025/07/09/7955729504452882369.mp3"
    
    logger.info("Starting audio processing and complaint classification")
    
    try:
        result = process_audio_and_classify(audio_url=sample_audio_url)
        
        if result:
            print("Processing completed successfully:")
            print(f"Chat text length: {len(result['audio_processing']['chat_text'])} characters")
            print(f"Domain classification: {result['classification']['domain']}")
            print(f"Intent classification: {result['classification']['intent']}")
            print(f"Third level classification: {result['classification']['third_level']}")
        else:
            print("Processing completed with no result")
            
    except Exception as e:
        logger.error(f"Failed to process audio and classify complaint: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
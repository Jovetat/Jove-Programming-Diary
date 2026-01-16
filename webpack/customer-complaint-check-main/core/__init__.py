# -*- coding: utf-8 -*-

"""
Core package for customer complaint check system.
Contains modules for audio processing and LLM-based complaint tagging.
"""

from .claim_llm_tag import ComplaintTagProcessor
from .audio_processor import AudioProcessor

__all__ = ['ComplaintTagProcessor', 'AudioProcessor']
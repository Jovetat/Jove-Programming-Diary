import requests
import os
import json
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Import configuration
from config.env import FUNASR_BASE_URL, USE_AUDIO_PROXY, AUDIO_PROXY_CONFIG

class AudioProcessor:
    """
    Handles audio processing using FunASR service
    """
    
    def __init__(self, funasr_base_url=None, proxies=None):
        """
        Initialize the AudioProcessor with FunASR service URL
        
        Args:
            funasr_base_url (str): Base URL for FunASR service. If None, uses value from config.
            proxies (dict): Proxy configuration if needed. If None, uses value based on config.
        """
        self.funasr_base_url = funasr_base_url or FUNASR_BASE_URL
        # 如果没有提供代理配置，则根据配置文件决定是否使用代理
        if proxies is not None:
            self.proxies = proxies
        else:
            if USE_AUDIO_PROXY:
                self.proxies = AUDIO_PROXY_CONFIG
            else:
                self.proxies = None
        self.session = requests.Session()
        
        # Configure retry strategy
        retry = Retry(
            total=3,
            read=3,
            connect=3,
            backoff_factor=0.3,
            status_forcelist=(500, 502, 504)
        )
        adapter = HTTPAdapter(max_retries=retry)
        self.session.mount('http://', adapter)
        self.session.mount('https://', adapter)
    
    def process_audio_url(self, audio_url):
        """
        Process audio from URL using FunASR service
        
        Args:
            audio_url (str): URL of the audio file (can be http/https or file://)
            
        Returns:
            dict: Result containing text and metadata
        """
        # Strip whitespace and other characters from audio_url
        audio_url = audio_url.strip()
        
        # 统一替换URL中的10.2.7.109为kefu.tjzimu.com
        audio_url = audio_url.replace("10.2.7.109", "kefu.tjzimu.com")

        try:
            # Handle file:// URLs differently
            if audio_url.startswith('file://'):
                return self._process_local_file(audio_url)
            
            # Handle HTTP/HTTPS URLs
            # 1. Stream download audio file
            logger.info(f"Downloading audio file: {audio_url}")
            response = self.session.get(audio_url, stream=True, timeout=(10, 50), proxies=self.proxies)
            response.raise_for_status()
            
            # 2. Call ASR API
            logger.info(f"Starting ASR recognition for: {audio_url}")
            url = f"{self.funasr_base_url}/recognition"
            headers = {}
            
            filename = os.path.basename(audio_url)
            with response:
                files = {'audio': (filename, response.raw)}
                # Using timestamp as session_id if needed
                import time
                form_data = {
                    "session_id": f"web_session_{int(time.time())}"
                }
                
                upload_response = self.session.post(
                    url, 
                    headers=headers, 
                    files=files, 
                    data=form_data, 
                    timeout=90,
                    proxies=self.proxies
                )
                upload_response.raise_for_status()
                asr_ret = upload_response.json()
                logger.info(f"✅ ASR recognition completed for: {audio_url}")
            
            # 3. Process ASR results
            output_text = self.convert_to_spk_text(asr_ret)
            logger.info(f"📝 ASR text conversion completed: Segments: {len(output_text)}")
            
            # 4. Convert to analysis format
            chat_text = self.convert_spk_to_analysis(output_text)
            logger.info(f"🤖 Converted to chat format: Characters: {len(chat_text)}")
            
            return {
                "asr_result": asr_ret,
                "dialogue_segments": output_text,
                "chat_text": chat_text
            }
            
        except Exception as e:
            logger.error(f"Error processing audio {audio_url}: {str(e)}")
            raise
    
    def _process_local_file(self, file_url):
        """
        Process local audio file using FunASR service
        
        Args:
            file_url (str): file:// URL of the local audio file
            
        Returns:
            dict: Result containing text and metadata
        """
        # Strip whitespace and other characters from file_url
        file_url = file_url.strip()
        
        try:
            # Extract file path from file:// URL
            file_path = file_url[7:]  # Remove 'file://' prefix
            
            # Check if file exists
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")
            
            # Call ASR API
            logger.info(f"Starting ASR recognition for local file: {file_path}")
            url = f"{self.funasr_base_url}/recognition"
            headers = {}
            
            filename = os.path.basename(file_path)
            with open(file_path, 'rb') as f:
                files = {'audio': (filename, f)}
                # Using timestamp as session_id if needed
                import time
                form_data = {
                    "session_id": f"web_session_{int(time.time())}"
                }
                
                upload_response = self.session.post(
                    url, 
                    headers=headers, 
                    files=files, 
                    data=form_data, 
                    timeout=90
                )
                upload_response.raise_for_status()
                asr_ret = upload_response.json()
                logger.info(f"✅ ASR recognition completed for local file: {file_path}")
            
            # 3. Process ASR results
            output_text = self.convert_to_spk_text(asr_ret)
            logger.info(f"📝 ASR text conversion completed: Segments: {len(output_text)}")
            
            # 4. Convert to analysis format
            chat_text = self.convert_spk_to_analysis(output_text)
            logger.info(f"🤖 Converted to chat format: Characters: {len(chat_text)}")
            
            return {
                "asr_result": asr_ret,
                "dialogue_segments": output_text,
                "chat_text": chat_text
            }
            
        except Exception as e:
            logger.error(f"Error processing local audio file {file_url}: {str(e)}")
            raise
    
    def convert_to_spk_text(self, data):
        """
        Convert ASR result to segments with role, text, start and end time
        
        Args:
            data (dict): ASR result data
            
        Returns:
            list: List of segments with role, text, start and end time
        """
        sentences = data.get("sentences", [])
        result = []
        
        for sentence in sentences:
            spk_sentence = {}
            # Determine role based on channel
            if sentence.get('channel') == 'right':
                spk_sentence["role"] = "customer_service"
            else:
                spk_sentence["role"] = "visitor"
                
            spk_sentence["text"] = sentence["text"].strip()
            # Ensure start and end times are properly formatted as strings
            spk_sentence["start"] = str(sentence["start"])
            spk_sentence["end"] = str(sentence["end"])
            result.append(spk_sentence)
        
        return result
    
    def convert_spk_to_analysis(self, data):
        """
        Convert ASR segments to continuous dialogue format
        
        Args:
            data (list): List of segments with role and text
            
        Returns:
            str: Continuous dialogue text
        """
        result = []
        current_role = None
        current_text = []
        
        # Iterate through each sentence
        for sentence in data:
            # Set current role
            rl = sentence.get('role')
            # Strip whitespace from text
            text = sentence['text'].strip()
            
            # Skip empty sentences
            if not text:
                continue
            
            # If same role as previous, concatenate text
            if rl == current_role:
                current_text.append(text)
            else:
                # If not first sentence, save previous sentence
                if current_role is not None:
                    if current_role == 'customer_service':
                        result.append(f"坐席: {' '.join(current_text)}")
                    else:
                        result.append(f"客户: {' '.join(current_text)}")
                
                # Switch role
                current_role = rl
                # Save text
                current_text = [text]
        
        # Save last sentence
        if current_role is not None and current_text:
            if current_role == 'customer_service':
                result.append(f"坐席: {' '.join(current_text)}")
            else:
                result.append(f"客户: {' '.join(current_text)}")
        
        # Join results with newlines
        chat_results = "\n".join(result)
        logger.debug(f"ASR conversion completed, generated {len(result)} dialogue segments")
        
        return chat_results
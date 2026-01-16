from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
import sys
import os
import tempfile
import uuid
import pandas as pd
from werkzeug.utils import secure_filename

# Add the project root to the path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.audio_processor import AudioProcessor
from core.claim_llm_tag import ComplaintTagProcessor, ReconciliationTagProcessor, SolutionTagProcessor, AppealTagProcessor

# Import the evaluation function
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'scripts'))
from scripts.evaluate_tags import evaluate_tagged_data

# Import tag options from config
from config.env import COMPLAINT_DOMAIN_INTENT_MAP, APPEAL_DOMAIN_INTENT_MAP, SOLUTION_DOMAIN_INTENT_MAP, RECONCILIATION_INTENT_MAP, APPEAL_SECOND_THIRD_INTENT_MAP, SOLUTION_SECOND_THIRD_INTENT_MAP, COMPLAINT_SECOND_THIRD_INTENT_MAP

# Get the directory where this script is located
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, 
            template_folder=os.path.join(basedir, 'templates'),
            static_folder=os.path.join(basedir, 'static'))

# Configure maximum file upload size (100MB)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

# Create a directory for evaluation reports in the parent directory (main directory)
EVAL_REPORTS_DIR = os.path.join(os.path.dirname(basedir), 'evaluation_reports')
if not os.path.exists(EVAL_REPORTS_DIR):
    os.makedirs(EVAL_REPORTS_DIR)

# Create a directory for temporary files
CORRECTION_TEMP_DIR = os.path.join(os.path.dirname(basedir), 'correction_temp')
if not os.path.exists(CORRECTION_TEMP_DIR):
    os.makedirs(CORRECTION_TEMP_DIR)

# Global variable to store correction data
correction_data_store = {}
correction_files_store = {}

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/tag_options')
def tag_options():
    """Return tag options for dropdowns"""
    options = {
        'complaint': COMPLAINT_DOMAIN_INTENT_MAP,
        'appeal': APPEAL_DOMAIN_INTENT_MAP,
        'appeal_second_third_intent_map': APPEAL_SECOND_THIRD_INTENT_MAP,
        'solution': SOLUTION_DOMAIN_INTENT_MAP,
        'solution_second_third_intent_map': SOLUTION_SECOND_THIRD_INTENT_MAP,
        'reconciliation': RECONCILIATION_INTENT_MAP,
        'complaint_second_third_intent_map': COMPLAINT_SECOND_THIRD_INTENT_MAP
    }
    return jsonify({'success': True, 'options': options})

@app.route('/upload_correction_file', methods=['POST'])
def upload_correction_file():
    """Handle uploading file for tag correction"""
    try:
        if 'correction_file' not in request.files:
            return jsonify({'success': False, 'error': 'No file provided'}), 400
        
        file = request.files['correction_file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
        
        # Generate a unique session ID
        session_id = str(uuid.uuid4())
        
        # Save file temporarily
        filename = secure_filename(file.filename)
        temp_filepath = os.path.join(CORRECTION_TEMP_DIR, f"{session_id}_{filename}")
        file.save(temp_filepath)
        
        # Read Excel file
        df = pd.read_excel(temp_filepath)
        
        # Convert DataFrame to list of dictionaries
        correction_data = []
        for index, row in df.iterrows():
            # Helper function to safely get value from row
            def safe_get(key, default=''):
                value = row.get(key, default)
                # Handle NaN values
                if pd.isna(value):
                    return default
                return str(value)
            
            item = {
                'index': index,
                'record_name': safe_get('record_name'),
                'audio_url': safe_get('audio_url'),
                'asr_text': safe_get('chat_text', safe_get('asr_text')),
                'complaint_domain': safe_get('complaint_domain'),
                'complaint_intent': safe_get('complaint_intent'),
                'complaint_third_level': safe_get('complaint_third_level'),
                'complaint_basis': safe_get('complaint_basis'),
                # Add appeal tags
                'appeal_domain': safe_get('appeal_domain'),
                'appeal_intent': safe_get('appeal_intent'),
                'appeal_third_level': safe_get('appeal_third_level'),
                'appeal_basis': safe_get('appeal_basis'),
                # Add solution tags
                'solution_domain': safe_get('solution_domain'),
                'solution_intent': safe_get('solution_intent'),
                'solution_third_level': safe_get('solution_third_level'),
                'solution_basis': safe_get('solution_basis'),
                # Add reconciliation tags
                'reconciliation_status': safe_get('reconciliation_status'),
                'reconciliation_reasoning': safe_get('reconciliation_reasoning'),
                'corrected': False,
                'corrected_complaint_domain': '',
                'corrected_complaint_intent': '',
                'corrected_complaint_third_level': '',
                'corrected_appeal_domain': '',
                'corrected_appeal_intent': '',
                'corrected_appeal_third_level': '',
                'corrected_solution_domain': '',
                'corrected_solution_intent': '',
                'corrected_solution_third_level': '',
                'corrected_reconciliation_status': '',
                'correction_reason': ''
            }
            
            # Try to get dialogue segments if they exist
            if 'dialogue_segments' in row:
                item['dialogue_segments'] = row['dialogue_segments']
            
            correction_data.append(item)
        
        # Store data in memory
        correction_data_store[session_id] = correction_data
        correction_files_store[session_id] = temp_filepath
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'correction_data': correction_data
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': f'Error processing file: {str(e)}'}), 500

@app.route('/save_correction', methods=['POST'])
def save_correction():
    """Save a correction for a specific item"""
    try:
        data = request.get_json()
        # 优先从请求头获取 Session-ID，如果没有则从请求体获取 session_id
        session_id = request.headers.get('Session-ID')
        if not session_id:
            session_id = data.get('session_id') if data else None
        
        if not session_id:
            return jsonify({'success': False, 'error': 'Session ID is required'}), 400
            
        if session_id not in correction_data_store:
            return jsonify({'success': False, 'error': 'Invalid session ID'}), 400
        
        if not data:
            return jsonify({'success': False, 'error': 'Request data is empty'}), 400
            
        index = data.get('index')
        if index is None:
            return jsonify({'success': False, 'error': 'Index is required'}), 400
            
        if index < 0 or index >= len(correction_data_store[session_id]):
            return jsonify({'success': False, 'error': f'Index out of range. Valid range: 0-{len(correction_data_store[session_id])-1}'}), 400
        
        # Get the item to update
        item = correction_data_store[session_id][index]
        
        # Helper function to safely get value from data
        def safe_get(key, default=''):
            value = data.get(key)
            # Handle None and NaN values
            if value is None or (isinstance(value, float) and pd.isna(value)):
                return default
            return str(value)
        
        # Update corrected fields
        item['corrected_complaint_domain'] = safe_get('corrected_complaint_domain')
        item['corrected_complaint_intent'] = safe_get('corrected_complaint_intent')
        item['corrected_complaint_third_level'] = safe_get('corrected_complaint_third_level')
        item['corrected_appeal_domain'] = safe_get('corrected_appeal_domain')
        item['corrected_appeal_intent'] = safe_get('corrected_appeal_intent')
        item['corrected_appeal_third_level'] = safe_get('corrected_appeal_third_level')
        item['corrected_solution_domain'] = safe_get('corrected_solution_domain')
        item['corrected_solution_intent'] = safe_get('corrected_solution_intent')
        item['corrected_solution_third_level'] = safe_get('corrected_solution_third_level')
        item['corrected_reconciliation_status'] = safe_get('corrected_reconciliation_status')
        item['correction_reason'] = safe_get('correction_reason')
        item['corrected'] = True
        
        # Check if all items are corrected
        all_corrected = all(item.get('corrected', False) for item in correction_data_store[session_id])
        
        # Generate download URL
        download_url = f"/download_corrected_file/{session_id}"
        
        return jsonify({'success': True, 'download_url': download_url, 'all_corrected': all_corrected})
        
    except Exception as e:
        return jsonify({'success': False, 'error': f'Error saving correction: {str(e)}'}), 500

@app.route('/download_corrected_file/<session_id>')
def download_corrected_file(session_id):
    """Download the corrected Excel file"""
    try:
        if session_id not in correction_files_store or session_id not in correction_data_store:
            return jsonify({'success': False, 'error': 'Invalid session'}), 400
        
        # Get the original file path
        original_filepath = correction_files_store[session_id]
        
        # Read the original Excel file
        df = pd.read_excel(original_filepath)
        
        # Apply corrections
        correction_data = correction_data_store[session_id]
        
        for item in correction_data:
            if item.get('corrected', False):
                idx = item['index']
                # Helper function to safely get value from item
                def safe_get(key, default=''):
                    value = item.get(key, default)
                    # Handle None and NaN values
                    if value is None or (isinstance(value, float) and pd.isna(value)):
                        return default
                    return str(value)
                
                # Apply complaint tags corrections
                if 'corrected_complaint_domain' in df.columns:
                    df.at[idx, 'corrected_complaint_domain'] = safe_get('corrected_complaint_domain')
                else:
                    df['corrected_complaint_domain'] = ''  # Add column if not exists
                    df.at[idx, 'corrected_complaint_domain'] = safe_get('corrected_complaint_domain')
                    
                if 'corrected_complaint_intent' in df.columns:
                    df.at[idx, 'corrected_complaint_intent'] = safe_get('corrected_complaint_intent')
                else:
                    df['corrected_complaint_intent'] = ''  # Add column if not exists
                    df.at[idx, 'corrected_complaint_intent'] = safe_get('corrected_complaint_intent')
                
                # Add corrected_complaint_third_level field
                if 'corrected_complaint_third_level' in df.columns:
                    df.at[idx, 'corrected_complaint_third_level'] = safe_get('corrected_complaint_third_level')
                else:
                    df['corrected_complaint_third_level'] = ''  # Add column if not exists
                    df.at[idx, 'corrected_complaint_third_level'] = safe_get('corrected_complaint_third_level')
                
                # Apply appeal tags corrections
                if 'corrected_appeal_domain' in df.columns:
                    df.at[idx, 'corrected_appeal_domain'] = safe_get('corrected_appeal_domain')
                else:
                    df['corrected_appeal_domain'] = ''  # Add column if not exists
                    df.at[idx, 'corrected_appeal_domain'] = safe_get('corrected_appeal_domain')
                    
                if 'corrected_appeal_intent' in df.columns:
                    df.at[idx, 'corrected_appeal_intent'] = safe_get('corrected_appeal_intent')
                else:
                    df['corrected_appeal_intent'] = ''  # Add column if not exists
                    df.at[idx, 'corrected_appeal_intent'] = safe_get('corrected_appeal_intent')
                    
                if 'corrected_appeal_third_level' in df.columns:
                    df.at[idx, 'corrected_appeal_third_level'] = safe_get('corrected_appeal_third_level')
                else:
                    df['corrected_appeal_third_level'] = ''  # Add column if not exists
                    df.at[idx, 'corrected_appeal_third_level'] = safe_get('corrected_appeal_third_level')
                    
                # Apply solution tags corrections
                if 'corrected_solution_domain' in df.columns:
                    df.at[idx, 'corrected_solution_domain'] = safe_get('corrected_solution_domain')
                else:
                    df['corrected_solution_domain'] = ''  # Add column if not exists
                    df.at[idx, 'corrected_solution_domain'] = safe_get('corrected_solution_domain')
                    
                if 'corrected_solution_intent' in df.columns:
                    df.at[idx, 'corrected_solution_intent'] = safe_get('corrected_solution_intent')
                else:
                    df['corrected_solution_intent'] = ''  # Add column if not exists
                    df.at[idx, 'corrected_solution_intent'] = safe_get('corrected_solution_intent')
                    
                if 'corrected_solution_third_level' in df.columns:
                    df.at[idx, 'corrected_solution_third_level'] = safe_get('corrected_solution_third_level')
                else:
                    df['corrected_solution_third_level'] = ''  # Add column if not exists
                    df.at[idx, 'corrected_solution_third_level'] = safe_get('corrected_solution_third_level')
                    
                # Apply reconciliation tags corrections
                if 'corrected_reconciliation_status' in df.columns:
                    df.at[idx, 'corrected_reconciliation_status'] = safe_get('corrected_reconciliation_status')
                else:
                    df['corrected_reconciliation_status'] = ''  # Add column if not exists
                    df.at[idx, 'corrected_reconciliation_status'] = safe_get('corrected_reconciliation_status')
                    
                # Apply correction reason
                if 'correction_reason' in df.columns:
                    df.at[idx, 'correction_reason'] = safe_get('correction_reason')
                else:
                    df['correction_reason'] = ''  # Add column if not exists
                    df.at[idx, 'correction_reason'] = safe_get('correction_reason')
        
        # Save corrected file
        corrected_filename = f"corrected_{os.path.basename(original_filepath)}"
        corrected_filepath = os.path.join(CORRECTION_TEMP_DIR, corrected_filename)
        df.to_excel(corrected_filepath, index=False)
        
        # Return file for download
        return send_file(corrected_filepath, as_attachment=True, download_name=corrected_filename)
        
    except Exception as e:
        return jsonify({'success': False, 'error': f'Error generating corrected file: {str(e)}'}), 500

@app.route('/process_audio_for_correction', methods=['POST'])
def process_audio_for_correction():
    """Process audio using FunASR to generate dialogue segments for correction"""
    try:
        data = request.get_json()
        audio_url = data.get('audio_url')
        
        if not audio_url:
            return jsonify({'success': False, 'error': 'Audio URL is required'}), 400
        
        # Initialize processor
        audio_processor = AudioProcessor()
        
        # Process audio
        result = audio_processor.process_audio_url(audio_url)
        
        # Return dialogue segments and chat text
        return jsonify({
            'success': True,
            'dialogue_segments': result['dialogue_segments'],
            'chat_text': result['chat_text']
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': f'Error processing audio: {str(e)}'}), 500

def classify_audio_result(audio_result):
    """Common function to classify audio processing results"""
    # Initialize processors
    complaint_classifier = ComplaintTagProcessor()
    reconciliation_classifier = ReconciliationTagProcessor()
    solution_classifier = SolutionTagProcessor()
    appeal_classifier = AppealTagProcessor()
    
    # Classify complaint from chat text
    chat_text = audio_result["chat_text"]
    complaint_domain, complaint_intent, complaint_third_level, complaint_basis = complaint_classifier.process_single_row(chat_text)
    reconciliation, reconciliation_basis = reconciliation_classifier.process_single_row_with_reconciliation(chat_text)
    solution_domain, solution_intent, solution_third_level, solution_basis = solution_classifier.process_single_row_solution(chat_text)
    appeal_domain, appeal_intent, appeal_third_level, appeal_basis = appeal_classifier.process_single_row_appeal(chat_text)
    
    complaint_result = {
        "domain": complaint_domain,
        "intent": complaint_intent,
        "intent_reasoning": complaint_basis,
        "third_level": complaint_third_level,
        "third_level_reasoning": complaint_basis
    }
    
    reconciliation_result = {
        "status": reconciliation,
        "reasoning": reconciliation_basis
    }
    
    solution_result = {
        "domain": solution_domain,
        "intent": solution_intent,
        "reasoning": solution_basis,
        "third_level": solution_third_level,
        "third_level_reasoning": solution_basis
    }

    appeal_result = {
        "domain": appeal_domain,
        "intent": appeal_intent,
        "reasoning": appeal_basis,
        "third_level": appeal_third_level,
        "third_level_reasoning": appeal_basis
    }
    
    # Prepare response
    result = {
        'success': True,
        'asr_text': audio_result["chat_text"],
        'dialogue_segments': audio_result["dialogue_segments"],
        'complaint': complaint_result,
        'reconciliation': reconciliation_result,
        'solution': solution_result,
        'appeal': appeal_result
    }
    
    return result

@app.route('/process_audio', methods=['POST'])
def process_audio():
    """Process audio URL and return results"""
    try:
        # Get data from request
        data = request.get_json()
        audio_url = data.get('audio_url')
        
        if not audio_url:
            return jsonify({'error': 'Audio URL is required'}), 400
        
        # Initialize processor
        audio_processor = AudioProcessor()
        
        # Process audio to get text
        audio_result = audio_processor.process_audio_url(audio_url)
        
        if not audio_result:
            return jsonify({'error': 'Failed to process audio'}), 500
            
        # Classify the result using the common function
        result = classify_audio_result(audio_result)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process_audio_file', methods=['POST'])
def process_audio_file():
    """Process uploaded audio file and return results"""
    try:
        # Check if file was uploaded
        if 'audio_file' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        file = request.files['audio_file']
        
        if file.filename == '':
            return jsonify({'error': 'No audio file selected'}), 400
        
        if file:
            # Create a temporary file to store the uploaded file
            temp_dir = tempfile.gettempdir()
            filename = f"uploaded_audio_{uuid.uuid4().hex}_{file.filename}"
            temp_file_path = os.path.join(temp_dir, filename)
            
            # Save the uploaded file
            file.save(temp_file_path)
            
            # Create a file URL for processing
            file_url = f"file://{temp_file_path}"
            
            # Initialize processor
            audio_processor = AudioProcessor()

            # Process audio to get text
            audio_result = audio_processor.process_audio_url(file_url)
            
            # Remove the temporary file
            try:
                os.remove(temp_file_path)
            except:
                pass  # Ignore errors in file removal
            
            if not audio_result:
                return jsonify({'error': 'Failed to process audio'}), 500
                
            # Classify the result using the common function
            result = classify_audio_result(audio_result)
            
            return jsonify(result)
        
        return jsonify({'error': 'Invalid file'}), 400
        
    except Exception as e:
        # Try to remove temporary file if it exists
        try:
            if 'temp_file_path' in locals():
                os.remove(temp_file_path)
        except:
            pass  # Ignore errors in file removal
        
        return jsonify({'error': str(e)}), 500

@app.route('/evaluate_tags', methods=['POST'])
def evaluate_tags():
    """Evaluate tagged data and generate report"""
    try:
        # Get data from request
        data = request.get_json()
        file_path = data.get('file_path')
        
        if not file_path:
            return jsonify({'error': 'File path is required'}), 400
        
        if not os.path.exists(file_path):
            return jsonify({'error': f'File not found: {file_path}'}), 404
        
        # Generate evaluation report
        result_path = evaluate_tagged_data(file_path)
        
        # Move the result to the evaluation reports directory with a unique name
        report_filename = f"evaluation_{uuid.uuid4().hex}.xlsx"
        report_path = os.path.join(EVAL_REPORTS_DIR, report_filename)
        os.rename(result_path, report_path)
        
        # Prepare response
        result = {
            'success': True,
            'report_filename': report_filename
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/evaluate_tags_file', methods=['POST'])
def evaluate_tags_file():
    """Evaluate uploaded tagged data file and generate report"""
    try:
        # Check if file was uploaded
        if 'eval_file' not in request.files:
            return jsonify({'error': 'No tagged file provided'}), 400
        
        file = request.files['eval_file']
        
        if file.filename == '':
            return jsonify({'error': 'No tagged file selected'}), 400
        
        if file:
            # Create a temporary file to store the uploaded file
            temp_dir = tempfile.gettempdir()
            filename = f"uploaded_tagged_{uuid.uuid4().hex}_{secure_filename(file.filename)}"
            temp_file_path = os.path.join(temp_dir, filename)
            
            # Save the uploaded file
            file.save(temp_file_path)
            
            # Generate evaluation report
            result_path = evaluate_tagged_data(temp_file_path)
            
            # Move the result to the evaluation reports directory with a unique name
            report_filename = f"evaluation_{uuid.uuid4().hex}.xlsx"
            report_path = os.path.join(EVAL_REPORTS_DIR, report_filename)
            os.rename(result_path, report_path)
            
            # Remove the temporary input file
            try:
                os.remove(temp_file_path)
            except:
                pass  # Ignore errors in file removal
            
            # Store the result path in a session or temporary storage
            # For now, we'll just return the path
            result = {
                'success': True,
                'report_filename': report_filename
            }
            
            return jsonify(result)
        
        return jsonify({'error': 'Invalid file'}), 400
        
    except Exception as e:
        # Try to remove temporary files if they exist
        try:
            if 'temp_file_path' in locals():
                os.remove(temp_file_path)
        except:
            pass  # Ignore errors in file removal
        
        return jsonify({'error': str(e)}), 500

@app.route('/download_evaluation/<filename>')
def download_evaluation(filename):
    """Download evaluation report"""
    try:
        # Security check - only allow files ending with .xlsx
        if not filename.endswith('.xlsx'):
            return jsonify({'error': 'Invalid file requested'}), 400
        
        # Check if file exists in the evaluation reports directory
        file_path = os.path.join(EVAL_REPORTS_DIR, filename)
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404
        
        # Send the file for download
        return send_from_directory(EVAL_REPORTS_DIR, filename, as_attachment=True)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/list_audio_files', methods=['GET'])
def list_audio_files():
    """List audio files with filtering and pagination"""
    try:
        # Get query parameters
        start_year = request.args.get('start_year')
        start_month = request.args.get('start_month')
        end_year = request.args.get('end_year')
        end_month = request.args.get('end_month')
        call_type_filter = request.args.get('call_type')  # '', 'call_in', or 'call_out'
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 20))
        sort_by = request.args.get('sort_by', 'year_month')  # year_month, call_type, filename
        sort_order = request.args.get('sort_order', 'asc')  # asc or desc
        
        # Base directory for audio files
        base_dir = '/data/disk4/jr_audio_data'
        
        # Check if base directory exists
        if not os.path.exists(base_dir):
            # 打印日志供开发者查看
            print(f"提示：音频数据目录不存在 - {base_dir}")
            # 返回空结果和友好提示，不报错
            return jsonify({
                'success': True,
                'files': [],
                'total': 0,
                'page': page,
                'page_size': page_size,
                'total_pages': 0,
                'statistics': {
                    'message': '当前服务器无音频文件',
                    'date_range': '',
                    'total_files': 0,
                    'monthly_breakdown': {}
                }
            })
        
        # If no date range specified, find the latest month
        if not start_year or not start_month or not end_year or not end_month:
            # Scan directory to find latest month
            try:
                month_dirs = []
                for item in os.listdir(base_dir):
                    item_path = os.path.join(base_dir, item)
                    if os.path.isdir(item_path) and len(item) == 6 and item.isdigit():
                        month_dirs.append(item)
                
                if not month_dirs:
                    return jsonify({'success': True, 'files': [], 'total': 0, 'statistics': {}})
                
                # Sort and get the latest month
                month_dirs.sort(reverse=True)
                latest_month = month_dirs[0]
                start_year = end_year = latest_month[:4]
                start_month = end_month = latest_month[4:6]
            except Exception as e:
                return jsonify({'success': False, 'error': f'无法读取目录: {str(e)}'}), 500
        
        # Collect all files in the date range
        all_files = []
        month_statistics = {}
        
        # Generate list of months in range
        start_ym = int(f"{start_year}{start_month}")
        end_ym = int(f"{end_year}{end_month}")
        
        current_year = int(start_year)
        current_month = int(start_month)
        
        while True:
            year_month = f"{current_year}{current_month:02d}"
            ym_int = int(year_month)
            
            if ym_int > end_ym:
                break
            
            # Initialize statistics for this month
            month_statistics[year_month] = {
                'call_in': 0,
                'call_out': 0,
                'total': 0
            }
            
            # Check if month directory exists
            month_dir = os.path.join(base_dir, year_month)
            
            if not os.path.exists(month_dir):
                # Directory doesn't exist, add to statistics but with zero counts
                pass
            else:
                # Process call_in and call_out directories
                for call_type in ['call_in', 'call_out']:
                    call_dir = os.path.join(month_dir, call_type)
                    
                    if os.path.exists(call_dir) and os.path.isdir(call_dir):
                        try:
                            files = os.listdir(call_dir)
                            mp3_files = [f for f in files if f.endswith('.mp3')]
                            
                            # Update statistics (always count all files for statistics)
                            count = len(mp3_files)
                            month_statistics[year_month][call_type] = count
                            month_statistics[year_month]['total'] += count
                            
                            # Add files to list (apply call_type filter if specified)
                            if not call_type_filter or call_type_filter == call_type:
                                for filename in mp3_files:
                                    session_id = filename[:-4]  # Remove .mp3 extension
                                    all_files.append({
                                        'year': str(current_year),
                                        'month': f"{current_month:02d}",
                                        'year_month': year_month,
                                        'call_type': call_type,
                                        'call_type_display': '呼入' if call_type == 'call_in' else '呼出',
                                        'filename': filename,
                                        'session_id': session_id
                                    })
                        except Exception as e:
                            pass  # Silently skip directories that can't be read
            
            # Move to next month
            current_month += 1
            if current_month > 12:
                current_month = 1
                current_year += 1
        
        # Sort files
        if sort_by == 'year_month':
            all_files.sort(key=lambda x: x['year_month'], reverse=(sort_order == 'desc'))
        elif sort_by == 'call_type':
            all_files.sort(key=lambda x: x['call_type'], reverse=(sort_order == 'desc'))
        elif sort_by == 'filename':
            all_files.sort(key=lambda x: x['session_id'], reverse=(sort_order == 'desc'))
        elif sort_by == 'year':
            all_files.sort(key=lambda x: x['year'], reverse=(sort_order == 'desc'))
        elif sort_by == 'month':
            all_files.sort(key=lambda x: x['month'], reverse=(sort_order == 'desc'))
        
        # Calculate pagination
        total_files = len(all_files)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_files = all_files[start_idx:end_idx]
        
        # Calculate total statistics
        total_call_in = sum(stats['call_in'] for stats in month_statistics.values())
        total_call_out = sum(stats['call_out'] for stats in month_statistics.values())
        total_all = sum(stats['total'] for stats in month_statistics.values())
        
        return jsonify({
            'success': True,
            'files': paginated_files,
            'total': total_files,
            'page': page,
            'page_size': page_size,
            'total_pages': (total_files + page_size - 1) // page_size,
            'statistics': {
                'months': month_statistics,
                'total_call_in': total_call_in,
                'total_call_out': total_call_out,
                'total_all': total_all,
                'date_range': f"{start_year}年{start_month}月 - {end_year}年{end_month}月"
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/audio_file/<year>/<month>/<call_type>/<filename>')
def serve_audio_file(year, month, call_type, filename):
    """Serve audio file from the audio data directory"""
    try:
        # Validate parameters
        if call_type not in ['call_in', 'call_out']:
            return jsonify({'error': 'Invalid call type'}), 400
        
        if not filename.endswith('.mp3'):
            return jsonify({'error': 'Invalid file format'}), 400
        
        # Construct file path
        base_dir = '/data/disk4/jr_audio_data'
        year_month = f"{year}{month}"
        file_path = os.path.join(base_dir, year_month, call_type, filename)
        
        # Security check - ensure the resolved path is within base_dir
        file_path = os.path.abspath(file_path)
        base_dir = os.path.abspath(base_dir)
        
        if not file_path.startswith(base_dir):
            return jsonify({'error': 'Invalid file path'}), 403
        
        # Check if file exists
        if not os.path.exists(file_path):
            return jsonify({'error': '文件不存在'}), 404
        
        # Send file
        return send_file(file_path, mimetype='audio/mpeg')
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
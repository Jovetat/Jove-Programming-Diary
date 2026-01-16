document.addEventListener('DOMContentLoaded', function() {
    const audioUrlForm = document.getElementById('audioUrlForm');
    const audioFileForm = document.getElementById('audioFileForm');
    const processUrlBtn = document.getElementById('processUrlBtn');
    const processFileBtn = document.getElementById('processFileBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContainer = document.getElementById('resultsContainer');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const asrText = document.getElementById('asrText');
    const dialogueSegments = document.getElementById('dialogueSegments');
    const complaintDomainResult = document.getElementById('complaintDomainResult');
    const complaintIntentResult = document.getElementById('complaintIntentResult');
    const complaintThirdLevelResult = document.getElementById('complaintThirdLevelResult');
    const complaintIntentReasoning = document.getElementById('complaintIntentReasoning');
    const reconciliationResult = document.getElementById('reconciliationResult');
    const reconciliationReasoning = document.getElementById('reconciliationReasoning');
    const solutionDomainResult = document.getElementById('solutionDomainResult');
    const solutionIntentResult = document.getElementById('solutionIntentResult');
    const solutionThirdLevelResult = document.getElementById('solutionThirdLevelResult');
    const solutionReasoning = document.getElementById('solutionReasoning');
    const solutionThirdLevelReasoning = document.getElementById('solutionThirdLevelReasoning');
    const appealDomainResult = document.getElementById('appealDomainResult');
    const appealIntentResult = document.getElementById('appealIntentResult');
    const appealThirdLevelResult = document.getElementById('appealThirdLevelResult');
    const appealReasoning = document.getElementById('appealReasoning');
    const appealThirdLevelReasoning = document.getElementById('appealThirdLevelReasoning');
    const audioPlayer = document.getElementById('audioPlayer');

    // Evaluation form elements
    const evalFileForm = document.getElementById('evalFileForm');
    const evaluationForm = document.getElementById('evaluationForm');
    const evalLoadingIndicator = document.getElementById('evalLoadingIndicator');
    const evalResultContainer = document.getElementById('evalResultContainer');
    const evalErrorContainer = document.getElementById('evalErrorContainer');
    const downloadLink = document.getElementById('downloadLink');

    // Correction form elements
    const correctionFileForm = document.getElementById('correctionFileForm');
    const correctionLoadingIndicator = document.getElementById('correctionLoadingIndicator');
    const correctionContent = document.getElementById('correctionContent');
    const correctionErrorContainer = document.getElementById('correctionErrorContainer');
    const correctionErrorMessage = document.getElementById('correctionErrorMessage');
    const correctionSuccessContainer = document.getElementById('correctionSuccessContainer');
    const dataList = document.getElementById('dataList');
    const correctionDetails = document.getElementById('correctionDetails');
    const correctionDialogueSegments = document.getElementById('correctionDialogueSegments');
    const correctionAsrText = document.getElementById('correctionAsrText');
    const correctionAudioPlayer = document.getElementById('correctionAudioPlayer');
    // add complaint elements
    const modelComplaintDomain = document.getElementById('modelComplaintDomain');
    const modelComplaintIntent = document.getElementById('modelComplaintIntent');
    const modelComplaintThirdLevel = document.getElementById('modelComplaintThirdLevel');
    const modelComplaintIntentReasoning = document.getElementById('modelComplaintIntentReasoning');
    // Add appeal elements
    const modelAppealDomain = document.getElementById('modelAppealDomain');
    const modelAppealIntent = document.getElementById('modelAppealIntent');
    const modelAppealThirdLevel = document.getElementById('modelAppealThirdLevel');
    const modelAppealReasoning = document.getElementById('modelAppealReasoning');
    const modelAppealThirdLevelReasoning = document.getElementById('modelAppealThirdLevelReasoning');
    // Add solution elements
    const modelSolutionDomain = document.getElementById('modelSolutionDomain');
    const modelSolutionIntent = document.getElementById('modelSolutionIntent');
    const modelSolutionThirdLevel = document.getElementById('modelSolutionThirdLevel');
    const modelSolutionReasoning = document.getElementById('modelSolutionReasoning');
    const modelSolutionThirdLevelReasoning = document.getElementById('modelSolutionThirdLevelReasoning');
    // Add reconciliation elements
    const modelReconciliationStatus = document.getElementById('modelReconciliationStatus');
    const modelReconciliationReasoning = document.getElementById('modelReconciliationReasoning');
    // Add corrected complaint elements
    const correctedComplaintDomain = document.getElementById('correctedComplaintDomain');
    const correctedComplaintIntent = document.getElementById('correctedComplaintIntent');
    const correctedComplaintThirdLevel = document.getElementById('correctedComplaintThirdLevel');
    // Add corrected appeal elements
    const correctedAppealDomain = document.getElementById('correctedAppealDomain');
    const correctedAppealIntent = document.getElementById('correctedAppealIntent');
    const correctedAppealThirdLevel = document.getElementById('correctedAppealThirdLevel');
    // Add corrected solution elements
    const correctedSolutionDomain = document.getElementById('correctedSolutionDomain');
    const correctedSolutionIntent = document.getElementById('correctedSolutionIntent');
    const correctedSolutionThirdLevel = document.getElementById('correctedSolutionThirdLevel');
    // Add corrected reconciliation elements
    const correctedReconciliationStatus = document.getElementById('correctedReconciliationStatus');
    const correctionReason = document.getElementById('correctionReason');
    const correctionForm = document.getElementById('correctionForm');
    const downloadCorrectedFile = document.getElementById('downloadCorrectedFile');

    // Store current segments data for synchronization
    let currentSegments = [];
    let activeSegmentIndex = -1;
    let correctionData = []; // Store all correction data
    let currentCorrectionIndex = -1; // Current item being corrected
    let correctionSessionId = null; // Session ID for correction operations

    // Tag options
    let tagOptions = {
        complaint: {},
        appeal: {},
        solution: {},
        reconciliation: {}
    };

    // Fetch tag options when the page loads
    fetchTagOptions();

    // Handle URL form submission
    audioUrlForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const audioUrl = document.getElementById('audioUrl').value;

        if (!audioUrl) {
            showError('请输入音频URL');
            return;
        }

        processAudioUrl(audioUrl);
    });

    // Handle file form submission
    audioFileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const audioFile = document.getElementById('audioFile').files[0];

        if (!audioFile) {
            showError('请选择音频文件');
            return;
        }

        processAudioFile(audioFile);
    });

    // Handle evaluation file form submission
    evalFileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const evalFile = document.getElementById('evalFile').files[0];

        if (!evalFile) {
            showError('请选择一个Excel文件');
            return;
        }

        processEvalFile(evalFile);
    });

    // Handle evaluation form submission (file path)
    evaluationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const filePath = document.getElementById('taggedFilePath').value;

        if (!filePath) {
            showError('请输入文件路径');
            return;
        }

        processEvalFilePath(filePath);
    });

    // Handle correction file form submission
    correctionFileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const correctionFile = document.getElementById('correctionFile').files[0];

        if (!correctionFile) {
            showCorrectionError('请选择一个Excel文件');
            return;
        }

        processCorrectionFile(correctionFile);
    });

    // Handle correction form submission
    correctionForm.addEventListener('submit', function(e) {
        e.preventDefault();

        saveCorrection();
    });

    // Skip correction button
    document.getElementById('skipCorrectionBtn').addEventListener('click', function() {
        moveToNextCorrection();
    });

    // Audio player time update for synchronization
    audioPlayer.addEventListener('timeupdate', function() {
        highlightCurrentSegment();
    });

    // Correction audio player time update for synchronization
    correctionAudioPlayer.addEventListener('timeupdate', function() {
        highlightCurrentCorrectionSegment();
    });
    function fetchTagOptions() {
        fetch('/tag_options')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                tagOptions = data.options;

                // Update all select options with the fetched data
                // This is needed for pages that don't go through the correction flow
                updateSelectOptionsFromData();
            }
        })
        .catch(error => {
            console.error('Error fetching tag options:', error);
        });
    }

    // Update select options based on fetched tag options data
    function updateSelectOptionsFromData() {
        // Only update if we have the data and we're on a page with the relevant elements
        if (tagOptions) {
            // Update appeal domain options
            if (tagOptions.appeal && correctedAppealDomain) {
                correctedAppealDomain.innerHTML = '<option value="">请选择诉求类型</option>';
                Object.keys(tagOptions.appeal).forEach(domain => {
                    const option = document.createElement('option');
                    option.value = domain;
                    option.textContent = domain;
                    correctedAppealDomain.appendChild(option);
                });
            }

            // Update solution domain options
            if (tagOptions.solution && correctedSolutionDomain) {
                correctedSolutionDomain.innerHTML = '<option value="">请选择解决方案类型</option>';
                Object.keys(tagOptions.solution).forEach(domain => {
                    const option = document.createElement('option');
                    option.value = domain;
                    option.textContent = domain;
                    correctedSolutionDomain.appendChild(option);
                });
            }

            // Update reconciliation status options
            if (tagOptions.reconciliation && correctedReconciliationStatus) {
                correctedReconciliationStatus.innerHTML = '<option value="">请选择解决状态</option>';
                Object.keys(tagOptions.reconciliation).forEach(status => {
                    const option = document.createElement('option');
                    option.value = status;
                    option.textContent = status;
                    correctedReconciliationStatus.appendChild(option);
                });
            }

            // Update complaint domain options
            if (tagOptions.complaint && correctedComplaintDomain) {
                correctedComplaintDomain.innerHTML = '<option value="">请选择领域</option>';
                Object.keys(tagOptions.complaint).forEach(domain => {
                    const option = document.createElement('option');
                    option.value = domain;
                    option.textContent = domain;
                    correctedComplaintDomain.appendChild(option);
                });
            }
        }
    }

    function populateDomainOptions(category, selectElement, currentValue) {
        // Clear existing options except the first one
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }

        // Add domain options
        let domains = [];
        if (category === 'claim' || category === 'complaint') {
            domains = Object.keys(tagOptions.complaint || {});
        } else {
            domains = Object.keys(tagOptions[category] || {});
        }

        domains.forEach(domain => {
            const option = document.createElement('option');
            option.value = domain;
            option.textContent = domain;
            if (domain === currentValue) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    function updateThirdLevelOptions(type, domain, intent, thirdLevelSelect) {
        // Clear existing options
        thirdLevelSelect.innerHTML = '<option value="">请选择三级标签</option>';

        // Check if we have the tag options data
        if (!tagOptions || !tagOptions[`${type}_second_third_intent_map`]) {
            return;
        }

        const secondThirdMap = tagOptions[`${type}_second_third_intent_map`];

        // Find third level options for the selected intent (second level)
        // Note: The mapping is directly from second level to third level, not from first to second to third
        if (intent && secondThirdMap[intent]) {
            const thirdLevelOptions = secondThirdMap[intent];
            thirdLevelOptions.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                thirdLevelSelect.appendChild(optionElement);
            });
        }
    }

    function updateIntentOptions(category, domain, intentSelectElement) {
        // Clear existing options except the first one
        while (intentSelectElement.options.length > 1) {
            intentSelectElement.remove(1);
        }

        // Add intent options based on selected domain
        let intents = [];
        if (category === 'claim' || category === 'complaint') {
            if (domain && tagOptions.complaint && tagOptions.complaint[domain]) {
                intents = tagOptions.complaint[domain];
            }
        } else {
            if (domain && tagOptions[category] && tagOptions[category][domain]) {
                intents = tagOptions[category][domain];
            }
        }

        intents.forEach(intent => {
            const option = document.createElement('option');
            option.value = intent;
            option.textContent = intent;
            intentSelectElement.appendChild(option);
        });

        // Update third level options if needed
        const thirdLevelSelect = category === 'complaint' ? correctedComplaintThirdLevel :
                               category === 'appeal' ? correctedAppealThirdLevel :
                               category === 'solution' ? correctedSolutionThirdLevel : null;

        if (thirdLevelSelect) {
            updateThirdLevelOptions(category, domain, intents[0], thirdLevelSelect);
        }
    }

    function populateReconciliationOptions(selectElement, currentValue) {
        // Clear existing options except the first one
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }

        // Add reconciliation options (flat structure)
        const statuses = Object.keys(tagOptions.reconciliation || {});
        statuses.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            if (status === currentValue) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    // Event listeners for domain select changes to update intent options
    correctedComplaintDomain.addEventListener('change', function() {
        updateIntentOptions('complaint', this.value, correctedComplaintIntent);
        // Also update third level options if needed
        updateThirdLevelOptions('complaint', this.value, correctedComplaintIntent.value, correctedComplaintThirdLevel);
    });

    correctedAppealDomain.addEventListener('change', function() {
        updateIntentOptions('appeal', this.value, correctedAppealIntent);
    });

    correctedSolutionDomain.addEventListener('change', function() {
        updateIntentOptions('solution', this.value, correctedSolutionIntent);
    });

    // Add event listeners for intent select changes to update third level options
    correctedComplaintIntent.addEventListener('change', function() {
        updateThirdLevelOptions('complaint', correctedComplaintDomain.value, this.value, correctedComplaintThirdLevel);
    });

    correctedAppealIntent.addEventListener('change', function() {
        updateThirdLevelOptions('appeal', correctedAppealDomain.value, this.value, correctedAppealThirdLevel);
    });

    correctedSolutionIntent.addEventListener('change', function() {
        updateThirdLevelOptions('solution', correctedSolutionDomain.value, this.value, correctedSolutionThirdLevel);
    });

    function processAudioUrl(audioUrl) {
        // Show loading indicator and hide previous results/errors
        showLoading();

        // Send request to backend
        fetch('/process_audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                audio_url: audioUrl
            })
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();

            if (data.success) {
                // Display results
                displayResults(data, audioUrl);
                resultsContainer.classList.remove('d-none');
            } else {
                // Display error
                showError(data.error || '处理过程中发生未知错误');
            }
        })
        .catch(error => {
            hideLoading();
            showError('网络错误: ' + error.message);
        });
    }

    function processAudioFile(audioFile) {
        // Show loading indicator and hide previous results/errors
        showLoading();

        // Create FormData object for file upload
        const formData = new FormData();
        formData.append('audio_file', audioFile);

        // Send request to backend file processing endpoint
        fetch('/process_audio_file', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();

            if (data.success) {
                // For file uploads, we need to create a local object URL for playback
                const fileUrl = URL.createObjectURL(audioFile);

                // Display results
                displayResults(data, fileUrl);
                resultsContainer.classList.remove('d-none');
            } else {
                // Display error
                showError(data.error || '处理过程中发生未知错误');
            }
        })
        .catch(error => {
            hideLoading();
            showError('网络错误: ' + error.message);
        });
    }

    function processEvalFile(evalFile) {
        // Show loading indicator and hide previous results/errors
        showEvalLoading();

        // Create FormData to send file
        const formData = new FormData();
        formData.append('eval_file', evalFile);

        // Send request to backend
        fetch('/evaluate_tags_file', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideEvalLoading();

            if (data.success) {
                // Display result
                downloadLink.href = '/download_evaluation/' + encodeURIComponent(data.report_filename);
                evalResultContainer.classList.remove('d-none');
            } else {
                // Display error
                document.getElementById('evalErrorMessage').textContent = data.error;
                evalErrorContainer.classList.remove('d-none');
            }
        })
        .catch(error => {
            hideEvalLoading();
            document.getElementById('evalErrorMessage').textContent = error.message;
            evalErrorContainer.classList.remove('d-none');
        });
    }

    function processEvalFilePath(filePath) {
        // Show loading indicator and hide previous results/errors
        showEvalLoading();

        // Send request to backend
        fetch('/evaluate_tags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file_path: filePath
            })
        })
        .then(response => response.json())
        .then(data => {
            hideEvalLoading();

            if (data.success) {
                // Display result
                downloadLink.href = '/download_evaluation/' + encodeURIComponent(data.report_filename);
                evalResultContainer.classList.remove('d-none');
            } else {
                // Display error
                document.getElementById('evalErrorMessage').textContent = data.error;
                evalErrorContainer.classList.remove('d-none');
            }
        })
        .catch(error => {
            hideEvalLoading();
            document.getElementById('evalErrorMessage').textContent = error.message;
            evalErrorContainer.classList.remove('d-none');
        });
    }

    function processCorrectionFile(correctionFile) {
        // Show loading indicator and hide previous results/errors
        showCorrectionLoading();

        // Create FormData to send file
        const formData = new FormData();
        formData.append('correction_file', correctionFile);

        // Send request to backend
        fetch('/upload_correction_file', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideCorrectionLoading();

            if (data.success) {
                // Store correction data and session ID
                correctionData = data.correction_data;
                correctionSessionId = data.session_id; // Store session ID for future requests

                // Display data list
                displayDataList();
                correctionContent.classList.remove('d-none');

                // Load first item for correction
                if (correctionData.length > 0) {
                    loadCorrectionItem(0);
                }
            } else {
                // Display error
                showCorrectionError(data.error || '处理过程中发生未知错误');
            }
        })
        .catch(error => {
            hideCorrectionLoading();
            showCorrectionError('网络错误: ' + error.message);
        });
    }

    function displayDataList() {
        // Clear existing list
        dataList.innerHTML = '';

        // Populate list with correction data
        correctionData.forEach((item, index) => {
            const listItem = document.createElement('a');
            listItem.href = '#';
            listItem.className = 'list-group-item list-group-item-action';
            listItem.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">记录 ${index + 1}</h6>
                    <small>${item.corrected ? '已修正' : '未修正'}</small>
                </div>
                <p class="mb-1">
                    诉点：${item.complaint_domain} | ${item.complaint_intent} | ${item.complaint_third_level || ''}<span style="margin-left: 1em;"></span>
                    诉求：${item.appeal_domain} | ${item.appeal_intent} | ${item.appeal_third_level || ''}
                </p>
                <p class="mb-1">
                    解决方案：${item.solution_domain} | ${item.solution_intent} | ${item.solution_third_level || ''}<span style="margin-left: 1em;"></span>
                    解决状态：${item.reconciliation_status || 'N/A'}
                </p>
                <small>音频URL: ${item.record_name || item.audio_url || 'N/A'}</small>
            `;

            listItem.addEventListener('click', function(e) {
                e.preventDefault();
                loadCorrectionItem(index);
            });

            dataList.appendChild(listItem);
        });
    }

    function loadCorrectionItem(index) {
        if (index < 0 || index >= correctionData.length) return;

        // Update current index
        currentCorrectionIndex = index;

        // Display the correction item
        displayCorrectionItem(index);

        // Update active item in list
        const listItems = dataList.querySelectorAll('.list-group-item');
        listItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function displayCorrectionItem(index) {
        const item = correctionData[index];
        if (!item) return;

        // Update current index
        currentCorrectionIndex = index;

        // Display dialogue segments
        if (item.dialogue_segments && Array.isArray(item.dialogue_segments) && item.dialogue_segments.length > 0) {
            displayCorrectionSegments(item.dialogue_segments);
        } else {
            correctionDialogueSegments.innerHTML = '<p class="text-muted">正在获取对话分段...</p>';

            // Try to generate segments if audio URL is available
            const audioUrl = item.record_name || item.audio_url || '';
            if (audioUrl) {
                fetch('/process_audio_for_correction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        audio_url: audioUrl
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Store the generated segments and chat text
                        correctionData[index].dialogue_segments = data.dialogue_segments;
                        correctionData[index].asr_text = data.chat_text;
                        // Update display with actual segments
                        displayCorrectionSegments(data.dialogue_segments);
                        // Update ASR text display
                        let asrText = data.chat_text || 'N/A';
                        correctionAsrText.textContent = asrText;
                    } else {
                        correctionDialogueSegments.innerHTML = `<p class="text-danger">无法获取对话分段: ${data.error || '未知错误'}</p>`;
                    }
                })
                .catch(error => {
                    correctionDialogueSegments.innerHTML = `<p class="text-danger">获取对话分段时出错: ${error.message}</p>`;
                });
            } else {
                correctionDialogueSegments.innerHTML = '<p class="text-muted">无可用的音频URL，无法显示对话分段</p>';
            }
        }

        // Display ASR text with role name replacements
        let asrText = item.asr_text || 'N/A';
        asrText = asrText.replace(/visitor/g, '客户').replace(/customer_service/g, '坐席');
        correctionAsrText.textContent = asrText;

        // Set audio source if available (use record_name column from Excel)
        const audioUrl = item.record_name || item.audio_url || '';
        if (audioUrl) {
            correctionAudioPlayer.src = audioUrl;
        } else {
            correctionAudioPlayer.removeAttribute('src');
        }

        // Display complaint model tags
        if (modelComplaintDomain) modelComplaintDomain.textContent = item.complaint_domain || 'N/A';
        if (modelComplaintIntent) modelComplaintIntent.textContent = item.complaint_intent || 'N/A';
        if (modelComplaintThirdLevel) modelComplaintThirdLevel.textContent = item.complaint_third_level || 'N/A';
        if (modelComplaintIntentReasoning) modelComplaintIntentReasoning.textContent = item.complaint_basis || 'N/A';

        // Display appeal model tags
        if (modelAppealDomain) modelAppealDomain.textContent = item.appeal_domain || 'N/A';
        if (modelAppealIntent) modelAppealIntent.textContent = item.appeal_intent || 'N/A';
        if (modelAppealThirdLevel) modelAppealThirdLevel.textContent = item.appeal_third_level || 'N/A';
        if (modelAppealReasoning) modelAppealReasoning.textContent = item.appeal_basis || 'N/A';

        // Display solution model tags
        if (modelSolutionDomain) modelSolutionDomain.textContent = item.solution_domain || 'N/A';
        if (modelSolutionIntent) modelSolutionIntent.textContent = item.solution_intent || 'N/A';
        if (modelSolutionThirdLevel) modelSolutionThirdLevel.textContent = item.solution_third_level || 'N/A';
        if (modelSolutionReasoning) modelSolutionReasoning.textContent = item.solution_basis || 'N/A';

        // Display reconciliation model tags
        if (modelReconciliationStatus) modelReconciliationStatus.textContent = item.reconciliation_status || 'N/A';
        if (modelReconciliationReasoning) modelReconciliationReasoning.textContent = item.reconciliation_reasoning || 'N/A';

        // Populate domain options
        populateDomainOptions('complaint', correctedComplaintDomain, item.complaint_domain);
        populateDomainOptions('appeal', correctedAppealDomain, item.appeal_domain);
        populateDomainOptions('solution', correctedSolutionDomain, item.solution_domain);
        populateReconciliationOptions(correctedReconciliationStatus, item.reconciliation_status);

        // Update intent options based on current domain values
        updateIntentOptions('complaint', item.complaint_domain, correctedComplaintIntent);
        updateIntentOptions('appeal', item.appeal_domain, correctedAppealIntent);
        updateIntentOptions('solution', item.solution_domain, correctedSolutionIntent);

        // Update third level options based on current domain and intent values
        updateThirdLevelOptions('complaint', item.complaint_domain, item.complaint_intent, correctedComplaintThirdLevel);
        updateThirdLevelOptions('appeal', item.appeal_domain, item.appeal_intent, correctedAppealThirdLevel);
        updateThirdLevelOptions('solution', item.solution_domain, item.solution_intent, correctedSolutionThirdLevel);

        // Set current values
        correctedComplaintDomain.value = item.complaint_domain || '';
        correctedComplaintIntent.value = item.complaint_intent || '';
        correctedComplaintThirdLevel.value = item.complaint_third_level || '';
        correctedAppealDomain.value = item.appeal_domain || '';
        correctedAppealIntent.value = item.appeal_intent || '';
        correctedAppealThirdLevel.value = item.appeal_third_level || '';
        correctedSolutionDomain.value = item.solution_domain || '';
        correctedSolutionIntent.value = item.solution_intent || '';
        correctedSolutionThirdLevel.value = item.solution_third_level || '';
        correctedReconciliationStatus.value = item.reconciliation_status || '';
        correctionReason.value = '';

        // Show correction details
        correctionDetails.classList.remove('d-none');
    }

    function displayCorrectionSegments(segments) {
        // Clear existing content
        correctionDialogueSegments.innerHTML = '';

        // Check if segments is valid and not empty
        if (!segments || !Array.isArray(segments) || segments.length === 0) {
            correctionDialogueSegments.innerHTML = '<p class="text-muted">无可用的对话分段数据</p>';
            return;
        }

        segments.forEach(segment => {
            const segmentElement = document.createElement('div');
            segmentElement.className = 'segment';

            // Parse and format time value
            const formattedTime = formatTimeHMS(segment.start);

            // Determine role display
            const role = segment.role === 'customer_service' ? '坐席' : '客户';
            const roleClass = segment.role === 'customer_service' ? 'customer_service' : 'visitor';

            // Create segment HTML
            segmentElement.innerHTML = `
                <div class="segment-time">${formattedTime}</div>
                <div class="segment-role ${roleClass}">${role}</div>
                <div class="segment-text">${segment.text}</div>
            `;

            // Add click event to play from this segment
            segmentElement.addEventListener('click', function() {
                if (correctionAudioPlayer && segment.start !== undefined) {
                    try {
                        const startTime = parseTimeValue(segment.start);
                        correctionAudioPlayer.currentTime = startTime;
                        correctionAudioPlayer.play();
                    } catch (error) {
                        console.error('Failed to play audio segment:', error);
                    }
                }
            });

            correctionDialogueSegments.appendChild(segmentElement);
        });
    }

    // Save correction data
    function saveCorrection() {
        if (currentCorrectionIndex >= 0 && currentCorrectionIndex < correctionData.length) {
            // Update the current item with corrected values
            correctionData[currentCorrectionIndex].corrected_complaint_domain = correctedComplaintDomain.value;
            correctionData[currentCorrectionIndex].corrected_complaint_intent = correctedComplaintIntent.value;
            correctionData[currentCorrectionIndex].corrected_complaint_third_level = correctedComplaintThirdLevel.value;
            correctionData[currentCorrectionIndex].corrected_appeal_domain = correctedAppealDomain.value;
            correctionData[currentCorrectionIndex].corrected_appeal_intent = correctedAppealIntent.value;
            correctionData[currentCorrectionIndex].corrected_appeal_third_level = correctedAppealThirdLevel.value;
            correctionData[currentCorrectionIndex].corrected_solution_domain = correctedSolutionDomain.value;
            correctionData[currentCorrectionIndex].corrected_solution_intent = correctedSolutionIntent.value;
            correctionData[currentCorrectionIndex].corrected_solution_third_level = correctedSolutionThirdLevel.value;
            correctionData[currentCorrectionIndex].corrected_reconciliation_status = correctedReconciliationStatus.value;
            correctionData[currentCorrectionIndex].correction_reason = correctionReason.value;

            // Send update to server
            fetch('/save_correction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: correctionSessionId,
                    index: currentCorrectionIndex,
                    corrected_complaint_domain: correctedComplaintDomain.value,
                    corrected_complaint_intent: correctedComplaintIntent.value,
                    corrected_complaint_third_level: correctedComplaintThirdLevel.value,
                    corrected_appeal_domain: correctedAppealDomain.value,
                    corrected_appeal_intent: correctedAppealIntent.value,
                    corrected_appeal_third_level: correctedAppealThirdLevel.value,
                    corrected_solution_domain: correctedSolutionDomain.value,
                    corrected_solution_intent: correctedSolutionIntent.value,
                    corrected_solution_third_level: correctedSolutionThirdLevel.value,
                    corrected_reconciliation_status: correctedReconciliationStatus.value,
                    correction_reason: correctionReason.value
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Mark current item as corrected in the data store
                    correctionData[currentCorrectionIndex].corrected = true;

                    // Update the data list display to reflect the corrected status
                    displayDataList();

                    // Show success message with download link immediately
                    correctionSuccessContainer.classList.remove('d-none');
                    correctionSuccessMessage.textContent = '记录修正已保存！';
                    if (data.download_url) {
                        downloadCorrectedFile.href = data.download_url;
                    }

                    // Move to next item or finish
                    if (currentCorrectionIndex < correctionData.length - 1) {
                        // For non-last items, auto-continue after 2 seconds but keep the download link visible
                        setTimeout(() => {
                            // Only hide message, keep container visible so user can still download
                            correctionSuccessMessage.textContent = '记录修正已保存！您可以点击上方的下载按钮获取当前修正数据。';
                            // Move to next uncorrected item
                            moveToNextCorrection();
                        }, 2000);
                    } else {
                        // Check if all items are corrected
                        const allCorrected = data.all_corrected || correctionData.every(item => item.corrected);
                        if (allCorrected) {
                            // Finished correction - all items corrected
                            correctionContent.classList.add('d-none');
                            correctionSuccessMessage.textContent = '所有数据修正完成！';
                        } else {
                            // Finished with current item, but there may be more to correct
                            correctionSuccessMessage.textContent = '当前记录修正完成！系统将自动跳转到下一个未修正记录。';
                            // Move to next uncorrected item after 2 seconds
                            setTimeout(() => {
                                moveToNextCorrection();
                            }, 2000);
                        }
                    }
                } else {
                    const errorMessage = data.error || data.message || '未知错误';
                    alert('保存失败: ' + errorMessage);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('保存修正数据时出错: ' + error.message);
            });
        }
    }

    function moveToNextCorrection() {
        // Move to next uncorrected item
        for (let i = currentCorrectionIndex + 1; i < correctionData.length; i++) {
            if (!correctionData[i].corrected) {
                loadCorrectionItem(i);
                return;
            }
        }

        // If all items are corrected, check from beginning
        for (let i = 0; i <= currentCorrectionIndex; i++) {
            if (!correctionData[i].corrected) {
                loadCorrectionItem(i);
                return;
            }
        }

        // If all items are corrected
        showCorrectionSuccess('所有记录均已修正完成！');
    }

    function showCorrectionLoading() {
        correctionLoadingIndicator.classList.remove('d-none');
        correctionContent.classList.add('d-none');
        correctionErrorContainer.classList.add('d-none');
        correctionSuccessContainer.classList.add('d-none');
    }

    function hideCorrectionLoading() {
        correctionLoadingIndicator.classList.add('d-none');
    }

    function showCorrectionError(message) {
        correctionErrorMessage.textContent = message;
        correctionErrorContainer.classList.remove('d-none');
        correctionLoadingIndicator.classList.add('d-none');
        correctionContent.classList.add('d-none');
        correctionSuccessContainer.classList.add('d-none');
    }

    function showCorrectionSuccess(message) {
        document.getElementById('correctionSuccessMessage').textContent = message;
        correctionSuccessContainer.classList.remove('d-none');
        correctionErrorContainer.classList.add('d-none');
        correctionLoadingIndicator.classList.add('d-none');

        // Scroll to top of page to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update download link with session ID
        if (correctionSessionId) {
            downloadCorrectedFile.href = '/download_corrected_file/' + correctionSessionId;
        }
    }

    function highlightCurrentCorrectionSegment() {
        if (!correctionAudioPlayer || !correctionDialogueSegments) return;

        const currentTime = correctionAudioPlayer.currentTime;
        const segments = correctionData[currentCorrectionIndex]?.dialogue_segments;

        if (!segments) return;

        // Find active segment
        let activeIndex = -1;
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const startTime = parseTimeValue(segment.start);
            const endTime = segment.end ? parseTimeValue(segment.end) : startTime + 10; // Assume 10 seconds if no end time

            if (currentTime >= startTime && currentTime <= endTime) {
                activeIndex = i;
                break;
            }
        }

        // Update UI
        const segmentElements = correctionDialogueSegments.querySelectorAll('.segment');
        segmentElements.forEach((element, index) => {
            if (index === activeIndex) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    function displayResults(data, audioSource) {
        // Set audio player source
        audioPlayer.src = audioSource;

        // Display ASR text
        asrText.textContent = data.asr_text;

        // Store segments for synchronization
        currentSegments = data.dialogue_segments;

        // Display dialogue segments
        dialogueSegments.innerHTML = '';
        data.dialogue_segments.forEach((segment, index) => {
            const segmentDiv = document.createElement('div');
            segmentDiv.className = `segment`;
            segmentDiv.dataset.index = index;
            segmentDiv.dataset.start = segment.start;
            segmentDiv.dataset.end = segment.end;

            // Time element
            const timeDiv = document.createElement('div');
            timeDiv.className = 'segment-time';
            timeDiv.textContent = `${formatTimeHMS(segment.start)}`;

            // Role element
            const roleDiv = document.createElement('div');
            roleDiv.className = `segment-role ${segment.role}`;
            roleDiv.textContent = segment.role === 'customer_service' ? '坐席' : '客户';

            // Text content
            const textDiv = document.createElement('div');
            textDiv.className = 'segment-text';
            textDiv.textContent = segment.text;

            segmentDiv.appendChild(timeDiv);
            segmentDiv.appendChild(roleDiv);
            segmentDiv.appendChild(textDiv);

            // Add click event to play from this segment
            segmentDiv.addEventListener('click', function() {
                const startTime = parseTimeValue(segment.start);
                audioPlayer.currentTime = startTime;
                audioPlayer.play();
            });

            dialogueSegments.appendChild(segmentDiv);
        });

        // Display complaint results
        if (data.complaint) {
            complaintDomainResult.textContent = data.complaint.domain || '无';
            complaintIntentResult.textContent = data.complaint.intent || '无';
            complaintThirdLevelResult.textContent = data.complaint.third_level || '无';

            // Display complaint intent reasoning if available
            if (data.complaint.intent_reasoning) {
                complaintIntentReasoning.textContent = data.complaint.intent_reasoning;
            } else {
                complaintIntentReasoning.textContent = '无可用依据';
            }
        } else {
            complaintDomainResult.textContent = '无';
            complaintIntentResult.textContent = '无';
            complaintThirdLevelResult.textContent = '无';
            complaintIntentReasoning.textContent = '无可用依据';
        }

        // Display reconciliation results if available
        if (data.reconciliation) {
            reconciliationResult.textContent = data.reconciliation.status;
            reconciliationReasoning.textContent = data.reconciliation.reasoning || '无可用依据';
        } else {
            reconciliationResult.textContent = '无';
            reconciliationReasoning.textContent = '无';
        }

        // Display solution results if available
        if (data.solution) {
            solutionDomainResult.textContent = data.solution.domain;
            solutionIntentResult.textContent = data.solution.intent;
            solutionThirdLevelResult.textContent = data.solution.third_level || '无';
            solutionReasoning.textContent = data.solution.reasoning || '无可用依据';
        } else {
            solutionDomainResult.textContent = '无';
            solutionIntentResult.textContent = '无';
            solutionThirdLevelResult.textContent = '无';
            solutionReasoning.textContent = '无';
        }

        // Display appeal results if available
        if (data.appeal) {
            appealDomainResult.textContent = data.appeal.domain;
            appealIntentResult.textContent = data.appeal.intent;
            appealThirdLevelResult.textContent = data.appeal.third_level || '无';
            appealReasoning.textContent = data.appeal.reasoning || '无可用依据';
        } else {
            appealDomainResult.textContent = '无';
            appealIntentResult.textContent = '无';
            appealThirdLevelResult.textContent = '无';
            appealReasoning.textContent = '无';
        }
    }

    function highlightCurrentSegment() {
        const currentTime = audioPlayer.currentTime;

        // Find the active segment
        let newActiveIndex = -1;
        for (let i = 0; i < currentSegments.length; i++) {
            const segment = currentSegments[i];
            const start = parseTimeValue(segment.start);
            const end = parseTimeValue(segment.end);

            if (currentTime >= start && currentTime <= end) {
                newActiveIndex = i;
                break;
            }
        }

        // Update highlighting if needed
        if (newActiveIndex !== activeSegmentIndex) {
            // Remove active class from previous segment
            if (activeSegmentIndex >= 0) {
                const previousSegment = dialogueSegments.querySelector(`.segment[data-index="${activeSegmentIndex}"]`);
                if (previousSegment) {
                    previousSegment.classList.remove('active');
                }
            }

            // Add active class to current segment
            if (newActiveIndex >= 0) {
                const currentSegment = dialogueSegments.querySelector(`.segment[data-index="${newActiveIndex}"]`);
                if (currentSegment) {
                    currentSegment.classList.add('active');
                    // Scroll to the active segment
                    currentSegment.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }

            activeSegmentIndex = newActiveIndex;
        }
    }

    function parseTimeValue(timeValue) {
        // Handle different time formats that might come from ASR
        if (typeof timeValue === 'string') {
            // If it's a string, try to parse it as a float
            timeValue = parseFloat(timeValue);
        }

        // If it's not a valid number, return 0
        if (isNaN(timeValue)) {
            return 0;
        }

        // Based on the example data, ASR is returning milliseconds
        // Values like 90ms = 0.09s, 1360ms = 1.36s, 2380ms = 2.38s
        return timeValue / 1000;
    }

    function formatTimeHMS(seconds) {
        // Parse the time value first to handle different formats
        const totalSeconds = parseTimeValue(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = Math.floor(totalSeconds % 60);
        const ms = Math.floor((totalSeconds % 1) * 100);

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
        }
    }

    function showLoading() {
        loadingIndicator.classList.remove('d-none');
        resultsContainer.classList.add('d-none');
        errorContainer.classList.add('d-none');
        processUrlBtn.disabled = true;
        processFileBtn.disabled = true;
    }

    function hideLoading() {
        loadingIndicator.classList.add('d-none');
        processUrlBtn.disabled = false;
        processFileBtn.disabled = false;
    }

    function showEvalLoading() {
        evalLoadingIndicator.classList.remove('d-none');
        evalResultContainer.classList.add('d-none');
        evalErrorContainer.classList.add('d-none');
    }

    function hideEvalLoading() {
        evalLoadingIndicator.classList.add('d-none');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.classList.remove('d-none');
    }

    // ==================== File Browser Tab ====================

    // File browser elements
    const fileBrowserTab = document.getElementById('file-browser-tab');
    const filterStartYear = document.getElementById('filterStartYear');
    const filterStartMonth = document.getElementById('filterStartMonth');
    const filterEndYear = document.getElementById('filterEndYear');
    const filterEndMonth = document.getElementById('filterEndMonth');
    const filterCallType = document.getElementById('filterCallType');
    const filterFilesBtn = document.getElementById('filterFilesBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const fileLoadingIndicator = document.getElementById('fileLoadingIndicator');
    const fileErrorContainer = document.getElementById('fileErrorContainer');
    const fileErrorMessage = document.getElementById('fileErrorMessage');
    const fileTableContainer = document.getElementById('fileTableContainer');
    const fileTableBody = document.getElementById('fileTableBody');
    const filePagination = document.getElementById('filePagination');
    const fileStatistics = document.getElementById('fileStatistics');
    const statisticsContent = document.getElementById('statisticsContent');
    const fileEmptyState = document.getElementById('fileEmptyState');
    const fileTable = document.getElementById('fileTable');

    // File browser state
    let currentFilePage = 1;
    let currentFilePageSize = 20;
    let currentSortBy = 'year_month';
    let currentSortOrder = 'asc';
    let currentFileData = null;

    // Initialize year selectors (2024 to current year)
    function initializeYearSelectors() {
        const currentYear = new Date().getFullYear();
        const startYear = 2024;
        const endYear = currentYear;

        for (let year = startYear; year <= endYear; year++) {
            const option1 = document.createElement('option');
            option1.value = year;
            option1.textContent = year + '年';
            filterStartYear.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = year;
            option2.textContent = year + '年';
            filterEndYear.appendChild(option2);
        }
    }

    // Load file list when tab is shown
    fileBrowserTab.addEventListener('shown.bs.tab', function() {
        if (!currentFileData) {
            // First time loading - load with default (latest month)
            loadFileList();
        }
    });

    // Filter button click
    filterFilesBtn.addEventListener('click', function() {
        currentFilePage = 1; // Reset to first page
        loadFileList();
    });

    // Reset filter button
    resetFilterBtn.addEventListener('click', function() {
        filterStartYear.value = '';
        filterStartMonth.value = '';
        filterEndYear.value = '';
        filterEndMonth.value = '';
        filterCallType.value = '';
        currentFilePage = 1;
        currentSortBy = 'year_month';
        currentSortOrder = 'asc';
        loadFileList();
    });

    // Table header sorting
    fileTable.addEventListener('click', function(e) {
        const th = e.target.closest('th.sortable');
        if (th) {
            const sortBy = th.dataset.sort;

            // Toggle sort order if clicking the same column
            if (currentSortBy === sortBy) {
                currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortBy = sortBy;
                currentSortOrder = 'asc';
            }

            currentFilePage = 1; // Reset to first page
            loadFileList();
        }
    });

    // Load file list from server
    function loadFileList() {
        // Show loading
        showFileLoading();

        // Build query parameters
        const params = new URLSearchParams({
            page: currentFilePage,
            page_size: currentFilePageSize,
            sort_by: currentSortBy,
            sort_order: currentSortOrder
        });

        // Add date filters if selected
        if (filterStartYear.value && filterStartMonth.value) {
            params.append('start_year', filterStartYear.value);
            params.append('start_month', filterStartMonth.value);
        }
        if (filterEndYear.value && filterEndMonth.value) {
            params.append('end_year', filterEndYear.value);
            params.append('end_month', filterEndMonth.value);
        }

        // Add call type filter if selected
        if (filterCallType.value) {
            params.append('call_type', filterCallType.value);
        }

        // Fetch file list
        fetch(`/list_audio_files?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                hideFileLoading();

                if (data.success) {
                    currentFileData = data;

                    // Update filters with returned values if they were auto-selected
                    if (data.statistics && data.statistics.date_range) {
                        // Parse date range to set filters if not already set
                        if (!filterStartYear.value || !filterStartMonth.value) {
                            const match = data.statistics.date_range.match(/(\d{4})年(\d{2})月\s*-\s*(\d{4})年(\d{2})月/);
                            if (match) {
                                filterStartYear.value = match[1];
                                filterStartMonth.value = match[2];
                                filterEndYear.value = match[3];
                                filterEndMonth.value = match[4];
                            }
                        }
                    }

                    if (data.total === 0) {
                        showFileEmptyState();
                    } else {
                        displayFileList(data);
                        displayFileStatistics(data.statistics);
                        displayFilePagination(data);
                        updateSortIcons();
                    }
                } else {
                    showFileError(data.error || '加载文件列表失败');
                }
            })
            .catch(error => {
                hideFileLoading();
                showFileError('网络错误: ' + error.message);
            });
    }

    // Display file list in table
    function displayFileList(data) {
        fileTableBody.innerHTML = '';

        data.files.forEach(file => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${file.year}</td>
                <td>${file.month}</td>
                <td>${file.call_type_display}</td>
                <td>${file.session_id}</td>
                <td>
                    <button class="btn btn-primary btn-sm analyze-btn"
                            data-year="${file.year}"
                            data-month="${file.month}"
                            data-call-type="${file.call_type}"
                            data-filename="${file.filename}">
                        分析
                    </button>
                </td>
            `;

            fileTableBody.appendChild(row);
        });

        // Add click event for analyze buttons
        document.querySelectorAll('.analyze-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const year = this.dataset.year;
                const month = this.dataset.month;
                const callType = this.dataset.callType;
                const filename = this.dataset.filename;

                analyzeAudioFile(year, month, callType, filename);
            });
        });

        fileTableContainer.classList.remove('d-none');
        fileEmptyState.classList.add('d-none');
        fileErrorContainer.classList.add('d-none');
    }

    // Display statistics
    function displayFileStatistics(statistics) {
        if (!statistics) return;

        // 如果有特殊提示信息（如：当前服务器无音频文件）
        if (statistics.message) {
            statisticsContent.innerHTML = `
                <p class="text-center text-muted py-3">
                    <i class="bi bi-info-circle"></i> ${statistics.message}
                </p>
            `;
            fileStatistics.classList.remove('d-none');
            return;
        }

        let html = `<p><strong>查询范围：</strong>${statistics.date_range} (共 ${statistics.total_all} 条记录)</p>`;
        html += '<div class="row">';

        // Display month statistics
        const months = Object.keys(statistics.months).sort();
        months.forEach(month => {
            const stat = statistics.months[month];
            if (stat.total > 0) {
                html += `
                    <div class="col-md-6 col-lg-4 mb-2">
                        <div class="month-stat">
                            <strong>${month.substring(0, 4)}年${month.substring(4, 6)}月：</strong>
                            呼入 ${stat.call_in} 条, 呼出 ${stat.call_out} 条,
                            小计 ${stat.total} 条
                        </div>
                    </div>
                `;
            }
        });

        html += '</div>';

        // Display total
        html += `
            <div class="total-stat">
                总计：呼入 ${statistics.total_call_in} 条,
                呼出 ${statistics.total_call_out} 条,
                合计 ${statistics.total_all} 条
            </div>
        `;

        statisticsContent.innerHTML = html;
        fileStatistics.classList.remove('d-none');
    }

    // Display pagination
    function displayFilePagination(data) {
        filePagination.innerHTML = '';

        const totalPages = data.total_pages;
        const currentPage = data.page;

        if (totalPages <= 1) {
            return; // No pagination needed
        }

        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage - 1}">上一页</a>`;
        filePagination.appendChild(prevLi);

        // Page numbers
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // First page
        if (startPage > 1) {
            const firstLi = document.createElement('li');
            firstLi.className = 'page-item';
            firstLi.innerHTML = `<a class="page-link" href="#" data-page="1">1</a>`;
            filePagination.appendChild(firstLi);

            if (startPage > 2) {
                const ellipsisLi = document.createElement('li');
                ellipsisLi.className = 'page-item disabled';
                ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
                filePagination.appendChild(ellipsisLi);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
            pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            filePagination.appendChild(pageLi);
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsisLi = document.createElement('li');
                ellipsisLi.className = 'page-item disabled';
                ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
                filePagination.appendChild(ellipsisLi);
            }

            const lastLi = document.createElement('li');
            lastLi.className = 'page-item';
            lastLi.innerHTML = `<a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>`;
            filePagination.appendChild(lastLi);
        }

        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage + 1}">下一页</a>`;
        filePagination.appendChild(nextLi);

        // Add click events
        filePagination.querySelectorAll('a.page-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = parseInt(this.dataset.page);
                if (page && page !== currentFilePage) {
                    currentFilePage = page;
                    loadFileList();
                }
            });
        });
    }

    // Update sort icons
    function updateSortIcons() {
        // Remove all sort classes
        fileTable.querySelectorAll('th.sortable').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
        });

        // Add class to current sorted column
        const sortedTh = fileTable.querySelector(`th[data-sort="${currentSortBy}"]`);
        if (sortedTh) {
            sortedTh.classList.add(`sort-${currentSortOrder}`);
        }
    }

    // Analyze audio file - jump to Tab 1 and auto-process
    function analyzeAudioFile(year, month, callType, filename) {
        // Construct audio URL with full domain
        const audioUrl = `${window.location.origin}/audio_file/${year}/${month}/${callType}/${filename}`;

        // Switch to audio processing tab
        const processingTab = document.getElementById('processing-tab');
        const urlTab = document.getElementById('url-tab');

        // Activate processing tab
        const processingTabTrigger = new bootstrap.Tab(processingTab);
        processingTabTrigger.show();

        // Wait for tab to be shown, then switch to URL sub-tab
        processingTab.addEventListener('shown.bs.tab', function handler() {
            // Switch to URL input sub-tab
            const urlTabTrigger = new bootstrap.Tab(urlTab);
            urlTabTrigger.show();

            // Fill in URL and submit
            setTimeout(() => {
                document.getElementById('audioUrl').value = audioUrl;
                processAudioUrl(audioUrl);
            }, 100);

            // Remove this event listener
            processingTab.removeEventListener('shown.bs.tab', handler);
        }, { once: true });
    }

    // File loading/error state functions
    function showFileLoading() {
        fileLoadingIndicator.classList.remove('d-none');
        fileTableContainer.classList.add('d-none');
        fileErrorContainer.classList.add('d-none');
        fileEmptyState.classList.add('d-none');
        fileStatistics.classList.add('d-none');
    }

    function hideFileLoading() {
        fileLoadingIndicator.classList.add('d-none');
    }

    function showFileError(message) {
        fileErrorMessage.textContent = message;
        fileErrorContainer.classList.remove('d-none');
        fileTableContainer.classList.add('d-none');
        fileEmptyState.classList.add('d-none');
        fileStatistics.classList.add('d-none');
        hideFileLoading();
    }

    function showFileEmptyState() {
        fileEmptyState.classList.remove('d-none');
        fileTableContainer.classList.add('d-none');
        fileErrorContainer.classList.add('d-none');
        fileStatistics.classList.add('d-none');
        hideFileLoading();
    }

    // Initialize year selectors on page load
    initializeYearSelectors();
});
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const extractBtn = document.getElementById('extractBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const resetBtn = document.getElementById('resetBtn');
const errorResetBtn = document.getElementById('errorResetBtn');

let selectedFile = null;

// Click to upload
dropZone.addEventListener('click', () => {
    fileInput.click();
});

// File selection via input
fileInput.addEventListener('change', (e) => {
    handleFileSelect(e.target.files[0]);
});

// Drag and drop handlers
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

function handleFileSelect(file) {
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
        showError('Please select a PDF file');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showError('File size must be less than 10MB');
        return;
    }
    
    selectedFile = file;
    fileName.textContent = `📄 ${file.name}`;
    fileName.classList.add('show');
    extractBtn.disabled = false;
}

// Extract button click
extractBtn.addEventListener('click', async () => {
    if (!selectedFile) return;
    
    // Hide all sections
    document.querySelector('.upload-section').style.display = 'none';
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');
    
    try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await fetch('http://localhost:5000/api/extract', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to process document');
        }
        
        displayResults(result.data);
    } catch (error) {
        showError(error.message);
    }
});

function displayResults(data) {
    loadingSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    
    // Display summary
    document.getElementById('summaryText').textContent = data.summary || 'No summary available';
    
    const totalAmountEl = document.getElementById('totalAmount');
    if (data.total_amount) {
        totalAmountEl.textContent = `Total Amount: ${data.total_amount}`;
        totalAmountEl.style.display = 'block';
    } else {
        totalAmountEl.style.display = 'none';
    }
    
    // Display table
    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = '';
    
    if (data.compliance_items && data.compliance_items.length > 0) {
        data.compliance_items.forEach(item => {
            const row = document.createElement('tr');
            
            const statusClass = `status-${item.status.toLowerCase().replace(/[^a-z]/g, '-')}`;
            
            row.innerHTML = `
                <td>${item.requirement || 'N/A'}</td>
                <td>${item.amount_owed || 'N/A'}</td>
                <td>${item.deadline || 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
            `;
            
            tbody.appendChild(row);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #666;">No compliance items found in document</td></tr>';
    }
}

function showError(message) {
    loadingSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    errorSection.classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
}

function resetApp() {
    selectedFile = null;
    fileInput.value = '';
    fileName.classList.remove('show');
    extractBtn.disabled = true;
    
    document.querySelector('.upload-section').style.display = 'block';
    loadingSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');
}

resetBtn.addEventListener('click', resetApp);
errorResetBtn.addEventListener('click', resetApp);
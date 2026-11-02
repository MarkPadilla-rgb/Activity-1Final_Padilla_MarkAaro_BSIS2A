const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const filesList = document.getElementById('filesList');
const viewerSection = document.getElementById('viewerSection');
const fileContent = document.getElementById('fileContent');
const closeViewerBtn = document.getElementById('closeViewerBtn');

// Load saved files from localStorage when page loads
function loadFiles() {
  const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
  if (savedFiles.length > 0) {
    displayFiles(savedFiles); // Show saved files
  }
  updateStorageBar(); // Update storage usage bar
}

// Upload button click event
uploadBtn.addEventListener('click', () => {
  const files = fileInput.files;

  // Check if user selected files
  if (files.length === 0) {
    alert('Please select files to upload');
    return;
  }

  const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];

  // Read each selected file
  Array.from(files).forEach(file => {
    const reader = new FileReader();

    // When file is loaded
    reader.onload = (e) => {
      const fileData = {
        name: file.name,              // File name
        size: file.size,              // File size
        type: file.type,              // File type
        content: e.target.result,     // File content (base64)
        uploadDate: new Date().toLocaleString() // Upload date
      };
      savedFiles.push(fileData); // Save file data
    };

    reader.readAsDataURL(file); // Convert file to base64
  });

  // Save files after short delay
  setTimeout(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(savedFiles));
    displayFiles(savedFiles);     // Show updated file list
    updateStorageBar();           // Update storage bar
    fileInput.value = '';         // Clear input
    alert('Files uploaded successfully!');
  }, 1000);
});

// Update storage usage bar
function updateStorageBar() {
  const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];

  let totalSize = 0;

  // Calculate total file size
  savedFiles.forEach(file => {
    totalSize += file.size;
  });

  const maxSize = 5 * 1024 * 1024; // Max storage (5MB)
  const usedKB = (totalSize / 1024).toFixed(2);
  const maxKB = (maxSize / 1024).toFixed(0);
  const percent = Math.min((totalSize / maxSize) * 100, 100);

  const bar = document.getElementById('storageBar');
  const text = document.getElementById('storageText');

  bar.style.width = percent + '%'; // Set bar width

  // Change color based on usage
  if (percent > 80) {
    bar.style.background = 'red';
  } else if (percent > 50) {
    bar.style.background = 'orange';
  } else {
    bar.style.background = 'green';
  }

  // Show storage text
  text.textContent = `${usedKB} KB / ${maxKB} KB used (${percent.toFixed(1)}%)`;
}

// Display files in a table
function displayFiles(files) {
  if (files.length === 0) {
    filesList.innerHTML = '<p>No files uploaded yet.</p>';
    return;
  }

  let html = '<table style="width:100%; border-collapse: collapse;">';

  // Table header
  html += '<tr style="border-bottom: 2px solid #ddd;">\
  <th style="padding: 10px; text-align: left;">File Name</th>\
  <th style="padding: 10px;">Size</th>\
  <th style="padding: 10px;">Type</th>\
  <th style="padding: 10px;">Actions</th></tr>';

  // Loop through files
  files.forEach((file, index) => {
    const sizeKB = (file.size / 1024).toFixed(2);

    html += `<tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 10px;">${file.name}</td>
      <td style="padding: 10px; text-align: center;">${sizeKB} KB</td>
      <td style="padding: 10px; text-align: center;">${file.type || 'Unknown'}</td>
      <td style="padding: 10px; text-align: center;">
        <button onclick="viewFile(${index})" style="margin-right: 5px;">View</button>
        <button onclick="deleteFile(${index})">Delete</button>
      </td>
    </tr>`;
  });

  html += '</table>';
  filesList.innerHTML = html; // Show table
}

// View file details and preview
window.viewFile = (index) => {
  const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
  const file = savedFiles[index];

  if (!file) return;

  viewerSection.style.display = 'block'; // Show viewer

  // Show file info
  fileContent.innerHTML = '<p><strong>File Name:</strong> ' + file.name + '</p>';
  fileContent.innerHTML += '<p><strong>Upload Date:</strong> ' + file.uploadDate + '</p>';
  fileContent.innerHTML += '<p><strong>Size:</strong> ' + (file.size / 1024).toFixed(2) + ' KB</p>';

  // Show preview based on file type
  if (file.type.startsWith('image/')) {
    fileContent.innerHTML += '<img src="' + file.content + '" style="max-width: 100%; max-height: 400px; margin-top: 10px;">';
  } else if (file.type.startsWith('text/')) {
    fileContent.innerHTML += '<pre style="margin-top: 10px; overflow-x: auto;">' + file.content.split(',')[1] + '</pre>';
  } else {
    fileContent.innerHTML += '<p>Preview not available. <a href="' + file.content + '" download="' + file.name + '">Download file</a></p>';
  }
};

// Delete file from storage
window.deleteFile = (index) => {
  if (confirm('Are you sure you want to delete this file?')) {
    const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    savedFiles.splice(index, 1); // Remove file
    localStorage.setItem('uploadedFiles', JSON.stringify(savedFiles));
    displayFiles(savedFiles);    // Update list
    updateStorageBar();          // Update storage
  }
};

// Close file viewer
closeViewerBtn.addEventListener('click', () => {
  viewerSection.style.display = 'none';
});

// Run when page loads
loadFiles();
document.addEventListener('DOMContentLoaded', function() {
  // Function to fetch JSON data
  fetch('media/videos.json') // Ensure the path is correct
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      renderVideos(data.videos);
      renderAudioSummary(data.audioSummary);
      renderAssignment(data.assignment);
      initializeMaterializeComponents();
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      const container = document.getElementById('video-cards');
      container.innerHTML = `<p class="red-text">Failed to load content. Please try again later.</p>`;
    });

  // Function to render video cards
  function renderVideos(videos) {
    const container = document.getElementById('video-cards');

    videos.forEach((video, index) => {
      // Create card element
      const card = document.createElement('div');
      card.className = 'col s12 m6'; // Responsive columns

      // Generate unique IDs for collapsible components
      const collapsibleId = `collapsible-${index}`;

      card.innerHTML = `
        <div class="card">
          <div class="card-content" id="${video.label}">
            <span class="card-title">${video.title}</span>
            <ul class="collapsible">
              <li>
                <div class="collapsible-header"><i class="material-icons">info</i>Instructions</div>
                <div class="collapsible-body">
                  <ol>
                    ${video.instructions.map(instr => `<li>${instr}</li>`).join('')}
                  </ol>
                </div>
              </li>
            </ul>
          </div>
          <div class="card-action">
            <div class="video-container">
              <iframe src="${video.videoUrl}" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Function to render audio summary
  function renderAudioSummary(audio) {
    const audioPlayer = document.querySelector('audio');
    audioPlayer.src = audio.audioUrl;

    // Update description if needed
    const description = document.querySelector('.card-content p strong');
    if (description) {
      description.textContent = audio.description;
    }

    // Update title if needed
    const audioTitle = document.querySelector('.section-header');
    if (audioTitle) {
      audioTitle.textContent = audio.title;
    }
  }

  // Function to render assignment
  function renderAssignment(assignment) {
    const container = document.querySelector('.container');

    // Create assignment section
    const assignmentSection = document.createElement('div');
    assignmentSection.className = 'section';

    // Create Assignment Title and Outcome
    const assignmentHeader = `
      <h4 class="section-header">${assignment.title}</h4>
      <p><strong>Outcome:</strong> ${assignment.outcome}</p>
      <p><strong>Instructions:</strong> ${assignment.instructions}</p>
    `;

    // Create Steps
    let stepsHTML = '';
    assignment.steps.forEach(step => {
      stepsHTML += `
        <div class="card">
          <div class="card-content">
            <span class="card-title">Step ${step.stepNumber}: ${step.title}</span>
            <p><strong>Watch:</strong> ${step.watch}</p>
            <p><strong>Reflect:</strong> ${step.reflect}</p>
          </div>
        </div>
      `;
    });

    // Create Final Deliverable
    const deliverableHTML = `
      <div class="card">
        <div class="card-content">
          <span class="card-title">Final Deliverable</span>
          <p>${assignment.finalDeliverable}</p>
        </div>
      </div>
    `;

    // Create Resources
    let resourcesHTML = '';
    if (assignment.resources && assignment.resources.length > 0) {
      resourcesHTML += `
        <h5>Additional Resources:</h5>
        <ul>
          ${assignment.resources.map(resource => `<li><a href="${resource.url}" target="_blank">${resource.name}</a></li>`).join('')}
        </ul>
      `;
    }

    // Assemble Assignment Section
    assignmentSection.innerHTML = `
      ${assignmentHeader}
      ${stepsHTML}
      ${deliverableHTML}
      ${resourcesHTML}
    `;

    // Append Assignment Section to Container
    container.appendChild(assignmentSection);
  }

  // Initialize Materialize Components
  function initializeMaterializeComponents() {
    const elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
  }
});

const apiUrl = 'https://api.waifu.im/search';

function fetchWaifus() {
  document.getElementById('loading').classList.remove('hidden');

  const selectedTag = document.getElementById('tag-selector').value; // Ambil nilai dari dropdown
  const gif = document.getElementById('gif-toggle').checked; // Ambil nilai dari toggle gif
  const isNsfw = document.getElementById('nsfw-toggle').checked; // Ambil nilai dari toggle is_nsfw
  const orientation = document.getElementById('orientation-selector').value; // Ambil nilai dari dropdown orientation

  const params = new URLSearchParams({
    included_tags: selectedTag,
    gif: gif,
    is_nsfw: isNsfw ? isNsfw : false,
    orientation: orientation,
    limit: 10
  });

  const requestUrl = `${apiUrl}?${params.toString()}`;

  try {
    fetch(requestUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        displayWaifus(data);
        console.log("Data waifu:", data);
      })
      .catch(error => {
        console.error('Error fetching waifu:', error);
        displayError('Gagal mengambil data waifu. Coba lagi nanti.');
      })
      .finally(() => {
        document.getElementById('loading').classList.add('hidden');
      });
  } catch (error) {
    console.error('Unexpected error:', error);
    displayError('Terjadi kesalahan tak terduga. Coba lagi nanti.');
    document.getElementById('loading').classList.add('hidden');
  }

function displayWaifus(data) {
  const waifuContainer = document.getElementById('waifu-container');
  waifuContainer.innerHTML = ''; // Bersihkan sebelumnya
  waifuContainer.className = "grid grid-cols-2 p-4"

  if (data.images && data.images.length > 0) {
    data.images.forEach(waifu => {
      const waifuCard = document.createElement('div');
      waifuCard.className = 'waifu-card bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  dark:focus:ring-cyan-800 m-2 rounded-md flex flex-col justify-between items-center p-2 gap-2';

      const img = document.createElement('img');
      img.classList = "rounded-md"
      img.src = waifu.url;
      img.alt = 'Waifu Image';

      const artistInfo = document.createElement('p');
      artistInfo.className = "text-sm text-center text-white"
      artistInfo.innerHTML = `Artist: <a href="${waifu.artist?.twitter || '#'}" target="_blank">${waifu.artist?.name || 'Unknown'}</a>`;

      const downloadButton = document.createElement('button');
      downloadButton.className = 'buttonDownload mx-auto flex flex-row items-center justify-center';
      downloadButton.innerHTML = `
               
                <button data-ripple-light="true" class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
  Download
</button> 
            `;

      downloadButton.onclick = () => {
        downloadImage(waifu.url, waifu.artist?.name || 'waifu_image');
      };

      waifuCard.appendChild(img);
      waifuCard.appendChild(artistInfo);
      waifuCard.appendChild(downloadButton);
      waifuContainer.appendChild(waifuCard);
    });
  } else {
    waifuContainer.innerHTML = '<p class="text-center p-2 text-red-800">Gambar atau Gif ditemukan.</p>';
  }
}

function downloadImage(url, filename) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      const fileExtension = blob.type.includes('gif') ? '.gif' : '.jpg';
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename + fileExtension;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    })
    .catch(error => {
      console.error('Error downloading image:', error);
      displayError('Gagal mengunduh gambar. Coba lagi nanti.');
    });
}

function displayError(message) {
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message';
  errorContainer.textContent = message;
  document.body.appendChild(errorContainer);

  setTimeout(() => {
    document.body.removeChild(errorContainer);
  }, 5000);
}}

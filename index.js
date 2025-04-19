const apiUrl = "https://api.waifu.im/search"


function fetchWaifus(limit) {
  document.getElementById("loading").classList.remove("hidden")

  const selectedTag = document.getElementById("tag-selector").value // Ambil nilai dari dropdown
  const gif = document.getElementById("gif-toggle").checked // Ambil nilai dari toggle gif
  const isNsfw = document.getElementById("nsfw-toggle").checked // Ambil nilai dari toggle is_nsfw
  const orientation = document.getElementById("orientation-selector").value // Ambil nilai dari dropdown orientation

  const params = new URLSearchParams({
    included_tags: selectedTag,
    gif: gif,
    is_nsfw: isNsfw ? isNsfw : false,
    orientation: orientation,
    limit,
  })

  const requestUrl = `${apiUrl}?${params.toString()}`

  try {
    fetch(requestUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        displayWaifus(data)
        console.log("Data waifu:", data)
      })
      .catch((error) => {
        console.error("Error fetching waifu:", error)
        displayError("Gagal mengambil data waifu. Coba lagi nanti.")
      })
      .finally(() => {
        document.getElementById("loading").classList.add("hidden")
      })
  } catch (error) {
    console.error("Unexpected error:", error)
    displayError("Terjadi kesalahan tak terduga. Coba lagi nanti.")
    document.getElementById("loading").classList.add("hidden")
  }

  function displayWaifus(data) {
    const waifuContainer = document.getElementById("waifu-container")
    const waifuContainerHeader = document.getElementById("waifu-container-header")
    const waifuFooter = document.getElementById("waifu-footer")
    waifuFooter.innerHTML = "" // Bersihkan footer sebelumnya
    waifuContainerHeader.innerHTML = "" // Update header dengan jumlah waifu yang ditemukan
    waifuContainer.innerHTML = "" // Bersihkan sebelumnya
    waifuContainer.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 p-4"

    if (data.images && data.images.length > 0) {
      let totalWaifus = data.images.length
      const footer_text = document.createElement("p")
      if (totalWaifus === 30) {
        footer_text.className = "text-sm text-center text-pink-800 inline-block cursor-pointer p-4 bg-transparent hover:bg-pink-200 rounded-md border-2 border-pink-500"
        footer_text.innerText = `Tampilkan lebih sedikit`
        footer_text.onclick = () => {
          fetchWaifus(10)
        }
      } else {
        footer_text.className = "text-sm text-center text-pink-800 inline-block cursor-pointer p-4 bg-transparent hover:bg-pink-200 rounded-md border-2 border-pink-500"
        footer_text.innerText = `Tampilkan lebih banyak`
        footer_text.onclick = () => {
          fetchWaifus(30)
        }
      }

      waifuContainerHeader.innerHTML = `<h2 class="text-center text-lg font-bold text-pink-800">Hasil gambar sebanyak ${totalWaifus}</h2>`
      data.images.forEach((waifu) => {
        const waifuCard = document.createElement("div")
        waifuCard.className =
          "waifu-card bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:outline-none dark:focus:ring-pink-800 rounded-md flex flex-col justify-between items-center p-2 gap-2"

        const img = document.createElement("img")
        img.classList = "rounded-md"
        img.src = waifu.url
        img.alt = "Waifu Image"

        const artistInfo = document.createElement("p")
        artistInfo.className = "text-sm text-center text-white"
        artistInfo.innerHTML = `Artist: <a href="${waifu.artist?.twitter || "#"}" target="_blank">${waifu.artist?.name || "Unknown"}</a>`

        const downloadButton = document.createElement("button")
        downloadButton.className = "buttonDownload mx-auto flex flex-row items-center justify-center"
        downloadButton.innerHTML = `
       <button data-ripple-light="true" class="rounded-md bg-black py-2 px-4 border border-pink-400 text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-pink-400 focus:shadow-none active:bg-pink-400 hover:bg-pink-900 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
         Download
       </button>
     `

        downloadButton.onclick = () => {
          downloadImage(waifu.url, waifu.artist?.name || "waifu_image")
        }


        waifuFooter.appendChild(footer_text)
        waifuCard.appendChild(img)
        waifuCard.appendChild(artistInfo)
        waifuCard.appendChild(downloadButton)
        waifuContainer.appendChild(waifuCard)
        waifuContainerHeader.appendChild(waifuContainer)
        waifuContainerHeader.appendChild(waifuFooter)
      })
    } else {
      waifuContainer.innerHTML = '<p class="text-center p-2 text-red-800">Gambar atau Gif ditemukan.</p>'
    }
  }

  function downloadImage(url, filename) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.blob()
      })
      .then((blob) => {
        const fileExtension = blob.type.includes("gif") ? ".gif" : ".jpg"
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = filename + fileExtension
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
      })
      .catch((error) => {
        console.error("Error downloading image:", error)
        displayError("Gagal mengunduh gambar. Coba lagi nanti.")
      })
  }

  function displayError(message) {
    const errorContainer = document.createElement("div")
    errorContainer.className = "error-message"
    errorContainer.textContent = message
    document.body.appendChild(errorContainer)

    setTimeout(() => {
      document.body.removeChild(errorContainer)
    }, 5000)
  }
}

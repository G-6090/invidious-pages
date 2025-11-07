document.getElementById('searchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    const results = document.getElementById('results');
    results.innerHTML = 'Поиск...';

    // Список инстансов, которые будем перебирать
    const instances = [
        'https://invidious.perennialte.ch',
        'https://iv.ggtyler.dev',
        'https://invidious.weareallalright.com',
        'https://yewtu.be',
        'https://invidious.privacydev.net'
    ];

    let found = false;

    for (const instance of instances) {
        try {
            const response = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                displayResults(data, results, instance);
                found = true;
                break; // Останавливаемся на первом работающем инстансе
            }
        } catch (err) {
            console.warn(`Ошибка с ${instance}:`, err.message);
            continue; // Пробуем следующий инстанс
        }
    }

    if (!found) {
        results.innerHTML = 'Ошибка: ни один из инстансов не отвечает. Попробуй позже.';
    }
});

function displayResults(data, resultsElement, instance) {
    resultsElement.innerHTML = '';

    const videos = data.filter(item => item.type === 'video').slice(0, 10);

    if (videos.length === 0) {
        resultsElement.innerHTML = 'Видео не найдены.';
        return;
    }

    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.style.marginBottom = '20px';
        videoElement.style.padding = '10px';
        videoElement.style.border = '1px solid #ddd';
        videoElement.style.borderRadius = '8px';

        videoElement.innerHTML = `
            <a href="${instance}/watch?v=${video.videoId}" target="_blank">
                <img src="${video.videoThumbnails[0]?.url}" width="160" style="vertical-align: top;">
                <strong>${video.title}</strong>
            </a><br>
            <small>${video.author} • ${video.viewCountText || 'N/A'} • ${video.publishedText || 'N/A'}</small>
        `;

        resultsElement.appendChild(videoElement);
    });
}

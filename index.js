import { getEmbedSu } from "./src/extractors/embedsu.js";
import { getTwoEmbed } from "./src/extractors/2Embed.js";

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  if (pathname === '/') {
    return new Response(JSON.stringify({
      INTRO: "Welcome to the unofficial vidsrcPro provider",
      ROUTES: {
        movie: "/embedsu|2embed/:movieTMDBid",
        show: "/embedsu|2embed/:showTMDBid?s=seasonNumber&e=episodeNumber",
        all_movie: "/combined/:movieTMDBid",
        all_show: "/combined/:showTMDBid?s=seasonNumber&e=episodeNumber"
      },
      AUTHOR: "This api is developed and created by Inside4ndroid Studios"
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  if (pathname.startsWith('/embedsu/')) {
    const tmdbId = pathname.split('/').pop();
    const season = searchParams.get('s');
    const episode = searchParams.get('e');

    try {
      let vidsrcresponse;
      if (season && episode) {
        vidsrcresponse = await getEmbedSu(tmdbId, season, episode);
      } else {
        vidsrcresponse = await getEmbedSu(tmdbId);
      }
      return new Response(JSON.stringify(vidsrcresponse), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }

  if (pathname.startsWith('/2embed/')) {
    const tmdbId = pathname.split('/').pop();
    const season = searchParams.get('s');
    const episode = searchParams.get('e');

    try {
      let vidsrcresponse;
      if (season && episode) {
        vidsrcresponse = await getTwoEmbed(tmdbId, season, episode);
      } else {
        vidsrcresponse = await getTwoEmbed(tmdbId, 0, 0);
      }
      return new Response(JSON.stringify(vidsrcresponse), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }

  if (pathname.startsWith('/combined/')) {
    const tmdbId = pathname.split('/').pop();
    const season = searchParams.get('s');
    const episode = searchParams.get('e');

    try {
      let embedSuResponse;
      let twoEmbedResponse;

      if (season && episode) {
        embedSuResponse = await getEmbedSu(tmdbId, season, episode);
        twoEmbedResponse = await getTwoEmbed(tmdbId, season, episode);
      } else {
        embedSuResponse = await getEmbedSu(tmdbId);
        twoEmbedResponse = await getTwoEmbed(tmdbId, 0, 0);
      }

      const combinedResponse = {
        embedsu: embedSuResponse,
        twoembed: twoEmbedResponse,
      };

      return new Response(JSON.stringify(combinedResponse), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }

  return new Response('Not Found', { status: 404 });
}
// Turns a stored resume link (as entered in the admin dashboard) into the two
// URLs the UI needs: an embeddable preview (for the iframe) and a direct
// download. Google Drive share links are rewritten to their /preview and
// uc?export=download forms; any other link (e.g. a direct PDF) is used as-is.

// Extract a Google Drive file ID from the common share-link shapes:
//   https://drive.google.com/file/d/<ID>/view?usp=sharing
//   https://drive.google.com/open?id=<ID>
//   https://drive.google.com/uc?export=download&id=<ID>
function driveFileId(url: string): string | null {
  const byPath = url.match(/\/file\/d\/([^/?#]+)/)
  if (byPath) return byPath[1]

  const byParam = url.match(/[?&]id=([^&]+)/)
  if (byParam) return byParam[1]

  return null
}

export type ResumeUrls = {
  previewUrl: string
  downloadUrl: string
}

// Returns null when no usable link is provided, so callers can fall back.
export function getResumeUrls(rawUrl?: string | null): ResumeUrls | null {
  const url = rawUrl?.trim()
  if (!url) return null

  const id = driveFileId(url)
  if (id) {
    return {
      previewUrl: `https://drive.google.com/file/d/${id}/preview`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${id}`,
    }
  }

  // Non-Drive link (e.g. a direct PDF URL): embed and download the same URL.
  return { previewUrl: url, downloadUrl: url }
}

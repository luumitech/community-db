/** This is for client use only */

/**
 * Create an anchor element to download blob data
 *
 * @param data Blob data to download
 * @param filename Recommended filename to use in download dialog
 */
export function startDownloadBlob(data: Blob, filename: string) {
  const pom = document.createElement('a');
  const url = URL.createObjectURL(data);
  pom.href = url;
  pom.setAttribute('download', filename);
  document.body.appendChild(pom);
  pom.click();
  pom.remove();
}

/**
 * Create an anchor element to download a URL (URL must get GET-able)
 *
 * @param url URL to download
 * @param exportFn Recommended filename to use in download dialog
 */
export function startDownloadUrl(url: string, exportFn: string) {
  const pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', exportFn);
  document.body.appendChild(pom);
  pom.click();
  pom.remove();
}

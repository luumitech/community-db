/**
 * Attach listener on all img elements, and resolves when all images have
 * finished loading
 */
async function waitForImages(container: Document) {
  const images = container.querySelectorAll('img');

  return Promise.all(
    Array.from(images).map((img) => {
      if (img.complete && img.naturalHeight !== 0) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
}

/**
 * Embed html in an iframe, and invoke the browser print function
 *
 * @param html HTML content to render
 */
export async function printHtml(html: string) {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  const iframeWindow = iframe.contentWindow;
  if (iframeWindow) {
    const doc = iframeWindow.document;
    doc.open();
    doc.write(`
    <html>
      <head>
        <style>
          @media print {
            body, html {
              width: 100%;
              max-width: none;
              margin: 0;
            }
            img {
              display: block;
              width: 100%;
              height: auto;
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `);
    doc.close();

    await new Promise((resolve) => (iframe.onload = resolve));
    await waitForImages(doc);

    iframeWindow.focus();
    iframeWindow.print();
  }

  // Remove iframe from document
  document.body.removeChild(iframe);
}

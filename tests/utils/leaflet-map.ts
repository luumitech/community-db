import { expect, type Page } from '@playwright/test';

/** Wait for map tiles to load completed */
export async function waitForMapTile(page: Page) {
  await page.waitForFunction(() => {
    const mapTiles = document.querySelectorAll(
      'div.leaflet-tile-container > img'
    );
    return (
      mapTiles.length > 0 &&
      Array.from(mapTiles).every((tile) => {
        const style = window.getComputedStyle(tile);
        const loaded = tile.classList.contains('leaflet-tile-loaded');
        return loaded && style.opacity === '1';
      })
    );
  });
}

/** Zoom in map */
export async function zoomIn(page: Page) {
  const zoomButton = page.getByLabel('Zoom in');
  await zoomButton.click();

  await waitForMapTile(page);
}

/** Zoom out map */
export async function zoomOut(page: Page) {
  // If zoom control is available on map, this is an alternative
  const zoomButton = page.getByLabel('Zoom out');
  await zoomButton.click();

  await waitForMapTile(page);
}

type KeyboardMoveKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

/**
 * Simulate mouse movement to drag map around
 *
 * @param page Browser page context
 * @param dragX Pixel to drag in x direction (+ve means drag right)
 * @param dragY Pixel to drag in y direction (+ve means drag down)
 */
export async function moveMap(page: Page, moveList: KeyboardMoveKey[]) {
  const mapLocator = page.locator('.leaflet-container');
  // Focus the map
  await mapLocator.click();

  for (const move of moveList) {
    await page.keyboard.press(move);
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(300);
  }

  await waitForMapTile(page);
}

/**
 * Enter an address into the geosearch address bar
 *
 * @param page Browser page context
 * @param address Address to search for
 */
export async function searchAddress(page: Page, address: string) {
  const searchInput = page.locator('div.leaflet-control-geosearch input');
  await searchInput.fill(address);
  await searchInput.press('Enter');
  await expect(page.locator('.leaflet-marker-icon')).toBeVisible();

  await waitForMapTile(page);
}

/**
 * Location coordinates in pixel
 *
 * `{x: 0, y: 0}` means upper left corner of the map
 */
interface PointLocation {
  x: number;
  y: number;
}

/**
 * Draw a polygon on the map using the given coordinates
 *
 * @param page Browser page context
 * @param points Array of polygon vertex location
 */
export async function drawPolygon(page: Page, points: PointLocation[]) {
  // Find the geoman-free draw polygon button
  const drawPolygonButton = page.locator('.leaflet-pm-icon-polygon');
  await drawPolygonButton.click();

  // Find the leaflet map container box
  const mapLocator = page.locator('.leaflet-container');
  const box = await mapLocator.boundingBox();
  if (!box) {
    throw new Error('Leaflet map not visible');
  }

  // Simulate clicks to add polygon points
  for (const point of points) {
    await page.mouse.click(box.x + point.x, box.y + point.y);
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(100);
  }

  // Finish the polygon by clicking the first point again
  await page.mouse.click(box.x + points[0].x, box.y + points[0].y);

  // Wait for polygon shape to appear
  await expect(page.locator('path.leaflet-interactive')).toHaveCount(1);
}

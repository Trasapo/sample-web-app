const PRODUCT_TYPES = [
    { name: 'SGP 15A', rank: 1, od: 21.7, wall: 2.8, kgm: 1.31, color: '#3b82f6' },
    { name: 'SGP 25A', rank: 2, od: 34.0, wall: 3.2, kgm: 2.43, color: '#10b981' },
    { name: 'SGP 50A', rank: 3, od: 60.5, wall: 3.8, kgm: 5.31, color: '#f59e0b' },
    { name: 'SGP 100A', rank: 4, od: 114.3, wall: 4.5, kgm: 12.2, color: '#8b5cf6' }
];

/**
 * Chidori (Staggered) Pattern Calculation
 */
function calculateChidori(product, n, l) {
    if (n <= 0) return { weight: 0, width: 0, height: 0 };

    const d_m = product.od / 1000;
    const weight = (product.kgm * l * n).toFixed(1);

    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);

    const width = (cols * d_m).toFixed(3);
    const height = (d_m * (1 + (rows - 1) * 0.866)).toFixed(3);

    return { weight, width, height };
}

/**
 * Find the best stacking placement for a bundle on existing stacks.
 *
 * A bundle may span multiple adjacent columns if their combined width is enough
 * to support it. Among valid placements, the one with the smallest width
 * difference (balance) is preferred.
 *
 * @param {Array}       stacks          - Current stacks: { width, height, topOD, x, layerCount }
 * @param {Object}      bundle          - Bundle to place
 * @param {number}      maxBHeight      - Maximum allowed height
 * @param {number|null} thresholdLimit  - Max layerCount per stack (null = no limit)
 * @param {Function}    round3          - Rounding helper
 * @returns {{ stackIndices, y, displayWidth }|null}
 */
function findBestStackingPlacement(stacks, bundle, maxBHeight, thresholdLimit, round3) {
    let best = null;
    let bestWidthDiff = Infinity;

    for (let si = 0; si < stacks.length; si++) {
        const startStack = stacks[si];

        // First stack in span: check threshold and OD
        if (thresholdLimit !== null && startStack.layerCount >= thresholdLimit) continue;
        if (bundle.od < startStack.topOD) continue;

        const refHeight = startStack.height;
        const newHeight = round3(refHeight + bundle.bundleHeight);
        if (newHeight > maxBHeight) continue;

        let combinedWidth = 0;
        const indices = [];

        for (let sj = si; sj < stacks.length; sj++) {
            const s = stacks[sj];

            // Each stack in the span must satisfy OD, threshold, and height-level conditions
            if (bundle.od < s.topOD) break;
            if (thresholdLimit !== null && s.layerCount >= thresholdLimit) break;
            if (Math.abs(s.height - refHeight) > 0.005) break; // must be at the same level

            combinedWidth = round3(combinedWidth + s.width);
            indices.push(sj);

            // Check if the combined width of these adjacent stacks supports the bundle
            if (combinedWidth >= bundle.bundleWidth - 0.001) {
                const widthDiff = Math.abs(combinedWidth - bundle.bundleWidth);
                if (widthDiff < bestWidthDiff) {
                    bestWidthDiff = widthDiff;
                    best = {
                        stackIndices: [...indices],
                        y: refHeight,
                        displayWidth: combinedWidth
                    };
                }
                break; // Don't extend further (would only increase width difference)
            }
        }
    }

    return best;
}

/**
 * Allocation Logic
 * Goal: Minimize total trucks by greedily filling each truck as much as possible.
 *
 * Stacking rules:
 *   - Determined by OD (diameter), not product name.
 *     A bundle can be placed on top if its OD >= the OD of the topmost bundle below.
 *   - A bundle may span multiple adjacent columns if their combined width supports it.
 *   - Balance: Among valid placements, prefer the one with the smallest width difference.
 *
 * Priority order:
 *   1. Stack on existing columns (within STABLE_THRESHOLD layers) — single or multi-column span
 *   2. Start a new column side-by-side
 *   3. Stack beyond STABLE_THRESHOLD (no layer limit) — single or multi-column span
 */
function calculateAllocation(bundles, maxW, maxBWidth, maxBHeight) {
    let remainingBundles = [...bundles];
    const trucks = [];
    const STABLE_THRESHOLD = 2; // Prefer spreading wide before stacking a 3rd layer

    const round1 = (val) => Math.round(val * 10) / 10;
    const round3 = (val) => Math.round(val * 1000) / 1000;

    while (remainingBundles.length > 0) {
        let currentWeight = 0;
        // stacks: { width, height, topOD, x, layerCount }
        // Note: bundles are NOT stored here; positions are tracked in bundlesWithPos directly.
        const stacks = [];
        const bundlesWithPos = [];

        // Sort: Smallest OD first → placed at the bottom of stacks
        remainingBundles.sort((a, b) => a.od - b.od);

        for (let i = 0; i < remainingBundles.length; i++) {
            const bundle = remainingBundles[i];

            // Skip if this bundle would exceed the weight limit for the current truck
            if (round1(currentWeight + bundle.weight) > maxW) continue;

            let placed = false;

            // --- Priority 1: Stack on existing columns (within STABLE_THRESHOLD) ---
            const placement1 = findBestStackingPlacement(
                stacks, bundle, maxBHeight, STABLE_THRESHOLD, round3
            );

            if (placement1) {
                const spanStacks = placement1.stackIndices.map(idx => stacks[idx]);
                bundlesWithPos.push({
                    ...bundle,
                    x: spanStacks[0].x,
                    y: placement1.y,
                    displayWidth: placement1.displayWidth
                });
                const newHeight = round3(placement1.y + bundle.bundleHeight);
                spanStacks.forEach(s => {
                    s.height = newHeight;
                    s.topOD = bundle.od;
                    s.layerCount++;
                });
                placed = true;
            }

            // --- Priority 2: Start a new column side-by-side ---
            if (!placed) {
                const currentTotalWidth = stacks.reduce((sum, s) => round3(sum + s.width), 0);
                if (round3(currentTotalWidth + bundle.bundleWidth) <= maxBWidth &&
                    bundle.bundleHeight <= maxBHeight) {

                    stacks.push({
                        width: bundle.bundleWidth,
                        height: bundle.bundleHeight,
                        topOD: bundle.od,
                        x: currentTotalWidth,
                        layerCount: 1
                    });
                    bundlesWithPos.push({
                        ...bundle,
                        x: currentTotalWidth,
                        y: 0,
                        displayWidth: bundle.bundleWidth
                    });
                    placed = true;
                }
            }

            // --- Priority 3: Stack beyond STABLE_THRESHOLD (no layer limit) ---
            if (!placed) {
                const placement3 = findBestStackingPlacement(
                    stacks, bundle, maxBHeight, null, round3
                );

                if (placement3) {
                    const spanStacks = placement3.stackIndices.map(idx => stacks[idx]);
                    bundlesWithPos.push({
                        ...bundle,
                        x: spanStacks[0].x,
                        y: placement3.y,
                        displayWidth: placement3.displayWidth
                    });
                    const newHeight = round3(placement3.y + bundle.bundleHeight);
                    spanStacks.forEach(s => {
                        s.height = newHeight;
                        s.topOD = bundle.od;
                        s.layerCount++;
                    });
                    placed = true;
                }
            }

            if (placed) {
                currentWeight = round1(currentWeight + bundle.weight);
                remainingBundles.splice(i, 1);
                i--;
            }
        }

        if (stacks.length === 0 && remainingBundles.length > 0) {
            const f = remainingBundles[0];
            alert(`積載不可: ${f.name} が車両制限を超えています。`);
            break;
        }

        trucks.push({
            bundles: bundlesWithPos,
            totalWeight: currentWeight,
            loadFactor: ((currentWeight / maxW) * 100).toFixed(1),
            totalWidth: stacks.reduce((sum, s) => round3(sum + s.width), 0).toFixed(3),
            totalHeight: Math.max(...stacks.map(s => s.height), 0).toFixed(3)
        });
    }
    return trucks;
}

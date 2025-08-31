// Streaming utilities for handling real-time AI responses

export interface StreamingOptions {
    onProgress?: (progress: number) => void;
    onChunk?: (chunk: string) => void;
    onComplete?: (fullResponse: any) => void;
    onError?: (error: string) => void;
}

export interface StreamingResult {
    abort: () => void;
    promise: Promise<any>;
}

/**
 * Makes a streaming request to an API endpoint and handles the response
 */
export function makeStreamingRequest(
    url: string,
    body: any,
    options: StreamingOptions = {}
): StreamingResult {
    const controller = new AbortController();
    const signal = controller.signal;

    const promise = new Promise<any>((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            signal,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                // For now, we'll handle regular responses
                // In a full streaming implementation, we'd use response.body.getReader()
                return response.json();
            })
            .then(data => {
                options.onComplete?.(data);
                resolve(data);
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    // Request was aborted, this is expected
                    return;
                }

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                options.onError?.(errorMessage);
                reject(error);
            });
    });

    return {
        abort: () => controller.abort(),
        promise,
    };
}

/**
 * Simulates streaming progress for UI feedback
 */
export function simulateStreamingProgress(
    duration: number = 3000,
    onProgress?: (progress: number) => void
): { abort: () => void } {
    let progress = 0;
    let interval: NodeJS.Timeout;

    const startTime = Date.now();

    interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 95); // Cap at 95% until complete

        if (newProgress > progress) {
            progress = newProgress;
            onProgress?.(Math.round(progress));
        }

        if (progress >= 95) {
            clearInterval(interval);
        }
    }, 100);

    return {
        abort: () => {
            clearInterval(interval);
            onProgress?.(100); // Complete on abort
        }
    };
}

/**
 * Formats streaming text chunks for display
 */
export function formatStreamingText(
    chunks: string[],
    maxLength: number = 1000
): string {
    const combined = chunks.join('');
    return combined.length > maxLength
        ? combined.substring(0, maxLength) + '...'
        : combined;
}

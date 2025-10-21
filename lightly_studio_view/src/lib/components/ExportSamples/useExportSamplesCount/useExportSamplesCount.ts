import { client } from '$lib/services/dataset';
import type { ExportFilter } from '$lib/services/types';
import { writable, type Readable } from 'svelte/store';

interface UseExportSamplesCountProps {
    dataset_id: string;
    includeFilter?: ExportFilter;
    excludeFilter?: ExportFilter;
}

interface UseExportSamplesCountReturn {
    isLoading: Readable<boolean>;
    error: Readable<string | undefined>;
    count: Readable<number>;
}

/**
 * Hook for exporting dataset data with filters
 * @param params Export parameters including dataset_id and filters
 * @returns Object containing export state and trigger function
 */
export function useExportSamplesCount({
    dataset_id,
    includeFilter,
    excludeFilter
}: UseExportSamplesCountProps): UseExportSamplesCountReturn {
    const count = writable(0);
    const error = writable<string | undefined>(undefined);
    const isLoading = writable(false);

    const hasIncludeFilter = includeFilter && Object.keys(includeFilter).length > 0;
    const hasExcludeFilter = excludeFilter && Object.keys(excludeFilter).length > 0;
    if (hasIncludeFilter || hasExcludeFilter) {
        isLoading.set(true);

        client
            .POST('/api/datasets/{dataset_id}/export/stats', {
                params: {
                    path: {
                        dataset_id
                    }
                },
                body: {
                    include: includeFilter,
                    exclude: excludeFilter
                }
            })
            .then((response) => {
                if (response?.data) {
                    count.set(response.data);
                }
            })
            .catch((_error) => {
                error.set(_error.message);
            })
            .finally(() => {
                isLoading.set(false);
            });
    }

    return {
        isLoading,
        error,
        count
    };
}

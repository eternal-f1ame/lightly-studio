import { deleteAnnotationMutation } from '$lib/api/lightly_studio_local/@tanstack/svelte-query.gen';
import { createMutation } from '@tanstack/svelte-query';
import { get } from 'svelte/store';

export const useDeleteAnnotation = ({ datasetId }: { datasetId: string }) => {
    const mutation = createMutation(deleteAnnotationMutation());

    // We need to have this subscription to get onSuccess/onError events
    mutation.subscribe(() => undefined);

    const deleteAnnotation = (annotationId: string) =>
        new Promise<void>((resolve, reject) => {
            get(mutation).mutate(
                {
                    path: {
                        dataset_id: datasetId,
                        annotation_id: annotationId
                    }
                },
                {
                    onSuccess: () => {
                        resolve();
                    },
                    onError: (error) => {
                        reject(error);
                    }
                }
            );
        });

    return {
        deleteAnnotation
    };
};

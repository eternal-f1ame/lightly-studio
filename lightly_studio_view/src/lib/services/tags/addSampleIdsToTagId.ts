import { client } from '../dataset';
import type { LoadResult, SampleIdsBody } from '../types';

type AddSampleIdsToTagIdResult = LoadResult<boolean | undefined>;
type AddSampleIdsToTagIdParams = {
    dataset_id: string;
    tag_id: string;
    sampleIdsBody: SampleIdsBody;
};

// TODO: properly abstract each endpoint and use the types of client to make the request
export const addSampleIdsToTagId = async ({
    dataset_id,
    tag_id,
    sampleIdsBody
}: AddSampleIdsToTagIdParams): Promise<AddSampleIdsToTagIdResult> => {
    const result: AddSampleIdsToTagIdResult = { data: undefined, error: undefined };
    try {
        const response = await client.POST('/api/datasets/{dataset_id}/tags/{tag_id}/add/samples', {
            params: {
                path: {
                    dataset_id,
                    tag_id
                }
            },
            body: sampleIdsBody
        });

        if (response.error) {
            throw new Error(JSON.stringify(response.error, null, 2));
        }
        if (!response.data) {
            throw new Error('No data');
        }
        result.data = response.data;
    } catch (e) {
        result.error = 'Error assigning sampleIds to tag: ' + String(e);
    }

    return result;
};

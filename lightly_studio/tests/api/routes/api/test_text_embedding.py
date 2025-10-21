from typing import Mapping
from uuid import uuid4

from fastapi.testclient import TestClient
from pytest_mock import MockerFixture

from lightly_studio.api.routes.api.status import (
    HTTP_STATUS_OK,
)
from lightly_studio.dataset.embedding_manager import (
    EmbeddingManager,
    EmbeddingManagerProvider,
)


def test_embed_text(mocker: MockerFixture, test_client: TestClient) -> None:
    # Initialize the embedding_manager with a mock variant so it does not update
    # the singleton.
    mocker.patch.object(
        EmbeddingManagerProvider,
        "get_embedding_manager",
        return_value=EmbeddingManager(),
    )
    # Mock the EmbeddingManager return value.
    mocker.patch.object(
        EmbeddingManager,
        "embed_text",
        return_value=[0.1, 0.2, 0.3],
    )

    # Make the request to the `/text_embedding` endpoint.
    params: Mapping[str, str] = {
        "query_text": "sample",
    }
    response = test_client.get("/api/text_embedding/embed_text", params=params)

    # Assert the response
    assert response.status_code == HTTP_STATUS_OK
    assert response.json() == [0.1, 0.2, 0.3]


def test_embed_text_embedding_invalid_model_id(
    mocker: MockerFixture,
    test_client: TestClient,
) -> None:
    # Make the request to the `/samples` endpoint
    mocker.patch.object(
        EmbeddingManagerProvider,
        "get_embedding_manager",
        return_value=EmbeddingManager(),
    )
    test_uuid = uuid4()

    response = test_client.get(
        "/api/text_embedding/embed_text",
        params={
            "query_text": "sample",
            "embedding_model_id": str(test_uuid),
        },
    )
    assert response.status_code == 500
    assert response.json() == {"detail": f"Embedding model with ID {test_uuid} not found."}

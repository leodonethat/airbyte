#
# Copyright (c) 2022 Airbyte, Inc., all rights reserved.
#

from connector_builder.generated.apis.default_api_interface import initialize_router
from connector_builder.impl.default_api import DefaultApiImpl
from connector_builder.impl.low_code_cdk_adapter import LowCodeSourceAdapter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Connector Builder Server API",
    description="Connector Builder Server API ",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(initialize_router(DefaultApiImpl(LowCodeSourceAdapter)))

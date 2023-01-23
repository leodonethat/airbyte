#
# Copyright (c) 2022 Airbyte, Inc., all rights reserved.
#


import sys

from airbyte_cdk.entrypoint import launch
from source_ethereum_api import SourceEthereumApi

if __name__ == "__main__":
    source = SourceEthereumApi()
    launch(source, sys.argv[1:])

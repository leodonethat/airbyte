
from typing import Any, Iterable, List, Mapping, MutableMapping, Optional, Tuple, Union, Dict

import requests
from airbyte_cdk.sources import AbstractSource
from airbyte_cdk.sources.streams import Stream
from airbyte_cdk.sources.streams.http import HttpStream
from airbyte_cdk.sources.streams.http.auth import TokenAuthenticator
from airbyte_cdk.sources.streams.http.auth import NoAuth

class SourceEthereumApi(AbstractSource):

    def check_connection(self, logger, config) -> Tuple[bool, any]:
        """ TODO implement a real connection check (getting the last block?)"""
        return True, None

    def streams(self, config: Mapping[str, Any]) -> List[Stream]:
        # NoAuth just means there is no authentication required for this API and is included for completeness.
        # Skip passing an authenticator if no authentication is required.
        # Other authenticators are available for API token-based auth and Oauth2.
        auth = NoAuth()
        return [EthereumBlocks(authenticator=auth, config=config)]


class EthereumBlocks(HttpStream):
    """
    This class willl extract data from using the method eth_getBlockByNumber.
    It has been tested with an Erigon client running locally.
    Note that we need a POST request and pass params in the body.
    The name of this class will be the name of the stream used later in airbyte

    This is equivalent to the following command:
    curl -H 'Content-Type: application/json' -X POST
            --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber",
            "params":["0x0", true],"id":1}'  127.0.0.1:8545
    """

    primary_key = None
    cursor_field = "number"
    _cursor_value = 0

    # we will read a hex string into an int
    start_block = 0
    end_block = 0

    def __init__(self, config: Mapping[str, Any], **kwargs):
        super().__init__()
        self.url_address = config['url_address']
        self.url_port = config['url_port']
        self.start_block = int(config['start_block'], 16)
        self.end_block = int(config['end_block'], 16)
        self._cursor_value = 0

    @property
    def url_base(self) -> str:
        return (self.url_address + ":" + self.url_port)

    @property
    def http_method(self) -> str:
        return "POST"

    def request_headers(self, **kwargs) -> Mapping[str, Any]:
        return {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

    def request_body_json(
        self,
        stream_state: Mapping[str, Any] = None,
        stream_slice: Mapping[str, Any] = None,
        next_page_token: Mapping[str, Any] = None,
    ) -> Optional[Union[Dict[str, Any], str]]:
        block_number_int = stream_slice['number']
        block_number_hex = hex(block_number_int)
        data = {
            "jsonrpc": "2.0",
            "method": "eth_getBlockByNumber",
            "params": [block_number_hex, True],
            "id":1,
        }
        return data

    @property
    def state(self) -> Mapping[str, Any]:
        """ State needed for incremental updates, to keep track of last block read """
        if self._cursor_value:
            return {self.cursor_field: self._cursor_value}
        else:
            return {self.cursor_field: self.start_block}

    @state.setter
    def state(self, value: Mapping[str, Any]):
        self._cursor_value = value[self.cursor_field]

    def read_records(self, *args, **kwargs) -> Iterable[Mapping[str, Any]]:
        for record in super().read_records(*args, **kwargs):
            latest_record_block = int(record[self.cursor_field], 16)
            self._cursor_value = max(self._cursor_value, latest_record_block)
            yield record

    def stream_slices(self, sync_mode, cursor_field: List[str] = None, stream_state: Mapping[str, Any] = None) -> Iterable[Optional[Mapping[str, Any]]]:
        start_block = stream_state[self.cursor_field] if stream_state and self.cursor_field in stream_state else self.start_block

        # create list of dictionaries for the slices
        list_numbers = list(range(start_block, self.end_block + 1))
        list_dicts = list(map(lambda number: {'number': number}, list_numbers))
        return list_dicts

    def next_page_token(self, response: requests.Response) -> Optional[Mapping[str, Any]]:
        # The API does not offer pagination, so we return None to indicate there are no more pages in the response
        return None

    def path(
        self,
        stream_state: Mapping[str, Any] = None,
        stream_slice: Mapping[str, Any] = None,
        next_page_token: Mapping[str, Any] = None
    ) -> str:
        return ""  # TODO

    def parse_response(
        self,
        response: requests.Response,
        stream_state: Mapping[str, Any],
        stream_slice: Mapping[str, Any] = None,
        next_page_token: Mapping[str, Any] = None,
    ) -> Iterable[Mapping]:
        return [response.json()['result']]

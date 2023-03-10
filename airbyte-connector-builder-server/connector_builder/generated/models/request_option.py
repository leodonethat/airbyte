# coding: utf-8

from __future__ import annotations
from datetime import date, datetime  # noqa: F401

import re  # noqa: F401
from typing import Any, Dict, List, Optional  # noqa: F401

from pydantic import AnyUrl, BaseModel, EmailStr, Field, validator  # noqa: F401


class RequestOption(BaseModel):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.

    RequestOption - a model defined in OpenAPI

        inject_into: The inject_into of this RequestOption.
        field_name: The field_name of this RequestOption [Optional].
    """

    inject_into: str = Field(alias="inject_into")
    field_name: Optional[str] = Field(alias="field_name", default=None)

RequestOption.update_forward_refs()
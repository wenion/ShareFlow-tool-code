"""
Copyright (c) 2024, Centre for Learning Analytics at Monash (CoLAM).
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
"""


"""
This file defines the data models for user event tracking, consisting of two
classes: UserEventRecord and UserEvent.

The UserEventRecord class represents a session or task and maintains an index
to a list of UserEvent instances, each capturing specific user interactions
during that session or task.

These models are designed for efficient querying, indexing, and full-text
search of user activity data.
"""


class UserEventRecord(JsonModel):
    """
    Represents a record of a user event within the system, capturing relevant
    details such as timestamps, session ID, and task information.

    Attributes:
        startstamp (int): The starting timestamp of the event (indexed).
        endstamp (int): The ending timestamp of the event (indexed).
        session_id (str): The session identifier for the event, supports full-text search and sorting.
        task_name (Optional[str]): The name of the task associated with the event, supports full-text search and sorting.
        description (str): A description of the event, supports full-text search and sorting.
        target_uri (str): The target URI related to the event, supports full-text search and sorting.
        start (int): The timestamp for when the event started (indexed).
        completed (int): The timestamp for when the event was completed (indexed).
        userid (str): The user identifier, indexed for search.
        groupid (str): The group identifier, indexed for search.
        shared (int): Whether the event was shared or private, indexed for search.
    """
    startstamp: int = Field(index=True)
    endstamp: int = Field(index=True)
    session_id: str = Field(full_text_search=True, sortable=True)
    task_name: Optional[str] = Field(full_text_search=True, sortable=True)
    description: str = Field(full_text_search=True, sortable=True)
    target_uri: str = Field(full_text_search=True, sortable=True)
    start: int = Field(index=True)
    completed: int = Field(index=True)
    userid: str = Field(index=True)
    groupid: str = Field(index=True)
    shared: int = Field(index=True)


class UserEvent(JsonModel):
    """
    Represents a user event, detailing the interaction type, context, and system metadata.
    This class captures various event properties such as event type, timestamp, 
    and interaction-specific details.

    Attributes:
        event_type (str): The type of the event (indexed and searchable).
        timestamp (int): The timestamp of when the event occurred (indexed).
        tag_name (str): The name of the HTML tag associated with the event (indexed).
        text_content (str): The textual content involved in the event (indexed).
        base_url (str): The URL where the event took place (indexed).
        userid (str): The identifier of the user associated with the event (indexed).
        ip_address (Optional[str]): The IP address of the user, supports full-text search and sorting.
        interaction_context (Optional[str]): The context of the interaction, supports full-text search and sorting.
        event_source (Optional[str]): The source of the event, supports full-text search and sorting.
        system_time (Optional[datetime]): The system time of the event.
        x_path (Optional[str]): The XPath location of the event within the DOM, supports full-text search and sorting.
        offset_x (Optional[float]): The X-axis offset value, supports full-text search and sorting.
        offset_y (Optional[float]): The Y-axis offset value, supports full-text search and sorting.
        doc_id (Optional[str]): The document identifier, supports full-text search and sorting.
        region (Optional[str]): The region associated with the event, indexed and defaults to "Australia/Sydney".
        session_id (Optional[str]): The session identifier for the event, supports full-text search and sorting.
        task_name (Optional[str]): The task name associated with the event, supports full-text search and sorting.
        width (Optional[int]): The width dimension of the event target, supports full-text search and sorting.
        height (Optional[int]): The height dimension of the event target, supports full-text search and sorting.
        image (Optional[str]): The image content associated with the event, if any.
        title (Optional[str]): The title of the event or page, supports full-text search and sorting.
    """
    event_type: str = Field(index=True, full_text_search=True)
    timestamp: int = Field(index=True)
    tag_name: str = Field(index=True)
    text_content: str = Field(index=True)
    base_url: str = Field(index=True)
    userid: str = Field(index=True)
    ip_address: Optional[str] = Field(full_text_search=True, sortable=True)
    interaction_context: Optional[str] = Field(full_text_search=True, sortable=True)
    event_source: Optional[str] = Field(full_text_search=True, sortable=True)
    system_time: Optional[datetime]
    x_path: Optional[str] = Field(full_text_search=True, sortable=True)
    offset_x: Optional[float] = Field(full_text_search=True, sortable=True)
    offset_y: Optional[float] = Field(full_text_search=True, sortable=True)
    doc_id: Optional[str] = Field(full_text_search=True, sortable=True)
    region: Optional[str] = Field(index=True, default="Australia/Sydney")
    session_id: Optional[str] = Field(full_text_search=True, sortable=True)
    task_name: Optional[str] = Field(full_text_search=True, sortable=True)
    width: Optional[int] = Field(full_text_search=True, sortable=True)
    height: Optional[int] = Field(full_text_search=True, sortable=True)
    image: Optional[str]
    title: Optional[str] = Field(full_text_search=True, sortable=True)
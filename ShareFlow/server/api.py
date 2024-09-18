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
This module provides functionality for handling user event records and generating
ShareFlows based on user interactions.

The `batch_steps` function retrieves a list of user events within a specified
time range, and the `read` function processes these events and generates a
response including ShareFlows if applicable.

---

Function Definitions:

1. `batch_steps(user_event_record, url)`
   - Retrieves a list of user events within the specified time range from
     `user_event_record`.
   - Parameters:
     - `user_event_record` (UserEventRecord): The record containing start and end
       timestamps for the desired time range.
     - `url` (str): The URL used for fetching data (not used in the current implementation).
   - Returns:
     - List of UserEvent instances within the time range specified by
       `user_event_record.startstamp` and `user_event_record.endstamp`.

2. `read(context, request)`
   - Fetches and processes user event records, generates ShareFlows if applicable,
     and returns a structured response.
   - Parameters:
     - `context` (object): Context object containing the user event record.
     - `request` (object): Request object (not used in the current implementation).
   - Returns:
     - A dictionary containing:
       - `taskName`: The name of the task from the `user_event_record`.
       - `sessionId`: The session ID from the `user_event_record`.
       - `timestamp`: The start timestamp from the `user_event_record`.
       - `steps`: The list of user events (or None if no events are found).
       - `task_name`: The task name from the `user_event_record`.
       - `session_id`: The session ID from the `user_event_record`.
       - `userid`: The user ID from the `user_event_record`.
       - `groupid`: The group ID from the `user_event_record`.
       - `shared`: The shared flag from the `user_event_record`.
       - `dc`: ShareFlows generated from the user events (or None if no events are found).

Dependencies:
- `shareflows_process` from `shareflow_process`: A function used to generate
  ShareFlows based on the user events.
- `UserEventRecord`: A class representing the record of user events with
  timestamps and other metadata.

Notes:
- The `batch_steps` function is intended to retrieve a list of user events,
  but the `url` parameter is not used in the current implementation.
- The `read` function processes the user event record and generates a response
  that includes ShareFlows if there are any user events in the specified range.
"""

from shareflow_process import shareflows_process


def batch_steps(user_event_record, url):
    return list(UserEvent)[user_event_record.startstamp, user_event_record.endstamp]


@api_config(
    route_name="api.recording",
    request_method="GET",
    link_name="recording.read",
    description="Fetch an recording",
)
def read(context, request):
    record = context.user_event_record
    results = batch_steps(record)
    if len(results):
        shareflow = results[0]
        dc = shareflows_process(results)
        return {**shareflow, "dc": dc}
    else:
        return {
            "taskName": record.task_name,
            'sessionId': record.session_id,
            "timestamp": record.startstamp,
            "steps": None,
            "task_name": record.task_name,
            "session_id": record.session_id,
            "userid": record.userid,
            "groupid": record.groupid,
            "shared": record.shared,
            "dc": None,
            },

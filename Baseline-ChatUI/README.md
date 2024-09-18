
#  Baseline - Chat UI

## Overview

** Baseline - Chat UI** is a web-based chat application with API support that provides users with the ability to interact with various models for their information needs. It is deployed and accessible through the following URLs:

- **Chat UI**: [chat.kmass.io](https://chat.kmass.io)
- **API**: [api.kmass.io](https://api.kmass.io)
  
The Chat UI is built upon Hugging Face's chat app framework, while the API offers support for multiple models such as:

- Echo model: Returns the input prompt.
- Meta's LLaMA 2 model.
- Anthropic's Claude 3: Haiku model.
- Retrieval-Augmented Generation (RAG) model.

## Chat UI

The ** Baseline - Chat UI** allows users to log in and engage with LLM-based agents. To access the chat interface, form a URL with the appropriate query parameters: `model`, `subject_id`, `task_id`, and `token`. All parameters should be passed as strings.

### Example Login URL:
```
https://chat.kmass.io/?model="test_model"&subject_id="test_subject"&task_id="test_task"&token="ThisIsATestToken"
```

> **Note**: Including the `token` parameter is equivalent to logging in with your credentials. Share these links securely.

For guidance on generating links, identifying valid model names, or retrieving your account's token, use the "Create Subject-Task" link located at the bottom left corner of the chat UI.

### Security Recommendation
Once an `apiToken` is used to log in for a session, the original user's account cannot be accessed again using the same token. Therefore, we recommend testing links locally using an incognito browser.

## Large Language Models (LLM)

Users can interact with the following LLMs via the Chat UI to fulfill their information needs:

- **Anthropic Claude 3 Haiku Model**: 
  - Released on March 14, 2014
  - Consists of 20B parameters
- **Retrieval Augmented Generation (RAG)**: 
  - A state-of-the-art technique that augments the LLM with domain-specific corpora

Both the Chat UI and API support seamless integration with the KMASS system.

## Hint Initialization for Subjects/Tasks

Hint initialization allows the insertion of customizable hints into the chat prompts for each subject or task. Hints can be passed in one of two formats:

### 1. Full Hint

You can pass a full hint string directly using the `hint` URL parameter. Example:
```
https://chat.kmass.io/?hint=The%20user%20is%20a%20test%20user&subject_id=test&task_id=test&token=token
```

### 2. Keyword Arguments for Default Hints

This method assumes a stored hint with customizable keywords. The stored hint must be communicated to the APL team ahead of time. Keyword values can be passed as additional GET parameters, which will be expanded server-side. Example:
```
https://chat.kmass.io/?user_type=test&subject_id=test&task_id=test&token=token
```

You can also use the "Create Subject/Task Link" modal dialog. By default, a hint with a keyword argument is displayed, allowing users to customize their chat experience.

## API Documentation

The full API documentation is available at [api.kmass.io/docs](https://api.kmass.io/docs). The API supports interactions with the same models available through the Chat UI.

## Contact

For assistance or inquiries, please reach out to the  support team via email.

--- 
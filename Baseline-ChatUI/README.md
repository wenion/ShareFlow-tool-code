
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

## API Documentation

The full API documentation is available at [api.kmass.io/docs](https://api.kmass.io/docs). The API supports interactions with the same models available through the Chat UI.

## Contact

For assistance or inquiries, please reach out to the  support team via email.

--- 

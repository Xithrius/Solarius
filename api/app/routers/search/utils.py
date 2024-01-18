from typing import Any

from transformers import pipeline


def summarize_search_snippets(text: str) -> Any:
    summarizer = pipeline("summarization", model="t5-base")
    summary = summarizer(text, max_length=50, min_length=10, do_sample=False)

    print(summary)

    summary_text = summary[0]["summary_text"]

    return summary_text

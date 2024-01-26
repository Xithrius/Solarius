import re

from transformers import pipeline


def capitalize_after_punctuation(text: str) -> str:
    pattern = r"([!?:;])(\s?)([a-z])"

    def replace(match: re.Match[str]) -> str:
        return match.group(1) + match.group(2) + match.group(3).upper()

    text = re.sub(pattern, replace, text)

    text = text[0].upper() + text[1:]

    return text.replace(" .", ".")


def summarize_search_snippets(text: str) -> str:
    summarizer = pipeline("summarization", model="t5-base")
    summary = summarizer(text, max_length=50, min_length=10, do_sample=False)

    summary_text = summary[0]["summary_text"]

    corrected_text = capitalize_after_punctuation(summary_text)

    return corrected_text

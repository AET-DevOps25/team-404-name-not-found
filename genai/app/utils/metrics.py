from prometheus_client import Counter

TOKENS_OUT = Counter(
    "genai_tokens_output_total",
    "LLM completion tokens",
    ["model"],
)

TOKENS_IN = Counter(
    "genai_tokens_input_total",
    "LLM prompt tokens",
    ["model"],
)

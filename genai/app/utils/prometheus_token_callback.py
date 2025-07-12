from typing import Any, Optional, Dict

from langchain_core.callbacks import BaseCallbackHandler

from app.utils.metrics import TOKENS_OUT, TOKENS_IN


class PrometheusTokenCallback(BaseCallbackHandler):
    """Record completion-token counts in Prometheus."""

    def on_llm_end(
        self, response, *, run_id, parent_run_id: Optional[str] = None, **kwargs: Any
    ):
        llm_output: Dict = response.llm_output or {}
        if llm_output:
            model_name = llm_output["model_name"] or "unknown"
            token_usage = llm_output["token_usage"] or {}
            if token_usage:
                TOKENS_OUT.labels(model=model_name).inc(
                    token_usage.get("completion_tokens", 0)
                )
                TOKENS_IN.labels(model=model_name).inc(
                    token_usage.get("prompt_tokens", 0)
                )

from typing import Any, List

def enrich_subplot(subplot: Any, xticks: List[Any], lim: float) -> None:

    subplot.set_xticklabels(xticks)
    _, top = subplot.get_ylim()

    if (top > lim):
        subplot.axhline(lim, linewidth=1.0, linestyle="dotted", color="black")

from typing import Any, List

def enrich_subplot(subplot: Any, xticks: List[Any]) -> None:

    subplot.set_xticklabels(xticks)
    _, top = subplot.get_ylim()

    if (top > 300):
        subplot.axhline(300, linewidth=1.0, linestyle="dotted", color="black")

    if (top > 1_000):
        subplot.axhline(1_000, linewidth=1.0, linestyle="dotted", color="red")

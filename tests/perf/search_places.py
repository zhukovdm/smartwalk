from typing import Any
from datetime import datetime
import matplotlib.pyplot as plt
import random

from lib.store import Store
from lib.smartwalk import baseUrl, make_request, serialize_request, \
    time_to_milliseconds

category_counts = [1, 2, 3, 0]
radii = [0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0]

measurements = [[[] for _ in range(len(radii))] for _ in range(len(category_counts))]

def get_url(request: dict) -> str:
    return f"{baseUrl}/search/places?query={serialize_request(request)}"

def make_trial(request: dict) -> float:
    start_time = datetime.now()
    _ = make_request(get_url(request))
    stop_time = datetime.now()

    return time_to_milliseconds(stop_time - start_time)

def measure() -> None:
    global category_counts, measurements

    with Store() as store:
        locations = store.get_locations_within((-180.0, 85.06, 180.0, -85.06))
        (keywords, keywordRv) = store.get_keywords()

        for c in range(len(category_counts)):
            for r in range(len(radii)):
                radius = radii[r] * 1_000.0
                print(f"Retrieving number of categories {category_counts[c]}, radius {radius}...")

                for _ in range(50):
                    request = {
                        "center": locations[random.randint(0, len(locations) - 1)]["location"],
                        "radius": radius,
                        "categories": [{
                            "keyword": keywords[keywordRv.rvs()],
                            "filters": {}
                        } for _ in range(category_counts[c])]
                    }
                    measurements[c][r].append(make_trial(request))

def enrich_subplot(subplot: Any) -> None:
    subplot.set_xticklabels(radii)
    _, top = subplot.get_ylim()

    if (top > 300):
        subplot.axhline(300, linewidth=1.0, linestyle="dotted", color="black")

    if (top > 1_000):
        subplot.axhline(1_000, linewidth=1.0, linestyle="dotted", color="red")

def draw() -> None:
    global category_counts, measurements

    fig, axs = plt.subplots(2, 2, figsize=(10, 5))

    #

    ax = axs[0, 0]
    ax.boxplot(measurements[0])
    enrich_subplot(ax)
    ax.set_title("1 category")
    ax.set_ylabel("Response time, ms")

    #

    ax = axs[0, 1]

    ax.boxplot(measurements[1])
    enrich_subplot(ax)
    ax.set_title("2 categories")

    #

    ax = axs[1, 0]

    ax.boxplot(measurements[2])
    enrich_subplot(ax)
    ax.set_title("3 categories")
    ax.set_xlabel("Radius, km")
    ax.set_ylabel("Response time, ms")

    #

    ax = axs[1, 1]

    ax.boxplot(measurements[3])
    enrich_subplot(ax)
    ax.set_title("∞ categories")
    ax.set_xlabel("Radius, km")

    fig.tight_layout()
    plt.savefig(f"./search-places.pdf", format="pdf")

def main():
    measure()
    draw()

main()

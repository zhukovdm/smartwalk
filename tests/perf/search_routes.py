from datetime import datetime
import matplotlib.pyplot as plt
import random

from lib.drawing import enrich_subplot
from lib.store import Store
from lib.smartwalk import baseUrl, make_request, serialize_request, \
    time_to_milliseconds

category_counts = [1, 2, 3, 5]
maxDistances = [0.1, 0.2, 0.5, 1.0, 2.0, 3.5, 5.0, 10.0, 15.0, 30.0]

measurements = [[[] for _ in range(len(maxDistances))] for _ in range(len(category_counts))]

def get_url(request: dict) -> str:
    return f"{baseUrl}/search/routes?query={serialize_request(request)}"

def make_trial(request: dict) -> float:
    start_time = datetime.now()
    _ = make_request(get_url(request))

    return time_to_milliseconds(datetime.now() - start_time)

def measure() -> None:
    global category_counts, measurements

    with Store() as store:
        locations = store.get_locations_within((-180.0, 85.06, 180.0, -85.06))
        (keywords, keywordRv) = store.get_keywords()

        for c in range(len(category_counts)):
            for d in range(len(maxDistances)):
                maxDistance = maxDistances[d] * 1_000.0
                print(f"Retrieving route of at most {maxDistance} m with {category_counts[c]} categories...")

                for _ in range(50):
                    point = locations[random.randint(0, len(locations) - 1)]["location"]

                    request = {
                        "source": point,
                        "target": point,
                        "maxDistance": maxDistance,
                        "categories": [{
                            "keyword": keywords[keywordRv.rvs()],
                            "filters": {}
                        } for _ in range(category_counts[c])],
                        "arrows": []
                    }
                    measurements[c][d].append(make_trial(request))

def draw() -> None:
    global category_counts, maxDistances, measurements

    fig, axs = plt.subplots(2, 2, figsize=(10, 5))

    #

    ax = axs[0, 0]
    ax.boxplot(measurements[0])
    enrich_subplot(ax, maxDistances)
    ax.set_title("1 category")
    ax.set_ylabel("Response time, ms")

    #

    ax = axs[0, 1]

    ax.boxplot(measurements[1])
    enrich_subplot(ax, maxDistances)
    ax.set_title("2 categories")

    #

    ax = axs[1, 0]

    ax.boxplot(measurements[2])
    enrich_subplot(ax, maxDistances)
    ax.set_title("3 categories")
    ax.set_xlabel("Max distance, km")
    ax.set_ylabel("Response time, ms")

    #

    ax = axs[1, 1]

    ax.boxplot(measurements[3])
    enrich_subplot(ax, maxDistances)
    ax.set_title("5 categories")
    ax.set_xlabel("Max distance, km")

    fig.tight_layout()
    plt.savefig(f"./perf-search-routes.pdf", format="pdf")

def main() -> None:
    measure()
    draw()

main()
